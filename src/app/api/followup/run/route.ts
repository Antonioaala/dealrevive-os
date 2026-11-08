import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";
import { executeFollowupForDeal } from "@/lib/followup";
import { Deal } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    // Obtener deal_id del body o ejecutar para todos los activos
    const body = await request.json().catch(() => ({}));
    const { deal_id } = body;

    let deals: Deal[] = [];

    if (deal_id) {
      // Ejecutar para un deal específico
      const { data, error } = await (supabase as any)
        .from("deals")
        .select("*")
        .eq("id", deal_id)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: "Deal not found" }, { status: 404 });
      }
      deals = [data];
    } else {
      // Ejecutar para todos los deals activos con paso < 4
      const { data, error } = await (supabase as any)
        .from("deals")
        .select("*")
        .eq("estado", "activo")
        .lt("paso", 4);

      if (error) throw error;
      deals = data || [];
    }

    console.log(`Executing followups for ${deals.length} deal(s)`);

    const results = await Promise.all(deals.map(executeFollowupForDeal));

    const successful = results.filter((r) => r).length;

    return NextResponse.json({
      success: true,
      message: `Executed ${successful}/${deals.length} followups`,
      executed: successful,
      total: deals.length,
    });
  } catch (error) {
    console.error("Error in followup/run:", error);
    return NextResponse.json(
      { error: "Failed to execute followups", details: String(error) },
      { status: 500 }
    );
  }
}
