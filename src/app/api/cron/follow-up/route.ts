import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";
import { executeFollowupForDeal } from "@/lib/followup";
import { Deal } from "@/lib/supabase-server";

// Protege el endpoint con un header Authorization
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  try {
    // Verificar CRON_SECRET
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing Authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    if (token !== CRON_SECRET) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    // Obtener todos los deals activos con paso < 4
    const { data, error } = await (supabase as any)
      .from("deals")
      .select("*")
      .eq("estado", "activo")
      .lt("paso", 4);

    if (error) throw error;

    const deals: Deal[] = data || [];
    console.log(`CRON: Processing ${deals.length} deals for followup`);

    const results = await Promise.all(deals.map(executeFollowupForDeal));

    const successful = results.filter((r) => r).length;

    return NextResponse.json({
      success: true,
      message: `Executed ${successful}/${deals.length} followups`,
      executed: successful,
      total: deals.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in cron/follow-up:", error);
    return NextResponse.json(
      { error: "Failed to execute cron", details: String(error) },
      { status: 500 }
    );
  }
}
