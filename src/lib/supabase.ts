import { createClient } from "@supabase/supabase-js";

let cachedClient: ReturnType<typeof createClient> | null | undefined;

export function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRole) {
    return null;
  }

  if (cachedClient !== undefined) {
    return cachedClient;
  }

  cachedClient = createClient(supabaseUrl, supabaseServiceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}

export function normalizeViewPath(pathname: string) {
  const trimmed = pathname.trim();
  if (!trimmed || trimmed === "/") {
    return "/";
  }

  return trimmed.replace(/\/+$/, "");
}
