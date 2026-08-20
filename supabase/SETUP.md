# Supabase Project Setup

Follow these steps to create the project and distribute credentials to your team.

---

## Step 1 — Create the Project

1. Go to **[supabase.com/dashboard](https://supabase.com/dashboard)**
2. Click **New project**
3. Fill in:
   | Field | Recommended value |
   |-------|-------------------|
   | **Name** | `adaptive-learning-platform` |
   | **Database password** | Generate a strong password — **save it securely** |
   | **Region** | Closest to your users (e.g. `South Asia (Mumbai)`) |
4. Click **Create new project** — provisioning takes ~2 minutes

---

## Step 2 — Get API Credentials

Once provisioned:

1. Open **Project Settings** (gear icon, bottom-left sidebar)
2. Click **API** in the left menu
3. Copy these three values:

| Credential | Where to find | Used by |
|------------|---------------|---------|
| **Project URL** | `Project URL` field | Frontend + Backend |
| **anon key** | `Project API keys` → `anon` `public` | **Next.js only** |
| **service_role key** | `Project API keys` → `service_role` `secret` | **FastAPI only** |

Also copy from **Project Settings → Database → Connection string → URI (Session pooler)**:
| Credential | Used by |
|------------|---------|
| **DATABASE_URL** | FastAPI (SQLAlchemy) |

---

## Step 3 — Apply the Database Schema

1. In Supabase Dashboard → **SQL Editor**
2. Click **New query**
3. Paste the contents of `supabase/schema.sql`
4. Click **Run**

Verify in **Table Editor** — you should see: `profiles`, `classes`, `quizzes`, `scores`, etc.

---

## Step 4 — Distribute Credentials Securely

**Never commit real keys to git.** Share via your team's secret manager (1Password, Vault, etc.).

### Frontend developer receives:
```
NEXT_PUBLIC_SUPABASE_URL=<Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

→ Copy into `frontend/.env.local`

### Backend developer receives:
```
SUPABASE_URL=<Project URL>
SUPABASE_SERVICE_ROLE_KEY=<service_role key>
SUPABASE_JWT_SECRET=<from Project Settings → API → JWT Settings → JWT Secret>
DATABASE_URL=<Session pooler connection string>
GROK_API_KEY=<from x.ai>
GEMINI_API_KEY=<from Google AI Studio>
```

→ Copy into `backend/.env`

---

## Step 5 — Enable Email Auth (optional for MVP)

1. **Authentication → Providers → Email** — enable
2. **Authentication → URL Configuration** — set:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/**`

---

## Security Rules

| Key | Safe in browser? | Notes |
|-----|-----------------|-------|
| `anon` key | Yes | Protected by RLS — users only see their own data |
| `service_role` key | **Never** | Bypasses RLS — backend only, never expose to client |
| `JWT Secret` | **Never** | Used by FastAPI to verify tokens |
| Database password | **Never** | Only in `DATABASE_URL` on backend |

---

## Verify Setup

After filling in `.env` files, run:

```powershell
# Backend connectivity check
cd backend
python scripts/verify_env.py

# Frontend — start dev server
cd frontend
npm run dev
```

---

## Credential Checklist (fill in after creation)

```
Project name:     ___________________________
Project URL:      https://__________.supabase.co
Project ref:      ___________________________
Database password: (stored in password manager)

[ ] anon key copied to frontend/.env.local
[ ] service_role key copied to backend/.env
[ ] JWT secret copied to backend/.env
[ ] DATABASE_URL copied to backend/.env
[ ] schema.sql applied in SQL Editor
[ ] Email auth enabled
[ ] Keys shared with team via secure channel (NOT Slack/email)
```
