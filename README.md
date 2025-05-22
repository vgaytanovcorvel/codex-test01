# Time Tracking App

This project is a minimal fullstack example with an Angular frontend and a .NET Core backend using SQL Server for persistence.

## Backend

The backend is located in `backend/TimeTrackingApi` and uses Entity Framework Core with SQL Server. It exposes the following endpoints:

- `GET /api/projects` – list all projects
- `POST /api/projects` – create a project
- `GET /api/timeentries` – list all time entries
- `POST /api/timeentries` – create a new entry

Connection settings are provided in `backend/TimeTrackingApi/appsettings.json`. Update the `TimeTrackingDb` connection string to point to your SQL Server instance.

Run the backend with:

```bash
dotnet run --project backend/TimeTrackingApi
```

## Frontend

The frontend is an Angular application located in `frontend`.

Install dependencies and start the dev server:

```bash
cd frontend
npm install
npm start
```

API calls to `/api` are proxied to the backend running on the same host.
