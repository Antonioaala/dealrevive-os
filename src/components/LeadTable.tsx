"use client";

import { useState } from "react";
import { Eye, Zap } from "lucide-react";
import Link from "next/link";
import { Deal } from "@/types/deal";

interface LeadTableProps {
  deals: Deal[];
  onDealUpdated: (deal: Deal) => void;
}

export default function LeadTable({ deals, onDealUpdated }: LeadTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "activo":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-emerald-900/50 text-emerald-300 border border-emerald-700/50">
            🟢 Activo
          </span>
        );
      case "respondio":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-blue-900/50 text-blue-300 border border-blue-700/50">
            ✅ Respondido
          </span>
        );
      case "cerrado":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-purple-900/50 text-purple-300 border border-purple-700/50">
            🏆 Cerrado
          </span>
        );
      case "perdido":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-red-900/50 text-red-300 border border-red-700/50">
            ❌ Perdido
          </span>
        );
      default:
        return null;
    }
  };

  const getStepBadge = (paso: number) => {
    const steps = ["📋 Inicial", "📧 Paso 1", "📊 Paso 2", "🎯 Paso 3", "🔄 Paso 4"];
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-slate-700/50 text-slate-300 border border-slate-600/50">
        {steps[paso] || steps[0]}
      </span>
    );
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
              Valor
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
          {deals.map((deal) => (
            <tr
              key={deal.id}
              className="border-b border-slate-700/30 hover:bg-slate-800/20 transition-colors"
            >
              <td className="px-6 py-4 text-sm font-medium">{deal.nombre}</td>
              <td className="px-6 py-4 text-sm text-slate-400">{deal.empresa}</td>
              <td className="px-6 py-4 text-sm font-semibold text-emerald-400">
                ${deal.valor.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm">{getStepBadge(deal.paso)}</td>
              <td className="px-6 py-4 text-sm">{getStatusBadge(deal.estado)}</td>
              <td className="px-6 py-4 text-sm flex gap-2">
                <Link
                  href={`/deals/${deal.id}`}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 transition-colors text-xs"
                >
                  <Eye size={14} />
                  Ver
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
