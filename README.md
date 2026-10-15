# Student Project Tracker

A hands-on web app development workshop project. It adds, displays, edits and deletes engineering projects, with data stored in local SQLite.

## Run locally

Requirements: Node.js, Git and VS Code.

Open a PowerShell terminal inside the project folder and run:

```powershell
npm.cmd ci
npm.cmd start
```

Open http://localhost:3000.

Stop the server with Ctrl+C.

## How it works

Browser HTML/CSS/JavaScript → Express API → SQLite database → response → updated webpage.

- `public/index.html`: page structure and form.
- `public/style.css`: page appearance.
- `public/script.js`: frontend logic and API requests.
- `server.js`: starts the server.
- `app.js`: API routes and validation.
- `database.js`: database operations.
- `data/projects.db`: local database file.

## API

- GET `/api/health`
- GET `/api/projects`
- POST `/api/projects`
- PUT `/api/projects/:id`
- DELETE `/api/projects/:id`

## Verification

- Adding a project: tested.
- Edit and Cancel: tested.
- Delete confirmation Cancel: tested.
- Server restart and retry: tested.

## Workshop limitations

This is a local teaching app with no sign-in or per-user permissions. Users of the same server share its project collection. The database file and `node_modules` are not uploaded to GitHub. Cloud hosting requires separate server and database configuration.