export interface Deal {
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
  emails?: Email[];
}

export interface Email {
  id: string;
  deal_id: string;
  direccion: "enviado" | "recibido";
  asunto: string | null;
  cuerpo: string;
  paso: number | null;
  creado_en: string;
}
