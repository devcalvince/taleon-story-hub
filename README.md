# Taleon Story Hub

TALEON MEDIA — MASTER WEBSITE BUILD PROMPT

1. PROJECT OVERVIEW

Build a premium, cinematic storytelling platform called:

TALEON MEDIA

Tagline:

Stories that come alive.

Taleon Media is an original digital storytelling and entertainment company.

The platform will eventually allow users to:

* Discover original stories
* Read serialized chapters
* Listen to narrated chapters
* Watch story videos
* Follow stories
* Create accounts
* Save stories
* Continue reading where they stopped
* Receive notifications
* Subscribe to premium content
* Purchase premium chapters/audiobooks
* Eventually use a Taleon mobile app

The first version should be a polished, production-ready web MVP with architecture that can expand into those features later.

IMPORTANT:

Do NOT position Taleon as an "AI story generator."

Taleon is an original intellectual-property and entertainment company.

AI may be used internally to produce content, but the public-facing website should focus on:

Stories, characters, worlds, reading, listening and watching.

---

2. BRAND

Brand:

TALEON MEDIA

Short brand:

TALEON

Tagline:

Stories that come alive.

Social handle:

@taleonmedia

Current social platforms:

* TikTok: @taleonmedia
* Instagram: @taleonmedia
* YouTube: @taleonmedia
* X: @taleonmedia
* Facebook: Taleon Media

Design direction:

* Cinematic
* Premium
* Modern
* Mysterious
* Immersive
* Editorial
* Story-driven
* Sophisticated

Do NOT make the website look like:

* an AI SaaS dashboard
* a generic blogging website
* a children's website
* a cryptocurrency website
* a generic template

It should feel closer to a premium entertainment/content platform.

---

3. BRAND COLORS

Use this initial palette:

Primary background:

#080B12

Secondary background:

#111827

Accent:

#7C3AED

Highlight:

#F4C95D

Primary text:

#F5F5F5

Secondary text:

#A1A1AA

Borders:

rgba(255,255,255,0.08)

Use the colors carefully.

The website should be predominantly dark.

Purple and gold should be accents rather than overwhelming the interface.

Use subtle gradients, shadows, glow effects and cinematic imagery.

Avoid excessive neon.

---

4. TYPOGRAPHY

Use:

Display/headings:

Cinzel

Body/UI:

Inter

Headings should feel cinematic and editorial.

Body text should remain highly readable.

Do not use more than two font families.

---

5. CORE WEBSITE STRUCTURE

Create these primary pages:

/

Home

/stories

Story catalogue

/story/:slug

Individual story page

/story/:slug/chapter/:chapterNumber

Chapter reader

/audio

Audio library

/watch

Video library

/genres

Genre discovery

/search

Search results

/about

About Taleon

/pricing

Membership/premium plans

/login

Login

/signup

Sign up

/account

User account

/profile

User profile

/library

Saved/followed stories

/continue

Continue reading/listening

/admin

Admin dashboard

---

6. HOMEPAGE

The homepage should immediately communicate:

TALEON

Stories that come alive.

Hero section:

Large cinematic featured story artwork.

Example featured story:

THE LAST SIGNAL

Genre:

Sci-Fi • Mystery • African Tech Thriller

Short description:

"In Nairobi, 2047, every phone in the city receives the same message at exactly 2:17 AM."

Buttons:

[READ STORY]

[LISTEN]

[WATCH]

Use a cinematic image with a dark overlay so text remains readable.

Do NOT use generic stock photography.

Use placeholders if final artwork is not available.

---

7. HOMEPAGE SECTIONS

After the hero:

TRENDING

Display story cards.

Each card should contain:

* Cover image
* Title
* Genre
* Chapter count
* Reading/listening indicator
* Short description

Example:

THE LAST SIGNAL

Chapter 27

Sci-Fi / Mystery

[Continue]

---

NEW STORIES

Show newest stories.

Cards should be visually consistent.

---

CONTINUE READING

Only display this section for logged-in users.

Show:

* Story
* Last chapter
* Progress
* Continue button

Example:

The Last Signal

Chapter 14 of 30

[Continue Reading]

---

POPULAR THIS WEEK

Rank stories according to analytics/popularity.

Architecture should support future real analytics.

---

GENRES

Create visually attractive genre cards:

Romance

Horror

Fantasy

Sci-Fi

Mystery

Thriller

Adventure

Drama

African Stories

Psychological

---

READ • LISTEN • WATCH

Introduce Taleon's three core formats.

READ

Serialized stories and novels.

LISTEN

Narrated stories and audiobooks.

WATCH

Cinematic story videos and adaptations.

---

TALEON ORIGINALS

Create a premium-looking section dedicated to original intellectual property.

Example:

TALEON ORIGINALS

The Last Signal

Shadow of Kilimanjaro

The Red Door

Maua

The Last Guardian

---

NEWSLETTER / ACCOUNT CTA

At the bottom:

"Never miss the next chapter."

Email input.

[JOIN TALEON]

Do not make this overly aggressive.

---

8. STORY CATALOGUE

Page:

/stories

Features:

* Search
* Genre filtering
* Sort by:

  * Trending
  * Newest
  * Most Read
  * Most Listened
  * Highest Rated

Story cards should support:

* Cover
* Title
* Description
* Genre
* Status
* Chapter count
* Audio availability
* Video availability

Story statuses:

* Ongoing
* Completed
* Coming Soon

---

9. STORY PAGE

Example:

THE LAST SIGNAL

Sci-Fi • Mystery • Thriller

Cover image

Description

Story metadata:

* Author
* Chapters
* Status
* Audio available
* Video available

Buttons:

[START READING]

[LISTEN]

[WATCH]

Follow button:

[+ FOLLOW]

Save button:

[♡ SAVE]

---

STORY PAGE SECTIONS

Description

Characters

Chapters

Audio

Videos

Related Stories

---

10. CHAPTER PAGE

This is one of the most important pages.

Example:

THE LAST SIGNAL

Chapter 14

THE MESSAGE

Reader interface should be extremely clean.

Allow:

* Font size adjustment
* Dark/light reading mode
* Reading width adjustment
* Progress indicator
* Previous chapter
* Next chapter
* Bookmark
* Save
* Follow story

At the end:

NEXT CHAPTER

[CONTINUE READING]

Also show:

[LISTEN TO THIS CHAPTER]

If audio exists.

---

11. AUDIO EXPERIENCE

Create /audio.

Users can browse narrated stories.

Audio player should support:

* Play
* Pause
* Seek
* Playback speed
* Volume
* Previous
* Next
* Continue listening
* Progress persistence

For logged-in users, save playback position.

Eventually support:

* Playlists
* Audiobooks
* Audio dramas
* Character voices

---

12. WATCH PAGE

Create:

/watch

This will eventually contain:

* Story trailers
* Cinematic chapters
* Shorts
* Animated stories
* Full episodes

Use video cards.

Allow:

* Play
* Continue watching
* Related story

---

13. SEARCH

Create a global search system.

Search across:

* Stories
* Chapters
* Characters
* Genres

Search bar should be accessible from the main navigation.

Show clean results with filters.

---

14. USER ACCOUNTS

Create authentication architecture.

Users should eventually be able to:

* Sign up
* Log in
* Log out
* Reset password
* Edit profile
* Follow stories
* Save stories
* Continue reading
* Continue listening
* Track history
* Manage subscription
* Receive notifications

Account dashboard:

MY TALEON

Continue Reading

Saved Stories

Following

Listening History

Watch History

Membership

Settings

---

15. DATABASE

Use a proper relational database architecture.

Recommended core entities:

users

profiles

stories

chapters

characters

genres

story_genres

story_images

chapter_images

audio_files

video_files

authors

bookmarks

follows

reading_progress

listening_progress

watch_history

subscriptions

payments

comments

notifications

analytics_events

admin_users

---

16. STORY DATA MODEL

Each story should support:

Title

Slug

Description

Short description

Cover image

Banner image

Author

Genre

Status

Publication date

Featured flag

Trending score

Views

Reads

Listens

Watch count

Rating

Chapter count

Premium/free status

---

17. CHAPTER DATA MODEL

Each chapter should support:

Title

Chapter number

Story ID

Content

Word count

Publication date

Audio URL

Video URL

Cover/scene artwork

Free/premium status

Views

Reads

Listens

Completion rate

---

18. ADMIN DASHBOARD

Create a functional admin dashboard.

This is extremely important.

Admin should be able to:

Stories

* Create story
* Edit story
* Delete/archive story
* Upload cover
* Upload banner
* Set genre
* Set status
* Feature story

Chapters

* Create chapter
* Edit chapter
* Publish
* Schedule
* Set free/premium
* Upload audio
* Upload video
* Upload images

Users

* View users
* Search users
* Manage accounts
* View activity

Analytics

Display:

* Users
* New users
* Returning users
* Story views
* Chapter reads
* Reading completion
* Audio plays
* Video plays
* Conversion rate
* Most popular stories
* Most popular chapters

Content

Manage:

* Homepage hero
* Trending stories
* New stories
* Featured stories
* Genres
* Banners
* Announcements

---

19. MONETIZATION ARCHITECTURE

The MVP should be architected so monetization can be added cleanly.

Future revenue streams:

Advertising

Free content can eventually display advertising.

Premium chapters

Some chapters can require membership/payment.

Membership

Potential future plans:

FREE

* Free stories
* Limited audio
* Advertising

TALEON PLUS

* Ad-free
* Early chapters
* Premium stories
* Full audio
* Exclusive content

TALEON PREMIUM

* Everything above
* Exclusive audiobooks
* Early releases
* Special content

Do not hard-code pricing yet.

Make pricing configurable from the admin system.

---

20. PAYMENT ARCHITECTURE

Prepare the application for future payment integration.

Potential payment provider:

Stripe.

Architecture should allow:

* subscriptions
* one-time purchases
* premium chapters
* audiobooks

Do not implement fake payment functionality.

If credentials are not available, build the architecture and clearly mark payment integration as pending configuration.

---

21. ANALYTICS

Track meaningful events.

Examples:

page_view

story_view

chapter_started

chapter_completed

audio_started

audio_completed

video_started

video_completed

story_followed

story_saved

signup

login

subscription_started

premium_chapter_view

search

share

Analytics should eventually allow Taleon to answer:

"What stories do people actually finish?"

not simply:

"How many people visited?"

---

22. RECOMMENDATION SYSTEM

Build the data structure for future recommendations.

Eventually recommend stories based on:

* Genre
* Reading history
* Following
* Completion
* Listening history
* Similar users

For MVP, use simple rules.

Example:

"If user reads Sci-Fi, show more Sci-Fi."

Do not build an unnecessarily complicated AI recommendation system yet.

---

23. SOCIAL MEDIA INTEGRATION

Every story/chapter should have share buttons.

Platforms:

TikTok

Instagram

YouTube

Facebook

X

WhatsApp

Copy link

Social preview metadata should be properly configured.

Every story should generate a beautiful social preview when shared.

---

24. SEO

This is very important.

Each story and chapter should have:

* SEO title
* Meta description
* Canonical URL
* Open Graph image
* Structured metadata where appropriate

Example:

Title:

The Last Signal — Chapter 1 | Taleon Media

Description:

Read Chapter 1 of The Last Signal, a cinematic sci-fi mystery set in Nairobi in 2047.

URLs should be clean:

/story/the-last-signal

/story/the-last-signal/chapter/1

---

25. MOBILE-FIRST DESIGN

The majority of users may arrive from TikTok, Instagram and YouTube on mobile.

Therefore:

Design mobile-first.

The website must work beautifully on:

* iPhone
* Android
* tablet
* desktop

Prioritize:

* fast loading
* readable typography
* large touch targets
* simple navigation
* excellent chapter reader
* excellent audio player

---

26. NAVIGATION

Desktop:

TALEON

Stories

Audio

Watch

Genres

Search

[Log In]

[Join Taleon]

Mobile:

Logo

Search

Menu

The navigation should remain minimal.

---

27. PERFORMANCE

Optimize aggressively.

Requirements:

* Lazy-load images
* Responsive images
* Optimized image formats
* Lazy-load video/audio
* Avoid huge JavaScript bundles
* Avoid unnecessary animations
* Cache static assets
* Optimize database queries

The site should feel fast even on mobile connections.

---

28. ACCESSIBILITY

Follow good accessibility practices.

Include:

* keyboard navigation
* sufficient contrast
* alt text
* semantic HTML
* screen-reader support
* accessible forms
* visible focus states

Do not sacrifice accessibility for visual effects.

---

29. RESPONSIVE DESIGN

Create breakpoints for:

Mobile

Tablet

Desktop

Large desktop.

Don't simply shrink the desktop version.

Re-design important components for mobile.

---

30. VISUAL STYLE

The visual language should combine:

Premium streaming platform

*

Digital publishing platform

*

Cinematic storytelling

Do NOT copy Netflix, Spotify, Wattpad or another company's interface.

Take inspiration from the quality and simplicity of premium entertainment products but create an original Taleon design.

Use:

* large cinematic artwork
* dark backgrounds
* subtle gradients
* glass effects sparingly
* elegant typography
* generous spacing
* smooth hover states
* subtle transitions

Avoid:

* excessive rounded cards
* excessive purple
* excessive glowing
* excessive animations
* generic AI imagery
* clutter

---

31. FIRST STORY CONTENT

Use this as the first demonstration story:

THE LAST SIGNAL

Genre:

Sci-Fi / Mystery / African Tech Thriller

Setting:

Nairobi, 2047

Premise:

Every phone in Nairobi receives the same message at exactly 2:17 AM.

Message:

"DO NOT TRUST THE PERSON NEXT TO YOU."

Use clearly marked placeholder artwork if final production artwork is not yet available.

Do not generate copyrighted characters or imitate existing franchises.

---

32. CONTENT ARCHITECTURE

The platform must be able to support multiple stories.

Example:

TALEON ORIGINALS

The Last Signal

Shadow of Kilimanjaro

The Girl From Sector 9

The Red Door

Maua

The Last Guardian

These are placeholders/examples and should be editable from the admin dashboard.

---

33. FUTURE APP

Do not build the mobile app now.

However, structure the backend/API/data layer so that a future iOS/Android app can use the same system.

Future app:

TALEON

READ

LISTEN

WATCH

FOLLOW

DOWNLOAD

DISCOVER

---

34. FUTURE COMMUNITY

Prepare architecture for future:

* comments
* reactions
* reviews
* discussion
* reader profiles
* story theories
* notifications

Do not build a complicated community system in the first MVP unless it can be implemented cleanly.

---

35. SECURITY

Implement:

* secure authentication
* authorization
* admin role protection
* database security
* input validation
* secure file uploads
* rate limiting where appropriate
* protected admin routes
* no exposed secret keys

Never put secret API keys in frontend code.

Use environment variables/secrets.

---

36. LEGAL

Create placeholder pages for:

/terms

/privacy

/cookies

/copyright

/contact

The final legal text will be supplied/reviewed separately.

Do not invent legal claims.

---

37. CONTACT

Create a simple contact page.

Categories:

General

Business

Partnership

Copyright

Support

Do not expose private personal information.

Use configurable contact details.

---

38. FOOTER

Footer:

TALEON MEDIA

Stories that come alive.

Navigation:

Stories

Audio

Watch

Genres

About

Contact

Terms

Privacy

Social:

TikTok

Instagram

YouTube

Facebook

X

Copyright:

© Taleon Media. All rights reserved.

---

39. IMPORTANT PRODUCT PRINCIPLE

The website must feel like a real platform even if the initial content catalogue is small.

Do not make it look empty.

Use the first story as the flagship experience.

Build the architecture so adding Story 2, Story 3, Story 10 and Story 100 does not require rebuilding the website.

---

40. MVP PRIORITY ORDER

Build in this order:

1. Brand/design system
2. Homepage
3. Story catalogue
4. Story page
5. Chapter reader
6. Authentication
7. User library
8. Audio player
9. Admin dashboard
10. Database
11. Analytics
12. SEO
13. Mobile optimization
14. Deployment

Then prepare:

15. Payments
16. Premium chapters
17. Membership
18. Notifications
19. Recommendations
20. App API

---

41. QUALITY STANDARD

Do not stop after creating a basic functional prototype.

The website should look and feel like a legitimate entertainment startup.

Before considering the MVP complete, test:

* Mobile
* Desktop
* Sign up
* Login
* Logout
* Story browsing
* Chapter reading
* Navigation
* Search
* Audio
* Admin
* Image loading
* Error states
* Empty states
* 404 pages
* SEO metadata
* Social sharing
* Performance
* Accessibility

---

42. ERROR AND EMPTY STATES

Design polished states for:

No stories

No search results

No saved stories

No reading history

Audio unavailable

Video unavailable

Page not found

Server error

Loading

Offline/connection problems

Do not leave blank screens.

---

43. FINAL PRODUCT VISION

Taleon should eventually become:

```text
                         TALEON MEDIA

                  STORIES THAT COME ALIVE

                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
            READ           LISTEN          WATCH
              │              │              │
           Stories         Audio          Video
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                        TALEON APP
                             │
                             ▼
                          COMMUNITY
                             │
                             ▼
                       MEMBERSHIP
                             │
                             ▼
                       TALEON ORIGINALS
                             │
                             ▼
                       GLOBAL IP COMPANY
```

The website is the foundation of that ecosystem.

---

44. IMPORTANT INSTRUCTION TO LOVABLE

Do not create a superficial landing page.

Build a real full-stack MVP architecture with:

* proper database
* authentication
* content management
* story/chapter system
* audio/video support
* user library
* analytics architecture
* admin dashboard
* SEO
* responsive design
* scalable API/data structure

If a feature requires external credentials that are not yet available, implement the architecture cleanly and leave the integration ready for configuration rather than using fake production functionality.

Use realistic seed data for the initial Taleon Originals content.

The application must be modular and maintainable.

Prioritize a polished user experience and a strong foundation for future expansion.

The first goal is not to build everything Taleon will ever need.

The first goal is to build a beautiful, functional foundation that can grow into the Taleon storytelling platform.
check uploaded ppics names and use where appropriate

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/efd3abc3-ae2a-47f7-89f7-a55d8b18ef35).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
