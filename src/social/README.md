# Social app (Facebook-style, T01-S … T13-S)

| File | What it holds |
| --- | --- |
| `world.js` | Shared baseline: people (incl. two "Mina Shah" accounts, pending friend requests, Pages), groups (incl. public Oak Street Free Exchange), posts, stories, events, notifications, chats, study-phone gallery |
| `scenarios.js` | Start screen for each scenario (main feed or the message list) |
| `store.js` | State updates (react, comment, follow, accept request, join group, RSVP, invite, create/edit post, polls, stories, unsend…) |
| `SocialApp.jsx` | Shell: navigation, tabs, sheets, story viewer/creator |
| `components/` | `Post.jsx`, `Pages.jsx` (feed, groups, profiles, search, notifications), `Extras.jsx` (friends, events), `Stories.jsx`, `Chats.jsx`, `Sheets.jsx` (share, gallery, composer with audience + poll) |

Native-style controls used by the tasks:

* **Reactions**: tap Like; press and hold for Love, Sad, etc. Messages: press and hold → emoji row.
* **Post menu (⋯)**: Save post, Edit post (your own posts), Copy link.
* **Composer**: personal posts start as **Public** (choose Friends deliberately); group posts can add a **Poll** with "Allow multiple answers".
* **Stories**: tap a story in the tray; tap right/left to move; reply box and reactions at the bottom. "Create story" → photo → Audience (Friends default, Public, Custom).
* **Events**: Menu → Events, or the invitation notification. Going / Maybe / Can’t go, and Invite.
* **Friend requests**: Menu → Friends, or the notification. Confirm / Delete.
* **Unsend**: press and hold your message → Unsend → Unsend for everyone / Remove for you.

Images: `public/assets/social/*.svg` are placeholders (`npm run assets`). Put a real photo with the same base
name in `src/assets/photos/` to replace one.
