import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function seed() {
  if (!url || !key) {
    console.log("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Skip seed.");
    return;
  }
  const supabase = createClient(url, key);
  console.log("Seeding database...");
  // Add sample data if needed for development
  console.log("Database seed complete.");
}

seed().catch(console.error);
