# Expense Tracker

Expense Tracker is a beginner-friendly full-stack app for creating an account and keeping a private list of expenses. Each account only sees its own expense records.

## Features

- Sign up and log in with an email and password.
- Passwords are hashed before they are stored.
- Add, edit, and delete expenses.
- Filter expenses by category and see the total for the selected category.
- Keep login sessions with a JWT saved in the browser.
- Responsive React interface and a MongoDB-backed API.

## Tech stack

- Frontend: React, Vite, JavaScript, Axios, React Router
- Backend: Node.js, Express, Mongoose, MongoDB Atlas
- Authentication: JSON Web Tokens (JWT) and bcryptjs

## Folder structure

```text
backend/
  controllers/
  middleware/
  models/
  routes/
  server.js
  package.json
  .env.example
frontend/
  src/
  index.html
  package.json
  vercel.json
  .env.example
.gitignore
README.md
VIVA_NOTES.md
```

## Run locally

You need Node.js/npm and a MongoDB Atlas database.

1. In `backend/`, copy `.env.example` to `.env`. Fill in:
   - `MONGO_URI`: your MongoDB Atlas connection string, including the database name.
   - `JWT_SECRET`: a long, private random string. Do not share or commit it.
   - `FRONTEND_URL`: keep `http://localhost:5173` for local development.
   - `PORT`: keep `5000`, or choose an available port.
2. In `frontend/`, copy `.env.example` to `.env`. Set `VITE_API_URL` to the backend URL (use `http://localhost:5000` locally).
3. Install and start the backend:

   ```bash
   cd backend
   npm install
   npm start
   ```

4. In a second terminal, install and start the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. Open the Vite URL shown in the frontend terminal, usually `http://localhost:5173`.

The backend uses `PORT` or `5000`. The frontend API address is read from `VITE_API_URL`; never put a production API address directly into the source code.

## API endpoints

All responses use JSON except `GET /`, which returns `API is running`.

| Method | Endpoint | Login required | Purpose |
|---|---|---:|---|
| GET | `/` | No | Check that the API is running |
| POST | `/api/auth/signup` | No | Create an account and receive a JWT |
| POST | `/api/auth/login` | No | Log in and receive a JWT |
| GET | `/api/expenses` | Yes | Get the logged-in user's expenses |
| POST | `/api/expenses` | Yes | Add an expense |
| PUT | `/api/expenses/:id` | Yes | Update one of the user's expenses |
| DELETE | `/api/expenses/:id` | Yes | Delete one of the user's expenses |

For protected routes, send `Authorization: Bearer YOUR_JWT_TOKEN`.

## Live Links

- Frontend (Vercel): `https://your-expense-tracker.vercel.app`
- Backend (Render): `https://your-expense-tracker-api.onrender.com`

For deployment, set `VITE_API_URL` in Vercel to the deployed Render API URL. Set `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL` (your deployed Vercel URL), and `PORT` in Render's environment settings.
