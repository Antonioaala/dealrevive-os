"use client";

import { useState } from "react";
import { ExternalLink, Zap } from "lucide-react";
import Link from "next/link";
import { Lead } from "@/types/lead";

interface LeadTableProps {
  leads: Lead[];
  onLeadUpdated: (lead: Lead) => void;
}

export default function LeadTable({ leads, onLeadUpdated }: LeadTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const getStatusBadge = (status: string, excludeFromSequence: boolean) => {
    if (excludeFromSequence) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-yellow-900/50 text-yellow-300 border border-yellow-700/50">
          🔔 Respondió
        </span>
      );
    }

    switch (status) {
      case "Activo":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-emerald-900/50 text-emerald-300 border border-emerald-700/50">
            🟢 Activo
          </span>
        );
      case "Respondido":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-blue-900/50 text-blue-300 border border-blue-700/50">
            ✅ Respondido
          </span>
        );
      case "Cerrado":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-purple-900/50 text-purple-300 border border-purple-700/50">
            🏆 Cerrado
          </span>
        );
      default:
        return null;
    }
  };

  const getStepBadge = (step: number) => {
    const steps = ["📋 Inicial", "📧 Paso 1", "📊 Paso 2", "🎯 Paso 3"];
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-slate-700/50 text-slate-300 border border-slate-600/50">
        {steps[step] || steps[0]}
      </span>
    );
  };

  const handleSimulateReply = async (leadId: string) => {
    setLoadingId(leadId);
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
        const updated = await response.json();
        onLeadUpdated(updated.lead);
      }
    } catch (error) {
      console.error("Failed to simulate reply:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700/50">
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Nombre
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Empresa
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Presupuesto
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Canal
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Paso
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Estado
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className="border-b border-slate-700/30 hover:bg-slate-800/20 transition-colors"
            >
              <td className="px-6 py-4 text-sm">{lead.name}</td>
              <td className="px-6 py-4 text-sm text-slate-400">{lead.company}</td>
              <td className="px-6 py-4 text-sm font-semibold text-emerald-400">
                ${lead.quoteAmount.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm">
                <span className="px-2 py-1 rounded bg-slate-700/50 text-slate-300 text-xs">
                  {lead.channel}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">{getStepBadge(lead.step)}</td>
              <td className="px-6 py-4 text-sm">
                {getStatusBadge(lead.status, lead.excludeFromSequence)}
              </td>
              <td className="px-6 py-4 text-sm flex gap-2">
                <Link
                  href={`/leads/${lead.id}`}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 transition-colors text-xs"
                >
                  <ExternalLink size={14} />
                  Ver
                </Link>

                {!lead.excludeFromSequence && (
                  <button
                    onClick={() => handleSimulateReply(lead.id)}
                    disabled={loadingId === lead.id}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded bg-yellow-900/50 hover:bg-yellow-800/50 text-yellow-300 transition-colors text-xs disabled:opacity-50"
                  >
                    <Zap size={14} />
                    {loadingId === lead.id ? "..." : "Simular"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
