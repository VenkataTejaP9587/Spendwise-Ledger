# Spendwise Ledger

A personal expense tracker app with a Vite + React frontend and an Express backend.

## Project structure

- `client/` - React app built with Vite
- `server/` - Express backend for storing and serving expense data
- `app.js`, `index.html`, `style.css` - legacy root files used by the application

## Features

- Dashboard overview of expenses
- Add expense entries
- View expense history
- Category breakdown and reports

## Requirements

- Node.js 18+ recommended
- npm installed

## Setup

Install dependencies for both client and server:

```bash
cd "Expense Tracker/server"
npm install

cd "../client"
npm install
```

## Run locally

Start the backend server:

```bash
cd "Expense Tracker/server"
npm run dev
```

Start the frontend app:

```bash
cd "Expense Tracker/client"
npm run dev
```

Then open the Vite app URL shown in the terminal (typically `http://localhost:5173`).

## Build

To build the frontend production bundle:

```bash
cd "Expense Tracker/client"
npm run build
```

## Notes

- The backend uses `server/data.json` for example expense data.
- Add any environment variables or API configuration as needed.

## Repository

https://github.com/VenkataTejaP9587/Spendwise-Ledger
