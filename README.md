# Mobile Communication Sandbox

A mobile-first React application for studying digital communication tasks in two separate apps: a messenger (WhatsApp-style) and a social-media app (Facebook-style). All content is fictional.

## Getting started

### 1. Install the required software

Install:

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/) version 22 or newer
- [Visual Studio Code](https://code.visualstudio.com/)

Confirm that everything is available:

```bash
git --version
node --version
npm --version
```

### 2. Clone the repository

Copy the repository URL from GitHub, then run:

```bash
git clone https://github.com/SaramshGautam/mobile-communication-sandbox.git
cd mobile-communication-sandbox
code .
```

### 3. Install and run the project

In the VS Code terminal, run:

```bash
npm install
npm run dev
```

Open the local URL displayed in the terminal, usually `http://localhost:5173`.

## Making changes

Do not work directly on the `main` branch. First, get the latest version:

```bash
git switch main
git pull origin main
```

Create a branch for your work:

```bash
git switch -c your-name/short-change-description
```

Examples:

```bash
git switch -c sam/feed-layout
git switch -c mj/add-share-tasks
git switch -c ejp/fix-message-view
```

After making changes, verify that the project builds:

```bash
npm run build
```

Commit and push your work:

```bash
git status
git add .
git commit -m "Describe the change"
git push -u origin your-name/short-change-description
```

Open the repository on GitHub and create a pull request into `main`. Another primary developer should review the pull request before it is merged.

## Updating your branch

If `main` changes while you are working:

```bash
git switch main
git pull origin main
git switch your-name/short-change-description
git merge main
```

Resolve any conflicts in VS Code, run `npm run build`, and push the updated branch.

## Project structure

```text
src/
  App.jsx                     Scenario/step state, event log, picks the app
  components/TaskStrip.jsx    Instruction banner (step 1–4, researcher arrows)
  components/TaskPanel.jsx    Researcher menu: start tasks, steps, triggers, log export
  data/scenarios.json         Generated from the task bank (do not edit by hand)
  messenger/                  WhatsApp-style app for the T01-M … T13-M tasks
    world.js                  Shared baseline data: contacts, chats, files, gallery, statuses
    scenarios.js              Start screens, scripted triggers and call scripts
  social/                     Facebook-style app for the T01-S … T13-S tasks
    world.js                  Shared baseline data: people, groups, posts, stories, events
    scenarios.js              Start screens
task-bank-v2/
  TaskBank.xlsx               Source task bank (Messenger App + Social Media app sheets)
  messenger.csv, social.csv   CSV exports of those two sheets
scripts/
  convertTaskBank.mjs         task-bank-v2/*.csv  ->  src/data/scenarios.json
  makeAssetsV2.py             Placeholder images (public/assets/social/*.svg)
```

## How tasks run

- Each row group in the task bank is one **scenario** with four steps: Find → Understand → Reply → Share.
- **Starting a task** (researcher menu, or `/?s=T05-M`) resets that app to the scenario's start state (TASK START).
- **Moving to the next step** (small arrows in the instruction banner, or the menu) keeps the participant's screen and changes (CONTINUE). `/?s=T05-M&step=3` also works.
- **Scripted events** (Lena's video call in T03-M, Priya's message in T07-M, Elena's location in T13-M) fire automatically after their trigger. If one does not happen, the researcher menu has a button to fire it.
- Open the researcher menu from **Settings/Menu → Study tasks**, or double-tap the step dots in the banner.
- Every interaction is logged with the scenario ID, step and intent. Download it from the researcher menu (**Log**).

After editing the task bank, export the two sheets to `task-bank-v2/messenger.csv` and `task-bank-v2/social.csv`, then run `npm run convert:tasks`.

## Collaboration guidelines

- Use a separate branch for every feature or fix.
- Keep each pull request focused on one change.
- Pull the latest `main` branch before starting new work.
- Run `npm run build` before pushing.
- Do not commit `node_modules`, `dist`, `.env`, or `.vercel` files.
- Do not add participant data, credentials, tokens, or private information.
- Coordinate major interface or data-schema changes with the primary developers.

## Useful commands

```bash
npm run dev       # Start the development server
npm run build     # Create and verify a production build
npm run preview   # Preview the production build locally
npm run convert:tasks  # Rebuild src/data/scenarios.json from task-bank-v2/*.csv
npm run assets    # Regenerate placeholder images
```
