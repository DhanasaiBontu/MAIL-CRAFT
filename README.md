# Mail Craft – Custom Email Generator & Scheduler

Mail Craft is a full-stack web application that lets you

* compose and send e-mails,
* schedule e-mails for any future date or time,
* generate ready-made drafts with an AI helper,
* and review the status of every message in a clean dashboard.

The system is built with a React 18 front-end and a FastAPI back-end that stores data in MongoDB and dispatches mail through any SMTP server (Gmail by default).

---

## Key features

| Feature                               | Details                                                                  |
|---------------------------------------|--------------------------------------------------------------------------|
| E-mail composition                    | Rich-text fields for recipient, subject and body.                        |
| AI draft generation                   | `/emails/ai-generate` endpoint returns a subject line and body template. |
| Immediate or scheduled delivery       | “Send now” or pick any future date-time; APScheduler handles dispatch.   |
| Delivery status tracking              | Sent / Pending / Failed flags stored in Mongo and shown in the UI.       |
| Authentication                        | JWT-based login, register and logout flows.                              |
| Dashboard                             | Counts of total, sent, scheduled and failed messages.                    |

---

## Tech stack

| Layer      | Technology                                 |
|------------|--------------------------------------------|
| Front-end  | React 18, React-Router 6, Axios, CSS modules |
| Back-end   | FastAPI, Starlette, Motor (async Mongo driver) |
| Database   | MongoDB                                    |
| Scheduler  | APScheduler (cron-style job for future sends) |
| Auth       | JSON Web Tokens with python-jose, bcrypt    |
| Mail       | Standard SMTP (Gmail used in sample `.env`) |

---

## Repository layout
```
MAIL-CRAFT/
├─ backend/
│  ├─ __pycache__/
│  ├─ .env
│  ├─ ai_generator.py
│  ├─ auth.py
│  ├─ config.py
│  ├─ email_sender.py
│  ├─ email_utils.py
│  ├─ main.py
│  ├─ models.py
│  ├─ requirements.txt
│  ├─ scheduler.py
│  └─ utils.py
│
├─ frontend/
│  ├─ build/                 # created by “npm run build”
│  ├─ node_modules/          # front-end dependencies
│  ├─ public/
│  │  └─ index.html
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ EmailCard.js
│  │  │  ├─ Navbar.js
│  │  │  └─ Sidebar.js
│  │  ├─ pages/
│  │  │  ├─ ComposeEmail.js
│  │  │  ├─ Dashboard.js
│  │  │  ├─ Login.js
│  │  │  ├─ ScheduledEmails.js
│  │  │  └─ SentEmails.js
│  │  ├─ styles/
│  │  │  ├─ App.css
│  │  │  ├─ ComposeEmail.css
│  │  │  ├─ Dashboard.css
│  │  │  ├─ Login.css
│  │  │  ├─ Navbar.css
│  │  │  ├─ ScheduledEmails.css
│  │  │  ├─ SentEmails.css
│  │  │  └─ Sidebar.css
│  │  ├─ App.js
│  │  ├─ axios.js
│  │  └─ index.js
│  ├─ package.json
│  └─ package-lock.json
│
├─ node_modules/             # *root-level* Node deps (added during experiments)
├─ .gitignore             
└─ README.md         
```


---

## Running locally

### 1. Back-end

```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate   # Linux/Mac: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # edit values for Mongo URI, SMTP and JWT secret
uvicorn main:app --reload       # API on http://127.0.0.1:8000
# Swagger docs: http://127.0.0.1:8000/docs
```
### 2. Front-end  

```bash
cd frontend
npm install
npm start
```

### API summary

| Method | Path                 | Purpose                         |
| ------ | -------------------- | ------------------------------ |
| `POST` | `/auth/register`     | Create user                    |
| `POST` | `/auth/login`        | Obtain JWT access token        |
| `GET`  | `/auth/me`           | Validate token / fetch profile |
| `POST` | `/emails/send`       | Send or schedule e-mail        |
| `GET`  | `/emails/sent`       | List all e-mails               |
| `POST` | `/emails/ai-generate`| AI-generate draft              |

