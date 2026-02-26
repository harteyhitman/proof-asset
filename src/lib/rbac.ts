
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function checkRole(userId: string, role: string) {
  const supabase = await createServerSupabaseClient();

  const { data: user, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user role:", error);
    return false;
  }

  return user?.role === role;
}
