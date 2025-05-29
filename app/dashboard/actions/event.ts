"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createEvent(data: {
  title: string;
  description: string | null;
  location: string | null;
  date_time: string;
  public_slug: string;
}) {
  const supabase = await createClient();
  
  // Get current user's profile
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Get user's profile ID
  
  if (!user) throw new Error("User not found");

  // Create event
  const { error } = await supabase.from("events").insert({
    ...data,
    owner_id: user.id
  });

  if (error) throw error;

  revalidatePath("/dashboard");
}

export const getEvent = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

  
export const updateEvent = async (id: string, data: {
  title: string;
  description: string | null;
  location: string | null;
  date_time: string;
}) => {
  const supabase = await createClient();
  const { error } = await supabase.from("events").update(data).eq("id", id);
  if (error) throw error;
  revalidatePath("/dashboard");
}

export const deleteEvent = async (id: string) => {
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/dashboard");
}