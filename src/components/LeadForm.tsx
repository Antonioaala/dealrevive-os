"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface LeadFormProps {
  onLeadCreated: (lead: any) => void;
  onCancel: () => void;
}

export default function LeadForm({ onLeadCreated, onCancel }: LeadFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    quoteAmount: "",
    channel: "Email",
    callNotes: "",
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

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newLead = await response.json();
        onLeadCreated(newLead);
      }
    } catch (error) {
      console.error("Failed to create lead:", error);
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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Nombre del Lead
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
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
            Teléfono
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-50 transition-colors"
            placeholder="+54 9 11 1234-5678"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Empresa
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-50 transition-colors"
            placeholder="Constructora XYZ"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Presupuesto ($)
          </label>
          <input
            type="number"
            name="quoteAmount"
            value={formData.quoteAmount}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-50 transition-colors"
            placeholder="50000"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Canal
          </label>
          <select
            name="channel"
            value={formData.channel}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-50 transition-colors"
          >
            <option>Email</option>
            <option>WhatsApp</option>
            <option>Phone</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Notas de la Llamada / Requisición
          </label>
          <textarea
            name="callNotes"
            value={formData.callNotes}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-50 transition-colors resize-none"
            placeholder="Detalles técnicos, restricciones presupuestarias, timeline..."
          />
        </div>

        <div className="md:col-span-2 flex gap-4">
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
            className="flex-1 px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 font-semibold transition-all"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
