"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader, Zap, Copy, Check } from "lucide-react";
import Link from "next/link";

interface FollowUp {
  id: string;
  step: number;
  subject: string;
  emailBody: string;
  whatsappMessage: string;
  sentAt: string | null;
}

interface Reply {
  id: string;
  message: string;
  createdAt: string;
  source: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  quoteAmount: number;
  channel: string;
  status: string;
  step: number;
  callNotes: string;
  excludeFromSequence: boolean;
  createdAt: string;
  followups: FollowUp[];
  replies: Reply[];
}

interface LeadDetailProps {
  leadId: string;
}

export default function LeadDetail({ leadId }: LeadDetailProps) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingFollowups, setGeneratingFollowups] = useState(false);
  const [simulatingReply, setSimulatingReply] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchLead();
  }, [leadId]);

  const fetchLead = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leads/${leadId}`);
      if (response.ok) {
        const data = await response.json();
        setLead(data);
      }
    } catch (error) {
      console.error("Failed to fetch lead:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFollowups = async () => {
    setGeneratingFollowups(true);
    try {
      const response = await fetch("/api/generate-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      });

      if (response.ok) {
        await fetchLead();
      }
    } catch (error) {
      console.error("Failed to generate followups:", error);
    } finally {
      setGeneratingFollowups(false);
    }
  };

  const handleSimulateReply = async () => {
    setSimulatingReply(true);
    try {
      const response = await fetch("/api/webhook/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          message: "Hola, nos interesa el lote de entrega rápida, ¿podemos ajustar flete?",
          source: "simulator",
        }),
      });

      if (response.ok) {
        await fetchLead();
      }
    } catch (error) {
      console.error("Failed to simulate reply:", error);
    } finally {
      setSimulatingReply(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-850 text-slate-50 p-8 flex items-center justify-center">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-850 text-slate-50 p-8">
        <Link href="/" className="text-emerald-400 hover:text-emerald-300 mb-4 flex items-center gap-2">
          <ArrowLeft size={20} />
          Volver
        </Link>
        <p className="text-slate-400">Lead no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-850 text-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-emerald-400 hover:text-emerald-300 mb-8 flex items-center gap-2">
          <ArrowLeft size={20} />
          Volver al Dashboard
        </Link>

        {/* Lead Info Header */}
        <div className="bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-3xl font-bold mb-4">{lead.name}</h1>
              <div className="space-y-2 text-slate-300">
                <p><span className="font-semibold">Empresa:</span> {lead.company}</p>
                <p><span className="font-semibold">Email:</span> {lead.email}</p>
                <p><span className="font-semibold">Teléfono:</span> {lead.phone}</p>
                <p><span className="font-semibold">Presupuesto:</span> ${lead.quoteAmount.toLocaleString()}</p>
                <p><span className="font-semibold">Canal:</span> {lead.channel}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-300 mb-3">Notas de la Llamada</h3>
              <p className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-slate-300 text-sm leading-relaxed">
                {lead.callNotes}
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-4 flex-wrap">
            {lead.excludeFromSequence && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-900/50 border border-yellow-700/50 text-yellow-300 font-semibold">
                🔔 Lead Respondió - Intervención Humana Requerida
              </span>
            )}

            {lead.step === 0 && (
              <button
                onClick={handleGenerateFollowups}
                disabled={generatingFollowups}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 font-semibold transition-all disabled:opacity-50"
              >
                {generatingFollowups ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Generando...
                  </>
                ) : (
                  "✨ Generar Seguimientos con IA"
                )}
              </button>
            )}

            {!lead.excludeFromSequence && (
              <button
                onClick={handleSimulateReply}
                disabled={simulatingReply}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 font-semibold transition-all disabled:opacity-50"
              >
                {simulatingReply ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Simulando...
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    ⚡ Simular Respuesta del Prospecto
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Replies */}
        {lead.replies.length > 0 && (
          <div className="bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">📬 Respuestas del Prospecto</h2>
            <div className="space-y-4">
              {lead.replies.map((reply) => (
                <div key={reply.id} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-300 mb-2">{reply.message}</p>
                  <p className="text-slate-500 text-sm">
                    {new Date(reply.createdAt).toLocaleString("es-AR")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Followups */}
        {lead.followups.length > 0 && (
          <div className="bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">📧 Seguimientos Generados</h2>
            <div className="space-y-6">
              {lead.followups.map((followup) => (
                <div key={followup.id} className="border border-slate-700/50 rounded-lg overflow-hidden">
                  <div className="bg-slate-800/50 p-4 border-b border-slate-700/50">
                    <h3 className="font-bold text-lg mb-1">
                      Paso {followup.step} - Día {(followup.step - 1) * 4 + 3}
                    </h3>
                    <p className="text-slate-400 text-sm">Asunto: {followup.subject}</p>
                  </div>

                  {/* Email Preview */}
                  <div className="p-4 border-b border-slate-700/50">
                    <h4 className="font-semibold text-slate-300 mb-3 flex justify-between items-center">
                      📧 Vista Email
                      <button
                        onClick={() => copyToClipboard(followup.emailBody, `email-${followup.id}`)}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
                      >
                        {copiedId === `email-${followup.id}` ? (
                          <>
                            <Check size={14} />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            Copiar
                          </>
                        )}
                      </button>
                    </h4>
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-700/50 text-slate-300 text-sm whitespace-pre-wrap">
                      {followup.emailBody}
                    </div>
                  </div>

                  {/* WhatsApp Preview */}
                  <div className="p-4">
                    <h4 className="font-semibold text-slate-300 mb-3 flex justify-between items-center">
                      💬 Vista WhatsApp
                      <button
                        onClick={() => copyToClipboard(followup.whatsappMessage, `wa-${followup.id}`)}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
                      >
                        {copiedId === `wa-${followup.id}` ? (
                          <>
                            <Check size={14} />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            Copiar
                          </>
                        )}
                      </button>
                    </h4>
                    <div className="bg-green-900/20 p-3 rounded border border-green-700/50 text-slate-300 text-sm whitespace-pre-wrap">
                      {followup.whatsappMessage}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {lead.followups.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p>No hay seguimientos generados aún. Genera los primeros con el botón de arriba.</p>
          </div>
        )}
      </div>
    </div>
  );
}
