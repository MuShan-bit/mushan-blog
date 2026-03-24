import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, normalizeViewPath } from "@/lib/supabase";

export const runtime = "nodejs";

type ViewAdmin = {
  from(table: "page_views"): {
    select(columns: "views"): {
      eq(column: "path", value: string): {
        maybeSingle(): Promise<{
          data: { views: number } | null;
          error: Error | null;
        }>;
      };
    };
  };
  rpc(
    fn: "increment_page_views",
    params: { page_path: string },
  ): Promise<{ error: Error | null }>;
};

export async function GET(request: NextRequest) {
  const rawPath = request.nextUrl.searchParams.get("path");

  if (!rawPath) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  const path = normalizeViewPath(rawPath);
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ count: 0, degraded: true }, { headers: { "Cache-Control": "no-store" } });
  }

  const admin = supabase as unknown as ViewAdmin;

  const { data, error } = await admin
    .from("page_views")
    .select("views")
    .eq("path", path)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ count: 0 }, { headers: { "Cache-Control": "no-store" } });
  }

  return NextResponse.json(
    { count: data?.views ?? 0 },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const rawPath = typeof payload?.path === "string" ? payload.path : "";

  if (!rawPath) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  const path = normalizeViewPath(rawPath);
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ ok: true, degraded: true });
  }

  const admin = supabase as unknown as ViewAdmin;

  const { error } = await admin.rpc("increment_page_views", {
    page_path: path,
  });

  if (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
