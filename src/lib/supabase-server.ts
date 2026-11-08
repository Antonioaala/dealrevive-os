import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && serviceRoleKey) {
  supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}

export { supabase };

export type Deal = {
  id: string;
  nombre: string;
  empresa: string;
  email: string;
  valor: number;
  contexto: string;
  razon_enfriamiento: string;
  paso: number;
  estado: "activo" | "respondio" | "cerrado" | "perdido";
  ultimo_contacto: string | null;
  creado_en: string;
};

export type Email = {
  id: string;
  deal_id: string;
  direccion: "enviado" | "recibido";
  asunto: string | null;
  cuerpo: string;
  paso: number | null;
  creado_en: string;
};
