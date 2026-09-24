# Mobile Communication Sandbox

A mobile-first React application for studying digital communication tasks across feed-style and messaging-style interfaces.

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
  App.jsx                    Main application and navigation
  components/               Feed, messages, tasks, and install UI
  data/sandboxData.json     Synthetic people, groups, posts, and messages
  styles.css                Mobile application styling
scripts/
  convertTasks.mjs          Converts task CSV files to JSON
public/
  manifest.webmanifest      Installable web-app configuration
  sw.js                     Offline service worker
tasks.example.csv           Example task-file format
```

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
```
