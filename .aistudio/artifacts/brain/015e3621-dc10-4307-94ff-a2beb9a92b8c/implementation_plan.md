# Sincronización Automática Continua con Google Sheets y Google Drive

Arquitectura para automatizar el almacenamiento en la nube de los registros y certificados de los aprendices del SENA en Google Sheets sin requerir confirmaciones manuales ni interrupciones durante el flujo formativo.

### User Review & Critical Decisions

> [!IMPORTANT]
> **Decisiones Confirmadas y Parámetros del Flujo Automático:**
> - **Momento de activación**: La sincronización se activará automáticamente al **aprobar la Evaluación Final y emitirse el Certificado Oficial**.
> - **Experiencia del usuario (Zero-Friction)**: Se elimina la necesidad de presionar botones manuales como "Registrar en Google Sheets" o confirmar modales repetitivos. El aprendiz aprueba el examen y el prototipo guarda el registro de inmediato en segundo plano.
> - **Feedback visual sutil**: Una notificación emergente (*Toast*) no intrusiva en la esquina inferior derecha confirmará: *"Registro oficial sincronizado automáticamente en Google Sheets"*.
> - **Resiliencia y Modo Offline**: Si no hay conexión a internet al momento de la aprobación, el registro se almacena en una cola local (*Sync Queue*) y se sincroniza en cuanto se restablece la conectividad.

---

### 1. Overview & Core Concept

- **Qué hace**: Automatiza al 100% el envío de datos de los aprendices (nombre, documento, ficha, programa, calificación y código de verificación) a la hoja de cálculo oficial de Google Drive (`SENA - Registro Oficial de Aprendices e Inducción`).
- **Público objetivo**: Aprendices del SENA que completan su inducción y el equipo de instructores y coordinadores que auditan los resultados en tiempo real en la nube.
- **Valor clave**: Elimina fricción humana, evita pérdida de registros por olvido de guardado y mantiene la base de datos institucional en Google Sheets actualizada de forma desatendida.

---

### 2. User Experience & Visual Design

- **Flujo de Usuario Automatizado**:
  1. El aprendiz completa las estaciones y realiza la Evaluación Final (Acuerdo 0009 de 2024).
  2. Al obtener 80% o más y hacer clic en *"Ver Certificado Oficial"*, el sistema dispara la sincronización silenciosa en segundo plano.
  3. En pantalla aparece una notificación sutil tipo *Toast* con icono de Google Sheets y check institucional verde SENA: *"Sincronizado con Google Drive (Fila #X)"*.
  4. La pestaña "Google Sheets" se mantiene disponible como panel de auditoría en vivo para que instructores y aprendices puedan consultar la tabla y abrir el enlace directo a la hoja con 1 clic.

- **Diseño del Notificador Automático (Toast)**:
  - Posicionamiento flotante inferior derecho con animación de entrada suave.
  - Insignia de Google Drive/Sheets con enlace directo para inspeccionar la hoja.
  - Compatibilidad total con el tema claro y el modo oscuro con efecto de desenfoque (*glassmorphism*).

---

### 3. Key Product Decisions & Trade-Offs

- **Disparo en Segundo Plano vs. Confirmación Modal**:
  - *Enfoque*: Ejecución en segundo plano sin modal de bloqueo al completar la inducción.
  - *Por qué*: Cumple con el requerimiento del usuario de automatización total sin tener que tocar la configuración manualmente.
  - *Alternativa descartada*: Modal de confirmación en cada guardado (generaba fricción innecesaria y requería clics manuales repetitivos).

- **Gestión de Sesión y Token en Memoria**:
  - *Enfoque*: Detección de sesión activa de Google y token en memoria mediante Firebase Auth.
  - *Por qué*: Cumple con las directrices de seguridad de Workspace APIs (sin tokens en almacenamiento persistente no seguro).

- **Cola de Sincronización Local (Offline Queue)**:
  - *Enfoque*: Almacén local en `localStorage` con reintentos exponenciales automáticos ante caídas de red.
  - *Por qué*: Garantiza que ningún aprendiz certificado quede sin registrar si la conexión falla momentáneamente.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                      SENA INDUCCIÓN DIGITAL                     │
│                                                                 │
│  ┌──────────────────────┐         ┌──────────────────────────┐  │
│  │   Evaluación Final   │ ──────> │  Certificado Oficial     │  │
│  │  (Aprobación >= 80%) │         │  (Generación de Serial)  │  │
│  └──────────────────────┘         └─────────────┬────────────┘  │
│                                                 │               │
│                                      [Auto-Trigger Silencioso]  │
│                                                 ▼               │
│                                   ┌──────────────────────────┐  │
│                                   │   Sync Engine Service    │  │
│                                   │ (services/autoSyncEngine)│  │
│                                   └─────────────┬────────────┘  │
│                                                 │               │
│                  ┌──────────────────────────────┴────────────┐  │
│                  ▼                                           ▼  │
│     ┌────────────────────────┐                 ┌───────────────────────┐│
│     │  Google Sheets API v4  │                 │ Offline Sync Queue    ││
│     │ (Append Row en Drive)  │                 │ (Almacenamiento Local)││
│     └────────────┬───────────┘                 └─────────────┬─────────┘│
│                  │                                           │          │
│                  ▼                                           │ (Auto-   │
│     ┌────────────────────────┐                               │  Retry)  │
│     │  Google Drive Sheet:   │ <─────────────────────────────┘          │
│     │  "Registro Oficial"    │                                          │
│     └────────────────────────┘                                          │
└─────────────────────────────────────────────────────────────────┘
```

- **Entidades de Datos y Payload**:
  - `Marca Temporal`, `Nombre del Aprendiz`, `Tipo y Documento`, `Ficha`, `Programa`, `Regional`, `Centro`, `Calificación (%)`, `Estado (APROBADO)`, `Serial Verificación`, `Fecha de Emisión`.
- **Componentes a Implementar / Ajustar**:
  1. `src/services/autoSyncEngine.ts`: Orquestador de sincronización en segundo plano con detector de estado de red, gestión de cola y llamada a la API de Google Sheets.
  2. `src/components/SyncNotificationToast.tsx`: Componente de alerta sutil tipo Toast no bloqueante.
  3. `src/App.tsx`: Conexión del disparador automático en el flujo de aprobación del examen y actualización de datos del aprendiz.
