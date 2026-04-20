# 🗺️ Mapa de Navegación y Flujos de Usuario

## Estructura Visual de la Nueva Versión

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SOLICITUDES DE PRODUCCIÓN                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  📊 Estadísticas                                             │   │
│  │  [🟡 Pendientes: 5] [🔵 En Progreso: 3] [🟢 Completadas: 12]│   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  🔍 [Buscar por nombre, descripción, usuario o ID...]  [X]  │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📱 Vista Principal - Grid de Solicitudes

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │
│  │ Kit XYZ         │  │ Producto ABC    │  │ Kit DEF         │      │
│  │ [🟡 Pendiente]  │  │ [🔵 En Progreso]│  │ [🟢 Completada] │      │
│  │                 │  │                 │  │                 │      │
│  │ Descripción...  │  │ Descripción...  │  │ Descripción...  │      │
│  │                 │  │                 │  │                 │      │
│  │ 👤 Juan Pérez   │  │ 👤 Ana García   │  │ 👤 Luis Mora    │      │
│  │ 📅 Hace 2 días  │  │ 📅 Ayer         │  │ 📅 Hoy          │      │
│  │                 │  │                 │  │                 │      │
│  │ Progreso: 30%   │  │ Progreso: 70%   │  │ Progreso: 100%  │      │
│  │ [███░░░░░░]     │  │ [███████░░]     │  │ [██████████]    │      │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘      │
│                                                                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │
│  │ ...más cards    │  │ ...más cards    │  │ ...más cards    │      │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘      │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Flujo de Búsqueda

```
USUARIO ESCRIBE → Filtrado en Tiempo Real → Resultados Actualizados

Ejemplo:
1. Usuario escribe: "Kit"
   ↓
2. Se filtran solo solicitudes que contienen "Kit"
   ↓
3. Grid se actualiza instantáneamente
   ↓
4. Si no hay resultados:
   
   ┌────────────────────────────────┐
   │                                │
   │       🔍                       │
   │                                │
   │   No se encontraron resultados │
   │                                │
   │   Intenta con otros términos   │
   │                                │
   └────────────────────────────────┘
```

---

## 👆 Flujo de Interacción - Click en Card

```
[CARD] ──(Click)──> [PANEL DE DETALLES SE ABRE]
  │                          │
  │                          ├─ Animación suave
  │                          ├─ Card se marca con borde azul
  │                          └─ Se carga información completa
  │
  └─ Card permanece visible en el grid
```

### Vista con Panel Abierto:

```
┌──────────────────────────────────────────────┬────────────────────────┐
│  GRID DE CARDS                               │  PANEL DE DETALLES    │
│                                              │                        │
│  ┌─────────────────┐                        │  [X] Cerrar            │
│  │ Kit XYZ  🔵     │ ← SELECCIONADA         │  ═══════════════       │
│  │ [BORDE AZUL]    │                        │  🔵 En Progreso        │
│  │ Progreso: 30%   │                        │                        │
│  └─────────────────┘                        │  Kit XYZ               │
│                                              │                        │
│  ┌─────────────────┐                        │  👤 Juan Pérez         │
│  │ Producto ABC    │                        │  📅 09 de Abril 2026   │
│  │ Progreso: 70%   │                        │  📦 Kit                │
│  └─────────────────┘                        │                        │
│                                              │  Progreso: 30%         │
│  ┌─────────────────┐                        │  [███░░░░░░░░]        │
│  │ Kit DEF         │                        │                        │
│  │ Progreso: 100%  │                        │  ──────────────        │
│  └─────────────────┘                        │  📝 Descripción        │
│                                              │  Detalles aquí...      │
│                                              │                        │
│                                              │  ──────────────        │
│                                              │  🔧 Acciones           │
│                                              │  [Crear Kit]           │
│                                              │                        │
│                                              │  ──────────────        │
│                                              │  📎 Mensajes           │
│                                              │  - Mensaje 1           │
│                                              │  - Mensaje 2           │
│                                              │  [+ Añadir]            │
│                                              │                        │
└──────────────────────────────────────────────┴────────────────────────┘
```

---

## 📊 Estados y Transiciones

```
┌─────────────┐
│  PENDIENTE  │ (No leída, 0%)
│     🟡      │
└──────┬──────┘
       │ Usuario de producción abre
       │ (Se marca como leída automáticamente)
       ↓
┌─────────────┐
│ EN PROGRESO │ (Leída, 30%)
│     🔵      │
└──────┬──────┘
       │ Usuario crea el kit
       │ (state = 'creando')
       ↓
┌─────────────┐
│ EN CREACIÓN │ (Creando kit, 70%)
│     🔵      │
└──────┬──────┘
       │ Kit creado exitosamente
       │ (state = 'finish')
       ↓
┌─────────────┐
│ COMPLETADA  │ (Finalizada, 100%)
│     🟢      │
└─────────────┘
```

---

## 🎨 Sistema de Colores y Badges

```
ESTADO          COLOR         BACKGROUND        ICONO
─────────────────────────────────────────────────────
Pendiente       #92400e       #fef3c7           ⏰
En Progreso     #1e40af       #dbeafe           👁️
En Creación     #1e40af       #dbeafe           👁️
Completada      #065f46       #d1fae5           ✓
```

---

## 📱 Responsive Breakpoints

### Desktop (>1200px)
```
┌─────────────────────────────────────────────────────┐
│  [Card] [Card] [Card] [Card]                        │
│  [Card] [Card] [Card] [Card]                        │
└─────────────────────────────────────────────────────┘
Grid de 3-4 columnas + Panel lateral
```

### Tablet (768-1200px)
```
┌─────────────────────────────────┐
│  [Card] [Card] [Card]           │
│  [Card] [Card] [Card]           │
└─────────────────────────────────┘
Grid de 2-3 columnas + Panel más estrecho
```

### Mobile (<768px)
```
┌─────────────────┐
│  [Card]         │
│  [Card]         │
│  [Card]         │
└─────────────────┘

Al abrir detalles:
┌─────────────────┐
│  [X]            │
│  Panel Full     │
│  Screen         │
│                 │
│  (Cubre todo)   │
│                 │
└─────────────────┘
```

---

## 🔄 Flujo Completo de Creación de Kit

```
1. Usuario busca solicitud
   │
   ↓
2. Click en la card deseada
   │
   ↓
3. Se abre panel de detalles
   │
   ↓
4. Sistema marca como "leída" (automático)
   │
   ↓
5. Usuario revisa información
   │
   ↓
6. Click en botón "Crear Kit"
   │
   ↓
7. Se muestra formulario de creación
   │
   ↓
8. Usuario completa datos y guarda
   │
   ↓
9. Kit se crea en el sistema
   │
   ↓
10. Estado cambia a "Completada"
    │
    ↓
11. Se muestra información del kit creado
    │
    ↓
12. ✓ Proceso finalizado
```

---

## 🎯 Puntos de Interacción

```
┌────────────────────────────────────────┐
│  1. HEADER SEARCH BAR                  │
│     - Input de texto                   │
│     - Botón X para limpiar             │
│                                        │
│  2. STAT CHIPS                         │
│     - Solo visuales (no clickeables)   │
│                                        │
│  3. CARDS                              │
│     - Hover: Elevación                 │
│     - Click: Abre detalles             │
│                                        │
│  4. PANEL DE DETALLES                  │
│     - Botón X: Cierra panel            │
│     - Botón "Crear Kit": Abre form     │
│     - Botón "+ Añadir": Abre form msg  │
│                                        │
└────────────────────────────────────────┘
```

---

## ⚡ Animaciones y Transiciones

```
EVENTO                  ANIMACIÓN                    DURACIÓN
────────────────────────────────────────────────────────────
Card Hover              Transform Y(-4px) + Shadow   0.2s
Card Click              Border Color Change          0.2s
Panel Open              Slide In from Right          0.3s
Panel Close             Slide Out to Right           0.3s
Search Results          Fade In + Translate Y        0.3s
Progress Bar Fill       Width Transition             0.3s
Button Hover            Scale + Shadow               0.2s
Loading Spinner         Rotate 360deg                1s (loop)
```

---

## 🎓 Guía Visual Rápida

### Para encontrar una solicitud:
```
🔍 Usa el buscador → Escribe nombre/ID → Click en la card → ✓ Listo
```

### Para crear un kit:
```
🔍 Busca solicitud → Click en card → Botón "Crear Kit" → Completa form → ✓ Listo
```

### Para añadir un mensaje:
```
🔍 Busca solicitud → Click en card → Scroll abajo → Botón "+ Añadir" → ✓ Listo
```

### Para cerrar detalles:
```
Click en [X] en la esquina superior derecha del panel → ✓ Listo
```

---

## 📐 Especificaciones de Diseño

### Espaciados
```
xs:  8px   - Gaps pequeños
sm:  12px  - Gaps medianos
md:  16px  - Padding estándar
lg:  24px  - Secciones grandes
xl:  32px  - Márgenes principales
```

### Bordes
```
Cards:        12px - Border radius
Buttons:      8px  - Border radius
Inputs:       12px - Border radius
Panel:        16px - Border radius (top corners)
```

### Tipografía
```
H1:        28px / Bold   - Título principal
H2:        24px / Bold   - Título panel
H3:        18px / Bold   - Título card
Body:      14px / Normal - Texto general
Caption:   12px / Medium - Metadatos
```

---

## 🚀 Performance

### Carga Inicial
```
1. Fetch solicitudes    ≈ 200-500ms
2. Render grid          ≈ 50-100ms
3. Total perceived      ≈ 300-600ms
```

### Búsqueda
```
1. Input change         ≈ 0ms
2. Filter array         ≈ 1-10ms
3. Re-render            ≈ 20-50ms
4. Total perceived      ≈ 50ms (instantáneo)
```

### Abrir Detalles
```
1. Click event          ≈ 0ms
2. Fetch detalles       ≈ 100-300ms
3. Open animation       ≈ 300ms
4. Total perceived      ≈ 400-600ms
```

---

## ✨ Conclusión

El nuevo diseño prioriza:

1. **Velocidad** - Búsqueda instantánea
2. **Claridad** - Estados visuales obvios
3. **Eficiencia** - Menos clicks, más información
4. **Modernidad** - UI actualizada y atractiva
5. **Adaptabilidad** - Funciona en todos los dispositivos

---

**Este mapa sirve como referencia visual para entender la estructura y flujos de la nueva versión.**
