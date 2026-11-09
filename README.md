# DealRevive OS - Sistema Inteligente de Seguimiento B2B

Revive tratos fríos con IA. Genera correos personalizados, envíalos automáticamente, y detén la secuencia cuando el cliente responda.

## Problema que Resuelve

- **IA escribe correos** personalizados en español, humanos
- **Envío automático** de seguimientos
- **Stop-on-Reply**: Detiene secuencia cuando cliente responde
- **Dashboard en tiempo real** con métricas de pipeline

## Tech Stack

- Next.js 16 + Supabase + Google Gemini + Resend
- 6 tratos de ejemplo (República Dominicana)
- Build: ✅ (sin errores con `npm run build`)

## Setup Rápido

### 1. Clona e instala
```bash
git clone https://github.com/Antonioaala/dealrevive-os.git
cd dealrevive-os
npm install
```

### 2. Configurar Supabase
1. Crea proyecto en supabase.com
2. Ejecuta SQL desde `supabase/schema.sql`
3. Desactiva RLS en `deals` y `emails`
4. Copia credenciales a `.env.local`

### 3. Configurar APIs
- **Google Gemini**: `GEMINI_API_KEY=...` (obtén en https://aistudio.google.com)
- **Resend**: `RESEND_API_KEY=re_...` + `DEMO_EMAIL=demo@example.com`
- **CRON_SECRET**: Genera token aleatorio

### 4. Variables de entorno (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
GEMINI_API_KEY=your-gemini-api-key
RESEND_API_KEY=re_...
DEMO_EMAIL=noreply@example.com
CRON_SECRET=secret-token
```

### 5. Ejecutar localmente
```bash
npm run dev
# http://localhost:3000
```

## Dashboard

- **Tabla**: 6 tratos (nombre, empresa, valor, paso, estado)
- **Métricas**: Activos, respondidos, valor pipeline, cerrados
- **Crear Trato**: Formulario para nuevos deals
- **Ver**: Abre línea de tiempo con emails

## Flujo Principal

1. **Dashboard carga tratos** desde Supabase
2. **Generar emails**: IA escribe, Resend envía a `DEMO_EMAIL`
3. **Seguimiento automático**: Paso 1→2→3→4 (después = perdido)
4. **Stop-on-Reply**: Cliente responde → estado = "respondio" → no más emails

## Endpoints API

- `GET /api/deals` - Todos los tratos
- `POST /api/deals` - Crear trato
- `GET /api/deals/[id]` - Trato + emails
- `PATCH /api/deals/[id]` - Actualizar trato
- `POST /api/followup/run` - Generar emails con IA
- `GET /api/cron/follow-up` - Para cron jobs externos
- `POST /api/deals/[id]/reply` - Simular respuesta (Stop-on-Reply)

## Deploy a Vercel

1. Push a GitHub (`main`)
2. Conecta repo en Vercel
3. Agrega 7 variables de entorno
4. Deploy

## Checklist (Prueba en Producción)

✅ Dashboard carga 6 tratos  
✅ Crear nuevo trato  
✅ Ver detalle → línea de tiempo  
✅ Generar email con IA → aparece en timeline  
✅ Simular respuesta → estado = "Respondido"  

---

**Next Steps**: Desplegar en Vercel con credenciales reales de Supabase/Gemini/Resend
