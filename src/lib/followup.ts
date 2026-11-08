import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import { supabase } from "./supabase-server";
import { Deal, Email } from "./supabase-server";

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export interface FollowupEmail {
  asunto: string;
  cuerpo: string;
  paso: number;
}

export async function generateFollowupEmail(
  deal: Deal,
  paso: number
): Promise<FollowupEmail | null> {
  if (!anthropic) {
    console.error("Anthropic API key not configured");
    return null;
  }

  const prompts: Record<
    number,
    (deal: Deal) => string
  > = {
    1: (d) =>
      `Eres un experto en ventas B2B que revive tratos fríos. Escribe un email SHORT (max 90 palabras) en español para reenganche.

Contexto: ${d.contexto}
Por qué se enfriaron: ${d.razon_enfriamiento}
Empresa: ${d.empresa}
Contacto: ${d.nombre}

Paso 1: RETOMAMOS LA CONVERSACIÓN. Email debe:
- Ser natural, como de un humano
- Recordar brevemente la conversación anterior
- Generar curiosidad
- NO vender, solo reconectar

Responde en JSON: {"asunto": "...", "cuerpo": "..."}`,

    2: (d) =>
      `Eres un experto en ventas B2B. Escribe un email SHORT (max 90 palabras) en español con valor técnico.

Contexto: ${d.contexto}
Empresa: ${d.empresa}
Contacto: ${d.nombre}

Paso 2: APORTAMOS VALOR. Email debe:
- Compartir insight o caso de éxito similar
- Mostrar que entiendes el negocio
- Dar razón para leer (no genérico)
- NO vender, solo demostrar experiencia

Responde en JSON: {"asunto": "...", "cuerpo": "..."}`,

    3: (d) =>
      `Eres un experto en cierres B2B. Escribe un email SHORT (max 90 palabras) en español con pregunta directa.

Contexto: ${d.contexto}
Empresa: ${d.empresa}
Contacto: ${d.nombre}
Valor: $${d.valor.toLocaleString()}

Paso 3: PREGUNTA DIRECTA Y SENCILLA. Email debe:
- Hacer una pregunta concreta (yes/no)
- Ejemplo: "¿Sigues interesado?" o "¿Podemos agendar 15 min?"
- Crear urgencia suave
- Mantener profesionalismo

Responde en JSON: {"asunto": "...", "cuerpo": "..."}`,

    4: (d) =>
      `Eres un experto en cierre de ventas. Escribe un email SHORT (max 90 palabras) en español, DESPEDIDA AMABLE.

Contexto: ${d.contexto}
Empresa: ${d.empresa}
Contacto: ${d.nombre}

Paso 4: DESPEDIDA AMABLE - DEJAR PUERTA ABIERTA. Email debe:
- Ser cordial, NO presionante
- Reconocer que quizá no es el momento
- Dejar puerta abierta para futuro
- Contacto directo para cuando cambien de idea
- Este es el ÚLTIMO email automático

Responde en JSON: {"asunto": "...", "cuerpo": "..."}`,
  };

  const prompt = prompts[paso]?.(deal);
  if (!prompt) {
    console.error(`No prompt for step ${paso}`);
    return null;
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") return null;

    const json = JSON.parse(content.text);
    return {
      asunto: json.asunto,
      cuerpo: json.cuerpo,
      paso,
    };
  } catch (error) {
    console.error("Error generating followup email:", error);
    return null;
  }
}

export async function sendFollowupEmail(
  deal: Deal,
  email: FollowupEmail
): Promise<boolean> {
  if (!resend || !process.env.DEMO_EMAIL) {
    console.error("Resend not configured or DEMO_EMAIL not set");
    return false;
  }

  try {
    const result = await resend.emails.send({
      from: "DealRevive <onboarding@resend.dev>",
      to: process.env.DEMO_EMAIL,
      subject: `[DEMO] ${email.asunto} - ${deal.nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p><strong>Para:</strong> ${deal.nombre} (${deal.empresa})</p>
          <p><strong>Paso:</strong> ${email.paso} de 4</p>
          <hr />
          <h2>${email.asunto}</h2>
          <p>${email.cuerpo.replace(/\n/g, "<br>")}</p>
          <hr />
          <p style="color: #999; font-size: 12px;">
            Demo - DealRevive OS. Este correo fue generado por IA y enviado a ${process.env.DEMO_EMAIL} con fines de demostración.
          </p>
        </div>
      `,
    });

    return !!((result as any).id || (result as any).data?.id);
  } catch (error) {
    console.error("Error sending email with Resend:", error);
    return false;
  }
}

export async function saveFollowupEmail(
  dealId: string,
  email: FollowupEmail
): Promise<Email | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await (supabase as any)
      .from("emails")
      .insert([
        {
          deal_id: dealId,
          direccion: "enviado",
          asunto: email.asunto,
          cuerpo: email.cuerpo,
          paso: email.paso,
          creado_en: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving followup email:", error);
    return null;
  }
}

export async function updateDealAfterFollowup(
  dealId: string,
  paso: number
): Promise<void> {
  if (!supabase) return;

  try {
    const estado = paso >= 4 ? "perdido" : "activo";
    await (supabase as any)
      .from("deals")
      .update({
        paso,
        estado,
        ultimo_contacto: new Date().toISOString(),
      })
      .eq("id", dealId);
  } catch (error) {
    console.error("Error updating deal:", error);
  }
}

export async function executeFollowupForDeal(deal: Deal): Promise<boolean> {
  console.log(`Processing followup for deal: ${deal.nombre}`);

  // Solo si está activo y paso < 4
  if (deal.estado !== "activo" || deal.paso >= 4) {
    console.log(`Skipping deal ${deal.id}: estado=${deal.estado}, paso=${deal.paso}`);
    return false;
  }

  const nextPaso = deal.paso + 1;

  // Generar email con IA
  const emailData = await generateFollowupEmail(deal, nextPaso);
  if (!emailData) {
    console.error(`Failed to generate email for ${deal.nombre}`);
    return false;
  }

  // Enviar con Resend
  const sent = await sendFollowupEmail(deal, emailData);
  if (!sent) {
    console.error(`Failed to send email for ${deal.nombre}`);
    return false;
  }

  // Guardar en BD
  await saveFollowupEmail(deal.id, emailData);

  // Actualizar deal (paso++, estado)
  await updateDealAfterFollowup(deal.id, nextPaso);

  console.log(`✅ Followup sent for ${deal.nombre} (paso ${nextPaso})`);
  return true;
}
