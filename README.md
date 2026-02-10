# Quest Admin Panel

Landing page for Escape Manager.

## Frontend
The Angular app lives in `frontend/`.

Scripts:
- `cd frontend`
- `npm install`
- `npm run start`
- `npm run build`

## Backend
The backend lives in `backend/` and exposes:
- `POST /api/leads`
- `GET /api/leads`
- `POST /api/login`

Run it separately:
- `cd backend`
- `npm install`
- `npm run dev`

Admin credentials are loaded from `backend/.env`:
- `ADMIN_USER`
- `ADMIN_PASS`
- `ADMIN_SECRET`

Copy `backend/.env.example` to `backend/.env` and update values.
