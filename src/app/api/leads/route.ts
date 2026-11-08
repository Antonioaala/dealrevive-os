import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// Mock database in memory
let leadsDB: any[] = [
  {
    id: uuidv4(),
    name: "Carlos Mendez",
    email: "carlos@integradoresingenieria.com",
    phone: "+54 9 11 2345-6789",
    company: "Integradores de Ingeniería SA",
    quoteAmount: 85000,
    channel: "Email",
    status: "Activo",
    step: 0,
    callNotes:
      "Necesitan solución de integración de sistemas para proyecto de automatización industrial. Presupuesto aprobado. Timeline: 6 semanas. Cuello de botella: implementación de API con ERP legacy. Interesados en entrega por fases.",
    excludeFromSequence: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    followups: [],
    replies: [],
  },
  {
    id: uuidv4(),
    name: "Patricia López",
    email: "patricia@softwareplus.ar",
    phone: "+54 9 11 3456-7890",
    company: "Software Plus SRL",
    quoteAmount: 45000,
    channel: "WhatsApp",
    status: "Activo",
    step: 0,
    callNotes:
      "CTO interesada en plataforma de gestión de proyectos en nube. Migración desde solución local. Datos: 500GB. Seguridad: cumplimiento GDPR obligatorio. Decision maker: CEO (martes próximo). Budget confirmado pero con flexibilidad en timeline.",
    excludeFromSequence: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    followups: [],
    replies: [],
  },
  {
    id: uuidv4(),
    name: "Roberto Fernández",
    email: "rfernanez@construccionessg.com",
    phone: "+54 9 11 4567-8901",
    company: "Construcciones SG",
    quoteAmount: 120000,
    channel: "Phone",
    status: "Activo",
    step: 0,
    callNotes:
      "Director de Obra requiere sistema de gestión de materiales y logística. 50 obras simultáneas. Personal en terreno sin conectividad constante. Solución offline-first crítica. Presupuesto anual fijo. Implementación debe ser en 3 meses máximo antes de Q4.",
    excludeFromSequence: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    followups: [],
    replies: [],
  },
];

export async function GET() {
  try {
    return NextResponse.json(
      leadsDB.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    );
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newLead = {
      id: uuidv4(),
      name: body.name,
      email: body.email,
      phone: body.phone,
      company: body.company,
      quoteAmount: parseFloat(body.quoteAmount),
      channel: body.channel || "Email",
      status: "Activo",
      step: 0,
      callNotes: body.callNotes,
      excludeFromSequence: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      followups: [],
      replies: [],
    };

    leadsDB.push(newLead);
    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
