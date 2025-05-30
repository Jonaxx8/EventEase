import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Role } from "@/enums/role";

const VALID_ROLES = [Role.USER, Role.EVENT_OWNER, Role.ADMIN] as const;
type ValidRole = typeof VALID_ROLES[number];

export async function GET() {
  try {
    const supabase = await createClient();

    // First verify that the current user is an admin or event owner
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has admin or event owner role
    const { data: userRole } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!userRole || (userRole.role !== Role.ADMIN && userRole.role !== Role.EVENT_OWNER)) {
      return NextResponse.json(
        { error: "Unauthorized: Admin or Event Owner access required" },
        { status: 403 }
      );
    }

    // Fetch all users except the current admin
    const { data: users, error } = await supabase
      .from("profiles")
      .select(`
        id,
        email,
        role,
        created_at
      `)
      .neq("id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { userId, newRole } = body;

    if (!userId || !newRole) {
      return NextResponse.json(
        { error: "User ID and new role are required" },
        { status: 400 }
      );
    }

    if (!VALID_ROLES.includes(newRole as ValidRole)) {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      );
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check current user's role
    const { data: currentUserRole } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!currentUserRole) {
      return NextResponse.json({ error: "User role not found" }, { status: 404 });
    }

    // Get target user's current role
    const { data: targetUser } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (!targetUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    // Enforce role-based permissions
    if (currentUserRole.role === Role.EVENT_OWNER) {
      // Event owners can only change users to regular users
      if (newRole !== Role.USER || targetUser.role !== Role.USER) {
        return NextResponse.json(
          { error: "Event owners can only manage regular users" },
          { status: 403 }
        );
      }
    } else if (currentUserRole.role === Role.ADMIN) {
      // Admins can change to any role
      // No additional restrictions needed
    } else {
      return NextResponse.json(
        { error: "Unauthorized: Insufficient permissions" },
        { status: 403 }
      );
    }

    // Prevent changing own role
    if (userId === user.id) {
      return NextResponse.json(
        { error: "Cannot change your own role" },
        { status: 400 }
      );
    }

    // Update the user's role
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update user role" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 