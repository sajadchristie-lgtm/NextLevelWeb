# Bilvård center i Kävlinge

Bilvård center i Kävlinge is a mobile-first MVP for a car sales and car care business. It includes a public website for browsing inventory and services, plus a protected admin dashboard for managing cars, discounts, images, and editable page content.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express, TypeScript
- Database: SQLite with Prisma ORM
- Auth: JWT-based admin authentication
- Uploads: Local image storage in `server/uploads`

## Project Structure

```text
.
├── client
│   ├── src
│   └── .env.example
├── server
│   ├── prisma
│   ├── src
│   ├── uploads
│   └── .env.example
└── package.json
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create env files:

- Copy `client/.env.example` to `client/.env`
- Copy `server/.env.example` to `server/.env`

3. Generate Prisma client:

```bash
npm run db:generate
```

4. Run the included migration:

```bash
npm run db:migrate
```

5. Seed demo data:

```bash
npm run db:seed
```

6. Start frontend and backend together:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173` and the API runs on `http://localhost:4000`.

## Environment Variables

### Client

`client/.env`

```env
VITE_API_URL=http://localhost:4000
CLIENT_PORT=5173
VITE_ADMIN_BASE_PATH=/portal-bilvard-private
```

### Server

`server/.env`

```env
SERVER_PORT=4000
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
JWT_SECRET="change-this-in-production"
ADMIN_ACCESS_CODE="change-this-private-access-code"
CORS_ORIGIN="http://localhost:5173"
UPLOADS_DIR="./uploads"
```

## Database and Seed Data

The seed script provides:

- 6 sample cars
- 5 editable services
- Sample About, Location, Contact, and homepage content
- A development admin account

Default development admin credentials:

- Email: `admin@autovault.local`
- Password: `Admin123!`

## Image Uploads

- Uploaded car images are stored in `server/uploads/cars/<YYYY-MM>/`
- Demo seed images live in `server/uploads/demo/`
- The database stores image paths and metadata, while the files remain on disk
- Deleting a car removes its related uploaded image files and database image records

## Features

### Public Website

- Home page with hero, featured cars, services preview, About preview, Location preview, and contact CTA
- Cars listing page with search, brand/year/status filters, price cap filter, and sorting
- Car details page with gallery, pricing, specs, and inquiry form
- Services, About, Location, and Contact pages backed by editable data
- Responsive navigation and mobile-friendly card layouts

### Admin Dashboard

- Hidden private admin URL plus private access-code gate
- Secure admin login
- Overview dashboard with stats and recent inquiries
- Cars CRUD with status, featured flag, pricing, discount controls, and multi-image upload
- Existing image removal, reordering, and cover image selection
- Services management
- Editable homepage, About, Location, and Contact content

## Notes

- This is designed as a maintainable MVP, so image storage is local and auth is intentionally simple.
- The contact and vehicle inquiry forms store submissions in the Postgres database configured through `DATABASE_URL`.
- Public navigation no longer advertises admin access; the private admin URL is controlled by `VITE_ADMIN_BASE_PATH`.
- The admin access gate is controlled by `ADMIN_ACCESS_CODE`, and it should be changed before deployment.
- If you want to expand the project later, the current structure supports moving uploads to cloud storage or switching to PostgreSQL.

## Deployment

### Netlify (frontend)

- Connect the repo to Netlify.
- Use the root-level `netlify.toml`.
- For local development, set `VITE_API_URL` to your backend URL.
- On Netlify, the included proxy rules forward `/api/*` and `/uploads/*` to the configured Northflank backend, so the deployed site can use same-origin requests for better cookie support on mobile browsers.
- Set `VITE_ADMIN_BASE_PATH` to your hidden admin path.

### Northflank (backend)

- Deploy the backend using `server/Dockerfile`.
- Set environment variables for `DATABASE_URL`, `JWT_SECRET`, `ADMIN_ACCESS_CODE`, `CORS_ORIGIN`, and `UPLOADS_DIR`.
- Mount a persistent volume for uploads and point `UPLOADS_DIR` at that mount path.

### Supabase (database)

- Create a Supabase Postgres project.
- Set `DATABASE_URL` to the Supabase direct Postgres connection string.
- Run `npx prisma migrate deploy` against Supabase before starting the app.
- Run the seed once after migration if you want the starter admin account and demo content.
