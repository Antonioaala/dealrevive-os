import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// Mock database - in production, this would be a proper database
let leadsDB: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, message, source = "webhook" } = body;

    // Fetch the lead
    const lead = leadsDB.find((l) => l.id === leadId);

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Create reply record
    const reply = {
      id: uuidv4(),
      leadId,
      message,
      source,
      createdAt: new Date(),
    };

    if (!lead.replies) lead.replies = [];
    lead.replies.push(reply);

    // Update lead: mark as replied and exclude from sequence
    lead.status = "Respondido";
    lead.excludeFromSequence = true;
    lead.updatedAt = new Date();

    return NextResponse.json({
      success: true,
      message: "Lead marked as replied and excluded from automation",
      lead,
    });
  } catch (error) {
    console.error("Error processing reply webhook:", error);
    return NextResponse.json(
      { error: "Failed to process reply" },
      { status: 500 }
    );
  }
}
