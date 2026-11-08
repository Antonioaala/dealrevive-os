"use client";

import { useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import LeadTable from "./LeadTable";
import LeadForm from "./LeadForm";
import { Lead } from "@/types/lead";

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/leads");
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleLeadCreated = (newLead: Lead) => {
    setLeads([newLead, ...leads]);
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
              onClick={fetchLeads}
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

        {/* Form */}
        {showForm && (
          <LeadForm
            onLeadCreated={handleLeadCreated}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Table */}
        <div className="bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
          <LeadTable leads={leads} onLeadUpdated={(updated) => {
            setLeads(leads.map(l => l.id === updated.id ? updated : l));
          }} />
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
            <p className="text-slate-400 mt-2">Cargando tratos...</p>
          </div>
        )}

        {!loading && leads.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No hay tratos aún. ¡Crea uno nuevo!</p>
          </div>
        )}
      </div>
    </div>
  );
}
