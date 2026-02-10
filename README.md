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

## Docker (single container)
Build:
```
docker build -t escape-manager .
```

Run:
```
docker run -p 8080:80 \\
  -e ADMIN_USER=admin \\
  -e ADMIN_PASS=admin \\
  -e ADMIN_SECRET=change-me \\
  escape-manager
```

App will be on `http://localhost:8080` and `/admin` is protected by the credentials.
