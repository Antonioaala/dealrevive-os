import LeadDetail from "@/components/LeadDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadPage({ params }: PageProps) {
  const { id } = await params;
  return <LeadDetail leadId={id} />;
}
