import "server-only";

import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

type AdminSessionUser = {
  id: string;
  email: string | null;
};

export async function getAdminSessionUser(): Promise<AdminSessionUser | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  if (user.app_metadata?.role !== "admin") {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? null
  };
}

export async function requireAdminUser() {
  const user = await getAdminSessionUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
