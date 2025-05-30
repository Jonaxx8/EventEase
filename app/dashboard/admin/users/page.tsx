import { Metadata } from "next";
import { UserManagement } from "./user-management";

export const metadata: Metadata = {
  title: "User Management | EventEase",
  description: "Manage users and their roles",
};

export default function AdminUsersPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          View and manage user roles and permissions
        </p>
      </div>
      <UserManagement />
    </div>
  );
} 