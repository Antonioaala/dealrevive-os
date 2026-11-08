-- DealRevive OS - Supabase Schema
-- Ejecutar este SQL en https://supabase.com/dashboard

-- Tabla deals
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  empresa TEXT NOT NULL,
  email TEXT NOT NULL,
  valor NUMERIC(15, 2) NOT NULL,
  contexto TEXT NOT NULL,
  razon_enfriamiento TEXT NOT NULL,
  paso INT DEFAULT 0,
  estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'respondio', 'cerrado', 'perdido')),
  ultimo_contacto TIMESTAMPTZ,
  creado_en TIMESTAMPTZ DEFAULT now()
);

-- Tabla emails
CREATE TABLE IF NOT EXISTS emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  direccion TEXT NOT NULL CHECK (direccion IN ('enviado', 'recibido')),
  asunto TEXT,
  cuerpo TEXT NOT NULL,
  paso INT,
  creado_en TIMESTAMPTZ DEFAULT now()
);

-- Desactivar RLS (es una demo)
ALTER TABLE deals DISABLE ROW LEVEL SECURITY;
ALTER TABLE emails DISABLE ROW LEVEL SECURITY;

-- Índices para performance
CREATE INDEX idx_deals_estado ON deals(estado);
CREATE INDEX idx_deals_paso ON deals(paso);
CREATE INDEX idx_emails_deal_id ON emails(deal_id);

-- Datos de ejemplo: 6 tratos de RD
INSERT INTO deals (nombre, empresa, email, valor, contexto, razon_enfriamiento, estado, paso, ultimo_contacto, creado_en) VALUES
(
  'Carlos Mendez',
  'Distribuidora Global RD',
  'carlos@distribuidoraglobal.com',
  125000.00,
  'Gerente de Operaciones. Contacto en agosto 2024. Necesita solución de logística para 8 bodegas en el país. Presupuesto aprobado. Decision maker: el CEO (disponible martes). Problema crítico: pérdida de 15% en trazabilidad de inventario.',
  'No contactó en 60 días. Último correo sobre case study de Logitec fue abierto pero sin respuesta.',
  'activo',
  0,
  '2024-08-15',
  now() - interval '90 days'
),
(
  'María Santos',
  'Clínica Integral de Salud',
  'maria@clinicaintegral.do',
  85000.00,
  'Directora de TI. Junio 2024. Sistema de gestión de pacientes en la nube. Cumplimiento HIPAA + GDPR. 500 pacientes/día. Migración data: 200GB. Presupuesto confirmado pero timeline flexible.',
  'Respuesta "Ahora no, estamos en auditoría" en julio. Silencio desde entonces.',
  'activo',
  0,
  '2024-07-22',
  now() - interval '105 days'
),
(
  'Roberto Fernández',
  'Inmobiliaria San Jorge',
  'roberto@sanitorge.com',
  200000.00,
  'Director Comercial. Septiembre 2024. Plataforma CRM + portal de ventas para 40 agentes inmobiliarios. Proyectos mensuales: $4.2M. Integración con MLS + WhatsApp Business. Contrato potencial: 24 meses.',
  'Propuesta enviada, se perdió en cambio de personal. Nuevo contact person desde hace 2 semanas.',
  'activo',
  0,
  '2024-09-10',
  now() - interval '45 days'
),
(
  'Alejandra Gomez',
  'Logística Caribeña Express',
  'alejandra@logisticacaribena.com',
  160000.00,
  'Jefa de Operaciones. Mayo 2024. 15 vehículos, 45 drivers, despachos diarios a Haiti/Islas. Solución offline-first crítica (conectividad 60% del tiempo). Mobile app + Dashboard. Implementación: 60 días máximo.',
  'Jefe anterior canceló proyecto por presupuesto. Recomendación interna positiva pero sin presupuesto nuevo aprobado.',
  'activo',
  0,
  '2024-05-28',
  now() - interval '160 days'
),
(
  'Fernando Tejada',
  'Grupo Tejada Construcciones',
  'fernando@gruopotejada.com',
  310000.00,
  'Director General. Octubre 2024. 25 proyectos simultáneos. Gestión de materiales, permisos, nómina en campo. 300+ trabajadores. Presupuesto anual fijo: $2.1M. Única limitación: implementación antes de Q1 2025.',
  'Evaluando 3 competidores. Nuestra demo impresionó pero no hay feedback formal desde octubre.',
  'activo',
  0,
  '2024-10-08',
  now() - interval '30 days'
),
(
  'Patricia Rosario',
  'Farmacias RD Plus',
  'patricia@farmaciasrdplus.com',
  95000.00,
  'Gerente de Sistemas. Abril 2024. 32 sucursales, 800K SKUs, venta receta+OTC. Inventario real-time + Control de vencimientos. Compatibilidad con DGII para facturación. Staff: 15 personas capacitables.',
  'Director de TI salió de la empresa. Nueva persona (Patricia) no heredó el proyecto. Interés renovado pero necesita contexto.',
  'activo',
  0,
  '2024-04-12',
  now() - interval '210 days'
);
