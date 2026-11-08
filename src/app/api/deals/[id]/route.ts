import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    const { id } = await params;

    const [dealRes, emailsRes] = await Promise.all([
      (supabase as any).from("deals").select("*").eq("id", id).single(),
      (supabase as any)
        .from("emails")
        .select("*")
        .eq("deal_id", id)
        .order("creado_en", { ascending: false }),
    ]);

    if (dealRes.error) throw dealRes.error;
    if (emailsRes.error) throw emailsRes.error;

    return NextResponse.json({
      ...(dealRes.data || {}),
      emails: emailsRes.data || [],
    });
  } catch (error) {
    console.error("Error fetching deal:", error);
    return NextResponse.json(
      { error: "Failed to fetch deal", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const { data, error } = await (supabase as any)
      .from("deals")
      .update({
        ...body,
        ultimo_contacto: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating deal:", error);
    return NextResponse.json(
      { error: "Failed to update deal", details: String(error) },
      { status: 500 }
    );
  }
}
