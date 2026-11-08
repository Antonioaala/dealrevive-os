"use client";

import { useEffect, useState } from "react";
import { Plus, RefreshCw, AlertCircle } from "lucide-react";
import LeadTable from "./LeadTable";
import LeadForm from "./LeadForm";
import { Deal } from "@/types/deal";

export default function Dashboard() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchDeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/deals");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setDeals(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(`Fallo al cargar tratos: ${msg}`);
      console.error("Failed to fetch deals:", err);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleDealCreated = (newDeal: Deal) => {
    setDeals([newDeal, ...deals]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-850 text-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              DealRevive OS
            </h1>
            <p className="text-slate-400">
              Sistema inteligente de seguimiento B2B con IA y Stop-on-Reply
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={fetchDeals}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all hover:bg-slate-700"
            >
              <RefreshCw size={18} />
              Actualizar
            </button>

            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 font-semibold transition-all shadow-lg"
            >
              <Plus size={20} />
              Nuevo Trato
            </button>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Tratos Activos</p>
            <p className="text-2xl font-bold text-emerald-400">
              {deals.filter(d => d.estado === 'activo').length}
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Respondidos</p>
            <p className="text-2xl font-bold text-blue-400">
              {deals.filter(d => d.estado === 'respondio').length}
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Valor Pipeline</p>
            <p className="text-2xl font-bold text-cyan-400">
              ${deals.filter(d => d.estado === 'activo').reduce((s, d) => s + d.valor, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Cerrados</p>
            <p className="text-2xl font-bold text-purple-400">
              ${deals.filter(d => d.estado === 'cerrado').reduce((s, d) => s + d.valor, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/30 border border-red-700/50 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-red-300 font-semibold">Error de conexión</p>
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <LeadForm
            onLeadCreated={handleDealCreated}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
            <LeadTable deals={deals} onDealUpdated={(updated) => {
              setDeals(deals.map(d => d.id === updated.id ? updated : d));
            }} />
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
            <p className="text-slate-400 mt-2">Cargando tratos...</p>
          </div>
        )}

        {!loading && !error && deals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No hay tratos aún. ¡Crea uno nuevo!</p>
          </div>
        )}
      </div>
    </div>
  );
}
