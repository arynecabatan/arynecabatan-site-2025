import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_post")
    .select("id, title, slug, category, tags")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}