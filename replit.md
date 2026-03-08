# AFILIADOS.AO

Angola's affiliate marketing platform where affiliates refer businesses for website creation and earn commissions.

## Architecture

- **Frontend**: React + Vite + TypeScript + shadcn/ui + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: express-session with bcrypt password hashing
- **Routing**: wouter (frontend), Express routes (backend)
- **State**: @tanstack/react-query

## Pages

- `/` — Public landing page (home.tsx)
- `/login` — Login/register (login.tsx)
- `/admin` — Admin dashboard (admin.tsx) — requires admin role
- `/usuario` — Affiliate dashboard (usuario.tsx) — requires user role
- `/termos`, `/privacidade` — Static pages

## Key Files

- `shared/schema.ts` — Drizzle schema: users, clients, withdrawals, materials, notifications, security_logs, settings
- `server/storage.ts` — DatabaseStorage class with all CRUD operations
- `server/routes.ts` — API routes (auth, admin, user endpoints)
- `server/db.ts` — Database connection
- `client/src/App.tsx` — Router with PrivateRoute auth guards
- `client/src/lib/queryClient.ts` — React Query config with apiRequest helper

## API Routes

### Auth
- POST /api/auth/login, /api/auth/register, /api/auth/logout
- GET /api/auth/me

### Admin (requireAdmin)
- GET /api/admin/dashboard, /affiliates, /clients, /withdrawals, /withdrawals/stats, /materials, /notifications, /security-logs, /settings
- PATCH /api/admin/clients/:id/status, /withdrawals/:id/status, /settings
- POST /api/admin/materials, /notifications
- DELETE /api/admin/materials/:id

### User (requireAuth)
- GET /api/user/clients, /withdrawals, /notifications, /materials
- POST /api/user/clients, /withdrawals, /change-password
- PATCH /api/user/profile

## Credentials

- Admin: phone=`admin`, password=`admin123`
- Users: created via register flow

## Plans & Commissions

- Essencial: Kz 130,000 (commission Kz 20,000)
- Profissional: Kz 250,000 (commission Kz 40,000)
- Premium: Kz 400,000 (commission Kz 70,000)

## Withdrawal Methods

- Transferência IBAN
- Unitel Money
- Afrimoney
