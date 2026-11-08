import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { generateFollowupsWithAI } from "@/lib/ai-fallback";

// Mock database - in production, this would be a proper database
// This is imported from the leads route.ts
let leadsDB: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId } = body;

    // Fetch the lead
    const lead = leadsDB.find((l) => l.id === leadId);

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Generate followups (with or without AI)
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const followups = await generateFollowupsWithAI(
      {
        name: lead.name,
        email: lead.email,
        company: lead.company,
        quoteAmount: lead.quoteAmount,
        callNotes: lead.callNotes,
      },
      apiKey
    );

    // Save followups to mock database
    const savedFollowups = followups.map((followup) => ({
      id: uuidv4(),
      leadId: lead.id,
      step: followup.step,
      subject: followup.subject,
      emailBody: followup.emailBody,
      whatsappMessage: followup.whatsappMessage,
      sentAt: null,
      createdAt: new Date(),
    }));

    lead.followups = savedFollowups;
    lead.step = 1;
    lead.updatedAt = new Date();

    return NextResponse.json({
      leadId,
      followups: savedFollowups,
      message: apiKey
        ? "Followups generated with AI"
        : "Followups generated with fallback template",
    });
  } catch (error) {
    console.error("Error generating followups:", error);
    return NextResponse.json(
      { error: "Failed to generate followups" },
      { status: 500 }
    );
  }
}
