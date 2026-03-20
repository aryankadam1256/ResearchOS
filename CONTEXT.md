# ScholarFlow / ResearchOS - Project Context

> Use this file to get up to speed when switching devices or resuming work.

---

## Quick Start (New Device Setup)

```bash
# 1. Clone the repo
git clone https://github.com/aryankadam1256/ResearchOS.git
cd ResearchOS

# 2. Install dependencies
npm install

# 3. Install PostgreSQL locally (if not installed)
# Download from: https://www.postgresql.org/download/
# During install, set password to: 001256 (or update .env accordingly)

# 4. Create database
psql -U postgres -c "CREATE DATABASE \"research-os\";"

# 5. Create .env file
cat > .env << 'EOF'
AUTH_SECRET="my_super_secret_for_development_only"
DATABASE_URL="postgresql://postgres:001256@localhost:5432/research-os"
EOF

# 6. Push schema to database
npm run db:push

# 7. Seed with test data
npm run db:seed

# 8. Start dev server
npm run dev

# 9. Open browser: http://localhost:3000
# Login: prateek@research.ai / ResearchOS@2026
```

---

## Project Overview

**ScholarFlow** is a research management platform with:
- **Multi-tenancy**: Users can belong to multiple projects
- **RBAC**: Project-scoped roles (admin, researcher, observer)
- **Dual-layer routing**: Global Portal + Project Workspace

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.1.6 + React 19 + TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui v4 |
| Auth | NextAuth v5 beta 30 (Credentials + JWT) |
| Database | PostgreSQL + Drizzle ORM |
| Fonts | Manrope, IBM Plex Mono, Source Serif 4 |

---

## Architecture

### Routing Structure
```
/                           → Landing page
/login                      → Auth page
/dashboard                  → Global Portal (project list, notifications)
/dashboard/[projectId]      → Project Command Center
/dashboard/[projectId]/papers        → Paper Vault
/dashboard/[projectId]/experiments   → Experiment Ledger
/dashboard/[projectId]/checkins      → Daily Check-ins
/dashboard/[projectId]/heatmap       → Team Activity Heatmap
/dashboard/[projectId]/phases        → Phase Progression
/dashboard/[projectId]/reviews       → Review Milestones
/dashboard/[projectId]/red-team      → Ethics & Safety
/dashboard/[projectId]/bib-generator → BibTeX Generator
/invite/[token]             → Accept invitation
/project/[projectId]/join   → Request to join
```

### Database Schema (10 tables)
- `users` - User accounts
- `projects` - Research projects
- `memberships` - Users ↔ Projects with role (admin/researcher/observer)
- `invitations` - Token-based invites with expiry
- `join_requests` - User-initiated join requests
- `notifications` - In-app notifications
- `checkins` - Daily check-ins with mood
- `experiment_logs` - Experiment tracking
- `papers` - PDF metadata with authors/tags

### Key Files
```
lib/db/index.ts           → Database connection
lib/db/schema/*.ts        → All table definitions
lib/db/seed.ts            → Seed script
lib/auth/helpers.ts       → requireAuth, requireProjectAccess
lib/actions/*.ts          → Server actions (8 files)
auth.ts                   → NextAuth configuration
middleware.ts             → Route protection
drizzle.config.ts         → Drizzle Kit config
```

---

## Database Commands

```bash
npm run db:push      # Push schema changes to database
npm run db:seed      # Reset and seed with test data
npm run db:studio    # Open Drizzle Studio (visual DB browser)
npm run db:generate  # Generate migration files
npm run db:migrate   # Run migrations
```

---

## Test Accounts

| Email | Password | Role (in Golden Project) |
|-------|----------|--------------------------|
| prateek@research.ai | ResearchOS@2026 | Admin |
| ananya@research.ai | ResearchOS@2026 | Researcher |
| ravi@research.ai | ResearchOS@2026 | Researcher |
| sneha@research.ai | ResearchOS@2026 | Observer |
| dev@research.ai | ResearchOS@2026 | Observer |

---

## Three Join Pathways

1. **Email Invite** - Admin sends invite to specific email → instant join
2. **In-app Notification** - Invite appears on user's Global Portal
3. **Join Request** - User finds project via link → requests to join → Admin approves/rejects

---

## Session Issue Fix

If you see errors like `params: user-1` instead of a UUID, it means you have an old session cookie. Fix:

1. Open DevTools (F12) → Application → Cookies → localhost
2. Delete all cookies
3. Refresh and login again

---

## What's Built (Complete)

- [x] Database schema with 10 tables + relations
- [x] Auth upgraded from in-memory to PostgreSQL
- [x] RBAC with project-scoped roles
- [x] Dual-layer routing (Portal + Workspace)
- [x] Server actions for all CRUD operations
- [x] Invitation system (email + in-app)
- [x] Join request system with admin approval
- [x] Notification system
- [x] Seed script with Golden Research Project

---

## What's Next (Future Work)

- [ ] Create Project UI (form on Global Portal)
- [ ] Member management UI (invite users, change roles)
- [ ] Connect existing pages to real data (replace MOCK_* arrays)
- [ ] File upload for papers (integrate storage like S3/Cloudflare R2)
- [ ] Email notifications (integrate Resend/SendGrid)
- [ ] Real-time updates (Pusher/Socket.io)

---

## Troubleshooting

### Database connection failed
- Ensure PostgreSQL is running: `pg_isready`
- Check password in `.env` matches your PostgreSQL password

### "ENOTFOUND" error with Neon
- Your network blocks Neon. Use local PostgreSQL instead.

### Old session causing UUID errors
- Clear cookies and login again

---

*Last updated: 2026-03-19*
