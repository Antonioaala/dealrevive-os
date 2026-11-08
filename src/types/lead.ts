export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  quoteAmount: number;
  channel: "Email" | "WhatsApp" | "Phone";
  status: "Activo" | "Respondido" | "Cerrado";
  step: number;
  callNotes: string;
  excludeFromSequence: boolean;
  createdAt: Date;
  updatedAt: Date;
  followups: FollowUp[];
  replies: Reply[];
}

export interface FollowUp {
  id: string;
  leadId: string;
  step: number;
  subject: string;
  emailBody: string;
  whatsappMessage: string;
  sentAt: Date | null;
  createdAt: Date;
}

export interface Reply {
  id: string;
  leadId: string;
  message: string;
  source: string;
  createdAt: Date;
}
