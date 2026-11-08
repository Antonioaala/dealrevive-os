"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Deal } from "@/types/deal";

interface LeadFormProps {
  onLeadCreated: (deal: Deal) => void;
  onCancel: () => void;
}

export default function LeadForm({ onLeadCreated, onCancel }: LeadFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    empresa: "",
    valor: "",
    contexto: "",
    razon_enfriamiento: "Contacto nuevo",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al crear trato");
      }

      const newDeal = await response.json();
      onLeadCreated(newDeal);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
      console.error("Failed to create deal:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Crear Nuevo Trato</h2>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Nombre
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-50 transition-colors"
            placeholder="Juan Pérez"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-50 transition-colors"
            placeholder="juan@empresa.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Empresa
          </label>
          <input
            type="text"
            name="empresa"
            value={formData.empresa}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-50 transition-colors"
            placeholder="Empresa X"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Valor ($)
          </label>
          <input
            type="number"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            required
            step="1000"
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-50 transition-colors"
            placeholder="50000"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Contexto (qué necesita)
          </label>
          <textarea
            name="contexto"
            value={formData.contexto}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-50 transition-colors resize-none"
            placeholder="Describe el negocio y la solución que necesita..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Razón del enfriamiento
          </label>
          <textarea
            name="razon_enfriamiento"
            value={formData.razon_enfriamiento}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-50 transition-colors resize-none"
            placeholder="Por qué pasó? No respondió, cambio de persona, etc"
          />
        </div>

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 font-semibold transition-all disabled:opacity-50"
          >
            {loading ? "Creando..." : "Crear Trato"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 font-semibold transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
