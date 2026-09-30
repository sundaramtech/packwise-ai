# PackWise AI

Food packaging material recommendation prototype with a React/TypeScript frontend and a Python FastAPI backend.

## Included

- Commodity and packaging material explorer
- Packaging recommendation workflow and results
- Dashboard, history, reporting, QR verification and assistant interfaces
- Prototype login and admin interfaces

## Requirements

Install Python 3.10 or newer and Node.js 18 or newer (with npm).

## Quick start (Windows)

1. Install **Python 3.10 or newer** (enable **Add Python to PATH**) and **Node.js 18 or newer with npm**.
2. Clone this repository, or download the ZIP and **extract it completely**.
3. Double-click **`start.bat`** in the project folder.

**First run:** keep an internet connection and wait while the launcher creates `.venv`, installs Python packages and runs `npm install`. It then starts the backend and frontend in separate windows, waits for both servers to respond, and opens http://127.0.0.1:3000 in your default browser.

**Later runs:** double-click `start.bat` again. Successful dependency installations are reused. Changed dependency files trigger installation again.

Keep both server windows open while using the app. Close both windows to stop it.

## Fresh-clone problem and troubleshooting

GitHub intentionally excludes `.venv` / `venv` and `frontend/node_modules`. These generated dependency folders must be created separately on each computer.

The old launcher displayed `Run the first-time setup in README.md first.` or `Run npm install in frontend first.`, followed by `Press any key to continue . . .`, then exited without starting the app. **The updated launcher now performs that setup automatically.**

- If you already cloned the old version, run `git pull` from the project root, then double-click `start.bat`. For ZIP downloads, download and extract the latest ZIP again.
- If Python or npm is missing, install the required programs, reopen your terminal, and try again.
- If installation fails, the launcher stops and keeps the error visible. Resolve the displayed error and run it again.
- If port 8000 or 3000 is in use, close existing app server windows before launching again.
- If servers do not become ready within 90 seconds, inspect both server windows for the error.
- If your browser does not open automatically, open http://127.0.0.1:3000 after both servers are ready.

## Manual setup (optional fallback)

Open CMD in the project root and run each command only after the previous one succeeds:

```bat
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
cd frontend
npm install
cd ..
```

If needed, use `py -3 -m venv .venv` instead of the first command.

Alternatively, run these commands in two terminals from the repository root:

```bat
.venv\Scripts\python.exe -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

```bat
cd frontend
npm run dev
```

API docs: http://127.0.0.1:8000/docs

## Frontend build

```bat
cd frontend
npm run build
```

The development server proxies `/api` requests to the backend. Production hosting needs a running Python backend and equivalent API routing. Uploading source to GitHub does not deploy the application.

## Data and prototype limits

The backend creates `backend/data/db.json` on first startup from the included seed data. Local database records, environment files, dependencies and build output are excluded from Git.

Demo accounts: `demo@packwise.ai` / `demo123` and `admin@packwise.ai` / `admin123`. Authentication is a demonstration implementation using plain password comparison and placeholder tokens; use only demo data and replace it before production use. The frontend includes offline fallback logic, so confirm backend availability when demonstrating API-backed features.
