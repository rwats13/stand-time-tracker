import { supabase } from "@/lib/supabase/client";
import type { StandingSession } from "@/lib/supabase/types";

const USER_ID = "default";

export async function saveSession(
  session: Omit<StandingSession, "id" | "user_id" | "created_at" | "synced_at">
): Promise<StandingSession | null> {
  const { data, error } = await supabase
    .from("standing_sessions")
    .insert({
      ...session,
      user_id: USER_ID,
      id: crypto.randomUUID(),
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to save session:", error);
    return null;
  }

  return data;
}

export async function getSessions(
  date: string
): Promise<StandingSession[]> {
  const { data, error } = await supabase
    .from("standing_sessions")
    .select("*")
    .eq("user_id", USER_ID)
    .gte("started_at", `${date}T00:00:00`)
    .lt("started_at", `${date}T23:59:59`)
    .order("started_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch sessions:", error);
    return [];
  }

  return data ?? [];
}

export async function deleteSession(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("standing_sessions")
    .delete()
    .eq("id", id)
    .eq("user_id", USER_ID);

  if (error) {
    console.error("Failed to delete session:", error);
    return false;
  }

  return true;
}
