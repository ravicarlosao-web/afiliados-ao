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
