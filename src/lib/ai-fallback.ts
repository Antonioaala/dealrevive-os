const FOLLOWUP_TEMPLATES = [
  {
    step: 1,
    subject: "Re: {company} - Solución de Entrega Rápida Disponible",
    emailBody: `Hola {name},

Tras revisar tu requisición de {amount}, nos enfocamos en resolver tu cuello de botella principal en los primeros {days} días.

Tu equipo recibió un análisis técnico personalizado esta semana. ¿Confirmamos la sesión de implementación para el próximo jueves?

Disponible: 10:00 AM - 2:00 PM (Tu zona horaria)

¿Te parece bien?

Saludos,
DealRevive Team`,
    whatsappMessage: `Hola {name} 👋

Vimos tu proyecto de {amount} en {company}. Tenemos disponibilidad inmediata para resolver tu cuello de botella en 72 horas.

¿Podemos agendar una sesión técnica?

Disponibilidad: Jueves 10-14hs o Viernes 9-12hs`,
  },
  {
    step: 2,
    subject: "Caso de Éxito: {company} - Integrador de Ingeniería Similar",
    emailBody: `Hola {name},

Uno de nuestros clientes en el sector de ingeniería logró reducir tiempos de entrega en un 40% con el enfoque que te propusimos.

Adjunto: Estudio de caso + Roadmap técnico personalizado para {company}

¿Te parece si revisamos juntos cómo adaptarlo a tu contexto específico?

Llamada rápida: Mañana 14:00 o Viernes 10:00

¿Qué prefieres?

Saludos,
DealRevive Team`,
    whatsappMessage: `{name}, hablamos del caso de éxito con integrador similar a ustedes 📊

Redujeron time-to-market 40%. Te envío el PDF con la arquitectura.

¿Revisamos mañana? Tengo slots 14hs o viernes 10hs ✅`,
  },
  {
    step: 3,
    subject: "Flexibilidad en Entregas - Presupuesto {amount} Confirmado",
    emailBody: `Hola {name},

Entendemos que pueden existir restricciones de presupuesto o timeline. Aquí van nuestras opciones de flexibilidad:

1️⃣ Plan Fase 1: Núcleo funcional en 2 semanas ({amount * 0.4})
2️⃣ Plan Completo: Con integraciones en 4 semanas ({amount})
3️⃣ Plan Extendido: 12 meses de soporte post-lanzamiento ({amount * 1.2})

¿Cuál se alinea mejor con tu prioridad actual?

Estoy aquí para hacer esto viable para tu equipo.

Saludos,
DealRevive Team`,
    whatsappMessage: `{name}, última verificación 🎯

¿Tu prioridad es entrega rápida o integración completa? Tengo 3 opciones de presupuesto flexible.

Confirmamos y arrancamos lunes. ¿Cuál es tu preferencia?`,
  },
];

interface GenerateFollowupParams {
  name: string;
  email: string;
  company: string;
  quoteAmount: number;
  callNotes: string;
}

interface GeneratedFollowup {
  step: number;
  subject: string;
  emailBody: string;
  whatsappMessage: string;
}

export function generateFollowups(params: GenerateFollowupParams): GeneratedFollowup[] {
  const { name, company, quoteAmount } = params;

  return FOLLOWUP_TEMPLATES.map((template) => ({
    step: template.step,
    subject: template.subject
      .replace("{company}", company)
      .replace("{amount}", quoteAmount.toString()),
    emailBody: template.emailBody
      .replace("{name}", name)
      .replace("{company}", company)
      .replace("{amount}", quoteAmount.toString())
      .replace("{days}", "72"),
    whatsappMessage: template.whatsappMessage
      .replace("{name}", name)
      .replace("{company}", company)
      .replace("{amount}", quoteAmount.toString()),
  }));
}

export async function generateFollowupsWithAI(
  params: GenerateFollowupParams,
  apiKey?: string
): Promise<GeneratedFollowup[]> {
  if (!apiKey) {
    return generateFollowups(params);
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `Eres un expert en sales y follow-ups B2B. Genera 3 correos/mensajes de seguimiento para este lead:

Nombre: ${params.name}
Empresa: ${params.company}
Presupuesto: $${params.quoteAmount}
Notas de la llamada: ${params.callNotes}

Retorna un JSON con la estructura:
{
  "followups": [
    {
      "step": 1,
      "subject": "...",
      "emailBody": "...",
      "whatsappMessage": "..."
    },
    ...
  ]
}

Día 3: Foco en entrega inmediata
Día 7: Aporte de valor técnico
Día 11: Flexibilidad en entregas`,
          },
        ],
      }),
    });

    const data = await response.json();
    const content = data.content?.[0]?.text || "";

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return generateFollowups(params);
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.followups || generateFollowups(params);
  } catch {
    return generateFollowups(params);
  }
}
