# Social app (feed-style, for -S tasks)

A Facebook-style app used for every `-S` task in `task-bank.csv`. Messaging
(`-M`) tasks still use the original screens in `src/components/LegacyApp.jsx`.

## Files

| File | What it holds |
| --- | --- |
| `world.js` | The synthetic world: people, groups, posts, comments, polls, chats, documents, map places, saved items, notifications, device photo gallery |
| `tasks.js` | Start screen for each task (`P01-S` … `P52-S`), plus any preloaded state (e.g. P31’s Sad reaction, P43’s Morning vote) |
| `store.js` | State updates (react, comment, vote, share, send, edit…) and helpers |
| `SocialApp.jsx` | Shell: navigation, bottom tabs, sheets, photo viewer, toasts |
| `components/` | `Post.jsx` (post card, reactions, comments, polls), `Pages.jsx` (feed, groups, profiles, search, notifications, saved, PDF & map viewers), `Chats.jsx` (Messages), `Sheets.jsx` (share / send / gallery / create post) |

## Running a task

* Researcher: **Menu → Study tasks**, pick a task. The app resets to that task’s start screen.
* Or open a URL directly: `http://localhost:5173/?task=P02-S`
* Every interaction is logged with the task id; download it from the Study tasks screen (**Log**).

## Native-style controls used by the tasks

* **Reactions**: tap Like; *press and hold* Like (or right-click) for Love, Sad, etc.
* **Message options** (Reply, Forward, Copy, Edit, Save photo): *press and hold* a message (or right-click).
  Edit is offered only for your own text messages for 15 minutes after sending.
* **Share** on a post: Send in Messenger (per-person **Send** buttons, so nothing becomes a group), Share to a group, Share now (public), Copy link.
  Posts in private groups can only be sent in Messenger or copied.
* Links to PDFs / maps have a **⋯** menu with Copy link; the PDF and map viewers also have Copy link / Share.
* **Voice messages**: mic button when the message box is empty. Uses the real microphone; falls back to a simulated recording if none is available.
* Nora’s audio message (P38) plays `public/assets/audio/nora-workshop-update.mp3` if you add one; otherwise the browser reads the transcript aloud.

## Images

`public/assets/social/*.svg` are simple placeholders (made by
`python3 scripts/makePlaceholders.py`). To use real photos, drop them into
`src/assets/photos/` with the same base name — `photos.js` picks them up
automatically. `src/assets/photos/README.md` has a generation prompt and the
must-keep details for every image, plus optional avatars.

## Regenerating tasks

```bash
npm run convert:tasks -- task-bank.csv src/data/generatedTasks.json
```
