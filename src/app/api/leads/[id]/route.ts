import { NextRequest, NextResponse } from "next/server";

// Reference to shared leadsDB from leads/route.ts
// In production, this would be a proper database
let leadsDB: any[] = [];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const lead = leadsDB.find((l) => l.id === id);

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...lead,
      followups: lead.followups?.sort((a: any, b: any) => a.step - b.step) || [],
      replies: lead.replies?.sort((a: any, b: any) => b.createdAt - a.createdAt) || [],
    });
  } catch (error) {
    console.error("Error fetching lead:", error);
    return NextResponse.json(
      { error: "Failed to fetch lead" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const leadIndex = leadsDB.findIndex((l) => l.id === id);

    if (leadIndex === -1) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const lead = leadsDB[leadIndex];
    if (body.status) lead.status = body.status;
    if (body.step !== undefined) lead.step = body.step;
    if (body.excludeFromSequence !== undefined)
      lead.excludeFromSequence = body.excludeFromSequence;
    lead.updatedAt = new Date();

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}
