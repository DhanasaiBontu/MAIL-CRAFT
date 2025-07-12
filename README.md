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

