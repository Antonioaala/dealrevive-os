"use client";

import { useParams } from "next/navigation";
import LeadDetail from "@/components/LeadDetail";

export default function LeadPage() {
  const params = useParams();
  const id = params.id as string;
  return <LeadDetail leadId={id} />;
}
