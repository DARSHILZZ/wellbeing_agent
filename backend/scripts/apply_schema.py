"""Execute core schema SQL against the Supabase/PostgreSQL database."""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL or "YOUR_REF" in DATABASE_URL:
    print("Error: DATABASE_URL is not set or contains placeholders in backend/.env")
    print("Please configure DATABASE_URL in backend/.env to execute against Supabase.")
    sys.exit(1)

SCHEMA_FILE = Path(__file__).resolve().parent.parent.parent / "supabase" / "schema.sql"

if not SCHEMA_FILE.exists():
    print(f"Error: Schema file not found at {SCHEMA_FILE}")
    sys.exit(1)

try:
    import psycopg2
    
    print(f"Connecting to database...")
    kwargs = {"dsn": DATABASE_URL}
    if "supabase" in DATABASE_URL:
        kwargs["sslmode"] = "require"
    
    conn = psycopg2.connect(**kwargs)
    conn.autocommit = True
    cur = conn.cursor()
    
    print(f"Reading schema from {SCHEMA_FILE}...")
    with open(SCHEMA_FILE, "r", encoding="utf-8") as f:
        sql_script = f.read()
    
    print("Executing core schema creation SQL...")
    cur.execute(sql_script)
    print("Successfully executed schema.sql! All core tables, triggers, and foreign keys created.")
    
    cur.close()
    conn.close()

except Exception as e:
    print(f"Database execution failed: {e}")
    sys.exit(1)
