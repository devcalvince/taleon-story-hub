# Taleon Media — GA4 Implementation

## Measurement ID configuration

- Environment variable: `VITE_GA_MEASUREMENT_ID` (set in `.env`, deployed via Vercel env vars)
- Current value: `G-DQPV5LGJ40`
- The ID is **never hard-coded** in source; `src/lib/ga4.ts` reads it at init.
- The Measurement ID is public by design and safe in browser code. No secrets,
  API keys, or tokens are involved in GA4.

## Architecture

Taleon runs **two independent analytics systems**:

| System | Responsibility |
|---|---|
| **GA4** | Audience, acquisition, sessions, traffic sources, UTM campaigns, geography, devices, realtime, key events, audiences |
| **Supabase (`analytics_events`)** | Application telemetry: detailed story/chapter events, admin/system activity, internal diagnostics, admin dashboard |

- Both are fed from the common helpers in `src/lib/analytics.ts`. Components
  never call GA4 directly — they call `track()`, which writes to Supabase and
  mirrors public events to GA4 via `src/lib/ga4.ts`.
- The Supabase system (including `actor_type` public/admin/system separation,
  the admin dashboard, and Realtime) is fully preserved.
- Admin/system events are stored in Supabase for diagnostics but are **never
  mirrored to GA4**, so internal activity cannot inflate marketing metrics.

## Initialization

- `initGA4()` is called at module load of `src/lib/analytics.ts` (browser only;
  no-op during SSR).
- The gtag script is injected async — rendering is never blocked.
- Automatic `page_view` is disabled (`send_page_view: false`). Exactly one
  manual `page_view` is sent per route navigation from `usePageTracking` →
  `trackPageView` → `ga4PageView`. Initial load, SPA navigation, and refresh
  each produce exactly one page view; re-renders produce none.
- Every GA4 call is wrapped in try/catch. Analytics failure can never break
  reading, auth, media playback, forms, or the admin area.

## Event catalog

See [GA4_EVENT_CATALOG.md](./GA4_EVENT_CATALOG.md) for the full table.

## Custom definitions used

The application sends exactly these parameter names to match the manually
configured GA4 custom definitions:

| Parameter | Type | Notes |
|---|---|---|
| `story_title` | custom dimension | Story title |
| `story_genre` | custom dimension | Genre slug (first genre) |
| `chapter_number` | custom dimension/metric | Numeric chapter number |
| `progress_percentage` | **custom metric (numeric)** | Sent as number: 25 / 50 / 75 / 100 — never "25%" strings |
| `media_title` | custom dimension | Audio/video title |
| `form_type` | custom dimension | e.g. `email`, `contact` |

Additional standard event parameters (no custom definitions required):
`story_id`, `story_slug`, `chapter_id`, `content_type`, `method`, `item_id`,
`search_term`, `bookmark_action`, `form_location`, `page_path`.

## Key events (recommended candidates)

Configured by the GA4 administrator in the GA4 UI — not from app code:

- `sign_up`
- `newsletter_subscribe`
- `generate_lead`
- `story_follow`
- `chapter_complete`

## UTM strategy

- GA4's built-in attribution is untouched. The app never overwrites or strips
  `utm_*` parameters before the Google tag reads them (UTM capture for
  Supabase happens after page load and does not modify what gtag.js already
  received on the initial hit).
- Campaign URL format:
  `?utm_source=tiktok&utm_medium=social&utm_campaign=launch_001&utm_content=trailer_01`
- Sources in use: `tiktok`, `instagram`, `x`, `youtube`, `facebook`.

## Privacy rules

Never sent to GA4 (verified across all events):

- Email addresses, names, passwords
- JWTs / access tokens / refresh tokens
- User IDs, anonymous IDs
- Contact form or message contents
- Any PII in parameters, URLs, or custom dimensions

Auth events carry only `method` (`credentials`). Form events carry only
`form_type` / `form_location`.

## Admin / internal traffic strategy

- Client-side flags (e.g. `sessionStorage.admin_session`) are **not** used and
  must never be used — client storage is manipulable.
- Server-authoritative gating (app-side):
  - `/api/analytics/role` verifies the caller's Supabase access token and
    queries `user_roles`; the result is cached per user id client-side.
  - `track()` mirrors an event to GA4 **only** when the resolved actor is
    `public`. Admin/system events stay in Supabase diagnostics.
  - `trackPageView()` resolves the actor before sending: authenticated admins
    produce no GA4 `page_view` at all.
- For defense-in-depth, GA4 admin-side filtering is also recommended:
  1. Define internal traffic (office/team IPs) in GA4 Admin → Data streams →
     Configure tag settings → Define internal traffic.
  2. Activate the "Internal Traffic" data filter.
  3. Optionally add a Developer event parameter for debugging sessions.
- The application deliberately sends **no** `actor_type`/`admin`/`role`
  parameters to Google.

## Google OAuth login tracking

Credentials logins/signups are tracked explicitly in `AuthForm` after the
request succeeds. OAuth redirects (Google) are tracked by a listener in
`SessionProvider` on the `SIGNED_IN` auth event:

- Fires only on a real sign-in event — never on render or token refresh.
- Deduped per actual sign-in via `user id + last_sign_in_at` in localStorage.
- OAuth providers only (credentials would double-fire with AuthForm).
- Sends only `method` (e.g. `google`) — no tokens, emails, or names.

## Testing procedure (DebugView)

1. Enable the GA4 DebugView (Chrome extension "Google Analytics Debugger" or
   `debug_mode:1` param).
2. Open https://taleonmedia.vercel.app with devtools open → DebugView stream.
3. Verify each step below produces exactly ONE event with correct parameters:

| Action | Expected event(s) |
|---|---|
| Load `/` | `page_view` |
| Navigate to `/stories`, `/about`, `/genres`, `/audio`, `/watch`, `/search` | one `page_view` each |
| Refresh any page | exactly one new `page_view` |
| Open a story | `page_view` + `story_view` (story_id/slug/title/genre) |
| Open a chapter | `page_view` + `chapter_start` |
| Scroll to 25% / 50% / 75% | one `chapter_progress` each (progress_percentage = 25/50/75 numeric) |
| Scroll to bottom | `chapter_complete` (progress_percentage = 100) |
| Follow a story (signed in) | `story_follow` |
| Bookmark / unbookmark | `story_bookmark` (bookmark_action add/remove) |
| Search | `search` (search_term) |
| Share / copy link | `share` (method, content_type, item_id) |
| Sign up | `sign_up` (method=credentials) |
| Log in | `login` (method=credentials) |
| Play audio | `audio_play`, then `audio_progress` ×3, `audio_complete` |
| Newsletter signup | `newsletter_subscribe` (form_type=email, form_location=homepage) |
| Contact form | `generate_lead` (form_type=contact, form_location=contact_page) |

4. Confirm NO duplicates on React re-renders or router loader re-runs.
5. Confirm UTM parameters appear as traffic source (acquisition reports).

## GA4 vs Supabase responsibilities

See section 27 of the master spec — summarized in the architecture table above.
The short version: **GA4 owns marketing/audience truth; Supabase owns product
telemetry truth. Neither depends on the other.**
