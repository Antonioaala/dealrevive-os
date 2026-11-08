import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";

export async function POST(
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
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Missing message field" },
        { status: 400 }
      );
    }

    // 1. Guardar respuesta en tabla emails
    const emailResult = await (supabase as any)
      .from("emails")
      .insert([
        {
          deal_id: id,
          direccion: "recibido",
          asunto: "Respuesta del cliente",
          cuerpo: message,
          creado_en: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (emailResult.error) throw emailResult.error;

    // 2. Actualizar deal: cambiar estado a "respondio" y paso a 0
    const dealResult = await (supabase as any)
      .from("deals")
      .update({
        estado: "respondio",
        paso: 0, // Bloquear más emails automáticos
        ultimo_contacto: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (dealResult.error) throw dealResult.error;

    console.log(`✅ Deal ${id} marked as respondio (Stop-on-Reply)`);

    return NextResponse.json({
      success: true,
      message: "Lead marked as responded. Sequence stopped.",
      deal: dealResult.data,
      reply: emailResult.data,
    });
  } catch (error) {
    console.error("Error processing reply:", error);
    return NextResponse.json(
      { error: "Failed to process reply", details: String(error) },
      { status: 500 }
    );
  }
}
