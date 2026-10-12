import { createClient } from "@/lib/supabase/client";
import type { Role } from "@/types/database";

export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

export async function getCurrentRole(): Promise<Role | null> {
  const profile = await getCurrentProfile();
  return (profile?.role as Role) ?? null;
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}