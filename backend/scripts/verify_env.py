"""Verify Supabase and database credentials are configured correctly."""
import os
import sys

from dotenv import load_dotenv

load_dotenv()

REQUIRED = {
    "SUPABASE_URL": os.getenv("SUPABASE_URL"),
    "SUPABASE_SERVICE_ROLE_KEY": os.getenv("SUPABASE_SERVICE_ROLE_KEY"),
    "SUPABASE_JWT_SECRET": os.getenv("SUPABASE_JWT_SECRET"),
    "DATABASE_URL": os.getenv("DATABASE_URL"),
}

missing = [k for k, v in REQUIRED.items() if not v or "YOUR_" in (v or "")]
if missing:
    print("Missing or placeholder values in backend/.env:")
    for k in missing:
        print(f"  - {k}")
    print("\nSee supabase/SETUP.md for instructions.")
    sys.exit(1)

print("All required env vars present.")

# Test Supabase REST API
try:
    import httpx

    url = REQUIRED["SUPABASE_URL"]
    key = REQUIRED["SUPABASE_SERVICE_ROLE_KEY"]
    r = httpx.get(
        f"{url}/rest/v1/",
        headers={"apikey": key, "Authorization": f"Bearer {key}"},
        timeout=10,
    )
    if r.status_code in (200, 404):
        print(f"Supabase API reachable: {url}")
    else:
        print(f"Supabase API returned {r.status_code}")
        sys.exit(1)
except Exception as e:
    print(f"Supabase API check failed: {e}")
    sys.exit(1)

# Test PostgreSQL
try:
    import psycopg2

    kwargs = {"dsn": REQUIRED["DATABASE_URL"]}
    if "supabase" in REQUIRED["DATABASE_URL"]:
        kwargs["sslmode"] = "require"
    conn = psycopg2.connect(**kwargs)
    cur = conn.cursor()
    cur.execute("SELECT 1")
    conn.close()
    print("PostgreSQL connection OK")
except Exception as e:
    print(f"PostgreSQL check failed: {e}")
    sys.exit(1)

print("\nSetup verified. Ready to start FastAPI.")
