import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not configured", details: "Missing env variables" },
        { status: 500 }
      );
    }

    const { data, error } = await (supabase as any)
      .from("deals")
      .select("*")
      .order("creado_en", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json(
      { error: "Failed to fetch deals", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      nombre,
      empresa,
      email,
      valor,
      contexto,
      razon_enfriamiento,
    } = body;

    if (!nombre || !empresa || !email || !valor || !contexto) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await (supabase as any)
      .from("deals")
      .insert([
        {
          nombre,
          empresa,
          email,
          valor: parseFloat(valor),
          contexto,
          razon_enfriamiento: razon_enfriamiento || "Contacto nuevo",
          paso: 0,
          estado: "activo",
          ultimo_contacto: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating deal:", error);
    return NextResponse.json(
      { error: "Failed to create deal", details: String(error) },
      { status: 500 }
    );
  }
}
