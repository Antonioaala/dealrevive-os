import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

let supabase: ReturnType<typeof createClient> | null = null;

// Only create client if:
// 1. Both URL and key exist
// 2. URL contains 'supabase.co' (not placeholder)
// 3. URL doesn't start with placeholder patterns
const isPlaceholder =
  !supabaseUrl ||
  supabaseUrl.includes("your-project") ||
  supabaseUrl.includes("example") ||
  !supabaseUrl.includes("supabase.co");

if (!isPlaceholder && serviceRoleKey && !serviceRoleKey.includes("your-")) {
  try {
    supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
      },
    });
  } catch (error) {
    // Gracefully handle any Supabase initialization errors
    console.debug("Supabase initialization error (expected in build):", error);
  }
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
