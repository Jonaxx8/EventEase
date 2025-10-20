import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: "HEAD", // lightweight ping
      headers: {
        apikey: supabaseAnonKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Ping failed with status: ${response.status}`);
    }

    return NextResponse.json({
      success: true,
      message: "Supabase ping successful ✅",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message: "Ping failed ❌", error: errorMessage },
      { status: 500 }
    );
  }
}
