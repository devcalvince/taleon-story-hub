# Taleon GA4 Event Catalog

| Event | Trigger | Parameters | Expected frequency | GA4 type | Supabase equivalent |
|---|---|---|---|---|---|
| `page_view` | Every route navigation (manual, single mechanism) | `page_path` | 1 per navigation / refresh | Recommended (auto-disabled; manual) | `page_view` / `landing_page_view` |
| `story_view` | Story page loads successfully | `story_id`, `story_slug`, `story_title`, `story_genre` | 1 per story load | Custom | `story_view` |
| `chapter_start` | Chapter page mounts | `story_id`, `story_slug`, `story_title`, `chapter_id`, `chapter_number` | 1 per chapter load | Custom | `chapter_start` |
| `chapter_progress` | Reader crosses 25% / 50% / 75% (once each) | + `progress_percentage` (25/50/75 numeric) | ≤3 per chapter read | Custom | `chapter_25` / `chapter_50` / `chapter_75` |
| `chapter_complete` | Reader reaches 100% | + `progress_percentage` = 100 | ≤1 per chapter read | Custom (Key Event candidate) | `chapter_complete` |
| `story_follow` | Follow succeeds (DB confirm) | `story_id`, `story_slug`, `story_title`, `story_genre` | 1 per successful follow | Custom (Key Event candidate) | `story_follow` |
| `story_bookmark` | Bookmark add/remove succeeds | `story_id`, `story_slug`, `story_title`, `bookmark_action` | 1 per successful action | Custom | `story_bookmark` |
| `search` | Search submitted, results loaded | `search_term` (+ result_count in Supabase) | 1 per query | Recommended | `search` |
| `share` | Share/copy-link clicked | `method`, `content_type`, `item_id` | 1 per share action | Recommended | `share` |
| `sign_up` | Credentials signup succeeds | `method` = credentials | 1 per signup | Recommended (Key Event candidate) | `signup` |
| `login` | Credentials login succeeds | `method` = credentials | 1 per login | Recommended | `login` |
| `audio_play` | Playback actually begins (`play` event on media element) | `story_id`, `chapter_id`, `media_title` | 1 per playback start | Custom | `audio_play` |
| `audio_progress` | Listening crosses 25/50/75 (once each) | + `progress_percentage` numeric | ≤3 per listen | Custom | `audio_25/50/75` |
| `audio_complete` | Audio reaches end | + `progress_percentage` = 100 | ≤1 per listen | Custom | `audio_complete` |
| `video_start` | Reserved for Taleon-owned players (no player live yet) | `video_id`, `media_title`, … | — | Custom | `video_play` |
| `video_progress` | Reserved | + `progress_percentage` | — | Custom | `video_25/50/75` |
| `video_complete` | Reserved | + `progress_percentage` = 100 | — | Custom | `video_complete` |
| `newsletter_subscribe` | Newsletter subscription succeeds (API 200) | `form_type`, `form_location` | 1 per subscription | Custom (Key Event candidate) | `newsletter_signup` |
| `generate_lead` | Contact form submission succeeds (API 200) | `form_type`, `form_location` | 1 per submission | Recommended (Key Event candidate) | `contact_submission` |

## Not sent to GA4

| Supabase event | Reason |
|---|---|
| `chapter_view` | Redundant with `chapter_start`; avoids double counting |
| `landing_page_view` | Covered by `page_view` on `/` |
| `social_referral`, `campaign_visit` | GA4 derives acquisition from UTM/referrer natively |
| `reading_progress` | Reading state, not an audience event |
| `audio_pause/seek/speed_change` | Diagnostics only |
| `story_unfollow` | Not required by spec |
| admin/system events | Internal activity must never inflate marketing metrics |

## PII guarantee

No event carries email, name, user ID, tokens, or message contents. Auth
events carry only `method`. Form events carry only `form_type` /
`form_location`.
