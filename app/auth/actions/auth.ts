"use server";

import { Role } from "@/enums/role";
import { createClient } from "@/lib/supabase/server";

export interface LoginResponse {
  error: string | null;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { error: null };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function signUp(email: string, password: string): Promise<LoginResponse> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/protected`,
      },
    });

    if (error) throw error;

    if (!data.user) throw new Error("User not found");

    const { error: insertError } = await supabase.from("profiles").insert({
      id: data.user?.id,
      email,
      role: Role.EVENT_OWNER,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      console.log("Error inserting profile", insertError);
      throw insertError;
    }
    return { error: null };
  } catch (error: unknown) {
    console.log("Error signing up", error);
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function forgotPassword(email: string): Promise<LoginResponse> {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/update-password`,
    });

    if (error) throw error;

    return { error: null };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
