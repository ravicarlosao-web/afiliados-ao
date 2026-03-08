# AFILIADOS.AO

Angola's affiliate marketing platform where affiliates refer businesses for website creation and earn commissions.

## Architecture

- **Frontend**: React + Vite + TypeScript + shadcn/ui + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: Turso (libSQL/SQLite) with Drizzle ORM — local `file:local.db` for dev, remote Turso for production
- **Image Storage**: Cloudinary for material image uploads
- **Auth**: express-session (memorystore) with bcrypt password hashing
- **Routing**: wouter (frontend), Express routes (backend)
- **State**: @tanstack/react-query

## Pages

- `/` — Public landing page (home.tsx)
- `/login` — Login/register (login.tsx)
- `/admin` — Admin dashboard (admin.tsx) — requires admin role
- `/usuario` — Affiliate dashboard (usuario.tsx) — requires user role
- `/termos`, `/privacidade` — Static pages

## Key Files

- `shared/schema.ts` — Drizzle schema (SQLite): users, clients, withdrawals, materials, notifications, security_logs, settings
- `server/storage.ts` — DatabaseStorage class with all CRUD operations
- `server/routes.ts` — API routes (auth, admin, user endpoints) + multer image upload
- `server/db.ts` — Turso/libSQL database connection
- `server/cloudinary.ts` — Cloudinary image upload/delete utilities
- `server/seed.ts` — Auto-seeds admin user on startup if none exists
- `client/src/App.tsx` — Router with PrivateRoute auth guards
- `client/src/lib/queryClient.ts` — React Query config with apiRequest helper (supports FormData)

## Environment Variables (Required for Production)

- `TURSO_DATABASE_URL` — Turso database URL (e.g., `libsql://your-db.turso.io`)
- `TURSO_AUTH_TOKEN` — Turso auth token
- `CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name
- `CLOUDINARY_API_KEY` — Cloudinary API key
- `CLOUDINARY_API_SECRET` — Cloudinary API secret

## API Routes

### Auth
- POST /api/auth/login, /api/auth/register, /api/auth/logout
- GET /api/auth/me

### Admin (requireAdmin)
- GET /api/admin/dashboard, /affiliates, /clients, /withdrawals, /withdrawals/stats, /materials, /notifications, /security-logs, /settings
- GET /api/admin/clients/:id (single client with affiliate info)
- PATCH /api/admin/clients/:id/status (with adminNote, notifyAffiliate), /clients/:id/note, /clients/:id/site-started, /withdrawals/:id/status, /settings
- POST /api/admin/materials, /notifications
- DELETE /api/admin/materials/:id

### User (requireAuth)
- GET /api/user/clients, /withdrawals, /notifications, /materials
- POST /api/user/clients, /withdrawals, /change-password
- PATCH /api/user/profile

## Credentials

- Admin: phone=`900000000`, password=`admin123` (auto-seeded on startup if no admin exists)
- Users: created via register flow

## Plans & Commissions

- Essencial: Kz 130,000 (commission Kz 20,000)
- Profissional: Kz 250,000 (commission Kz 40,000)
- Premium: Kz 400,000 (commission Kz 70,000)

## Withdrawal Methods

- Transferência IBAN
- Unitel Money
- Afrimoney

## Responsiveness

All pages are fully responsive with mobile-first breakpoints:
- **Landing page**: hero, navbar (mobile menu), features-grid (min-h instead of fixed h), ai-tip-card, value-proposition, faq, footer — all scale from 320px+
- **Admin dashboard**: sidebar collapses via shadcn SidebarProvider, stat grids 2-col on mobile → 4-col on lg, tables with horizontal scroll (min-w + overflow-x-auto), all headers/text scale down on sm
- **User dashboard**: same responsive patterns as admin, profile avatar/cards scale, action buttons full-width on mobile
- **Login page**: already responsive with max-w-[400px] centered card
- Custom thin scrollbar styles for horizontal scroll areas in index.css

## SEO

Comprehensive SEO implementation targeting "ganhar dinheiro na internet angola" and related keywords:
- **Meta tags**: Complete title, description, keywords, geo tags, canonical URL, hreflang pt-AO/pt
- **Open Graph & Twitter Cards**: Full OG and Twitter meta tags with proper content
- **Structured Data (JSON-LD)**: 6 blocks — WebApplication, Organization, FAQPage, HowTo, BreadcrumbList, Service with OfferCatalog
- **robots.txt**: Allows all pages except /admin /usuario /api; explicitly allows AI crawlers (GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, Applebot-Extended)
- **sitemap.xml**: Static sitemap in client/public + dynamic endpoint at /api/seo/sitemap.xml
- **llms.txt**: AI-readable structured content at client/public/llms.txt + /api/seo/llms.txt
- **seo-content.tsx**: Screen-reader-only semantic content with keyword-rich FAQs and descriptions
- **Semantic HTML**: aria-labels, itemScope, itemType, itemProp, role attributes on all landing page sections
- **Animations**: Professional framer-motion animations with overflow-hidden to prevent layout shifts

## Security

Comprehensive security hardening applied to all API routes:
- **Helmet**: Security headers (X-Frame-Options, Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy, etc.)
- **Rate Limiting**: General (200 req/15min), auth (15 req/15min), strict operations (5 req/min)
- **CSRF Protection**: Token-based CSRF on all mutating endpoints; login/register exempt; token returned on login
- **Account Lockout**: 5 failed login attempts → 15-minute lockout per phone+IP combination
- **Session Security**: Regenerated on login, randomized secret, httpOnly + sameSite:strict + secure (prod) cookies, renamed cookie `__sid`
- **Input Sanitization**: XSS protection via HTML entity encoding on all text inputs
- **Password Policy**: Min 8 chars, 1 uppercase, 1 number required for registration and password change
- **Enum Validation**: Client status and withdrawal status validated against allowed values (no arbitrary strings)
- **Settings Whitelist**: Only allowed settings keys can be updated via admin API
- **UUID Validation**: All path parameter IDs validated as UUID format before database queries
- **Balance Validation**: Withdrawal amount validated against available balance (commission - previous withdrawals)
- **Active User Check**: `requireActiveUser` middleware checks `isActive` flag; deactivated accounts can't access user routes
- **Error Masking**: Internal errors logged server-side but generic message returned to client
- **Body Size Limit**: 1MB limit on JSON and URL-encoded request bodies
- **HPP Protection**: HTTP Parameter Pollution prevention via `hpp` middleware
- **Trust Proxy**: Enabled for proper IP detection behind Replit proxy
- **Bcrypt Rounds**: Increased from 10 to 12 rounds for stronger password hashing
- **Admin Toggle**: Endpoint to activate/deactivate affiliates (`PATCH /api/admin/affiliates/:id/toggle`)
