# Chat Drawer - Sistema de Mensajería y Adjuntos

## Descripción

El **ChatDrawer** es un componente de interfaz lateral (drawer) moderno y minimalista que proporciona una experiencia de chat intuitiva para la comunicación relacionada con las solicitudes de producción.

## Características Principales

### ✨ Diseño Moderno
- **Modal lateral deslizante** que se superpone al detalle de la solicitud
- **Overlay con blur** para enfocar la atención en el chat
- **Animaciones suaves** de entrada y salida
- **Diseño responsive** que se adapta a móviles

### 💬 Sistema de Mensajería
- **Vista de conversación** con mensajes organizados cronológicamente
- **Avatares de usuario** con gradientes personalizados
- **Timestamps inteligentes** (hoy, ayer, fecha completa)
- **Mensajes bidireccionales** (enviados/recibidos) con diferentes estilos
- **Estado vacío atractivo** cuando no hay mensajes

### 📎 Gestión de Adjuntos
- **Drag & Drop** para arrastrar y soltar archivos
- **Preview de imágenes** en línea
- **Preview de archivos** con iconos y tamaño
- **Descarga directa** de archivos adjuntos
- **Múltiples archivos** en un solo mensaje
- **Eliminación de adjuntos** antes de enviar

### 🎨 Experiencia de Usuario
- **Input intuitivo** con botones de adjuntar y enviar
- **Scroll automático** al último mensaje
- **Indicador de archivos adjuntos** en cola
- **Deshabilitación inteligente** del botón enviar cuando no hay contenido
- **Enter para enviar** (Shift+Enter para nueva línea)

## Integración

### En SolicitudDetail.jsx

```jsx
import ChatDrawer from "./ChatDrawer";

// Estado
const [chatOpen, setChatOpen] = useState(false);

// Handler para enviar mensajes
const handleSendMessage = async (data) => {
    // Lógica de envío con FormData
};

// Botón para abrir el chat
<button onClick={() => setChatOpen(true)}>
    <MdChat />
    <span>Abrir Chat</span>
    {requerimiento.adjuntRequireds?.length > 0 && (
        <span className="badge">{requerimiento.adjuntRequireds.length}</span>
    )}
</button>

// Componente ChatDrawer
<ChatDrawer 
    isOpen={chatOpen}
    onClose={() => setChatOpen(false)}
    requerimiento={requerimiento}
    onSendMessage={handleSendMessage}
/>
```

## Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `isOpen` | boolean | Controla la visibilidad del drawer |
| `onClose` | function | Callback para cerrar el drawer |
| `requerimiento` | object | Objeto con los datos de la solicitud |
| `onSendMessage` | function | Callback para enviar mensajes y adjuntos |

## Estructura de Datos

### onSendMessage callback recibe:

```javascript
{
    message: string,      // Texto del mensaje
    attachments: File[]   // Array de archivos File
}
```

### requerimiento.adjuntRequireds formato esperado:

```javascript
[
    {
        user: {
            id: number,
            name: string,
            lastName: string
        },
        message: string,
        createdAt: string (ISO date),
        attachments: [
            {
                name: string,
                url: string,
                size: number,
                type: string (mime type)
            }
        ]
    }
]
```

## Estilos

Los estilos están definidos en `styles.less` bajo la clase `.chat-drawer` e incluyen:

- Variables de color consistentes con el sistema de diseño
- Animaciones y transiciones suaves
- Responsive design para mobile
- Estados hover y active
- Sistema de grid flexible

## Funcionalidades Técnicas

### Gestión de Archivos
- Preview de imágenes usando `URL.createObjectURL()`
- Limpieza automática de URLs de objetos al eliminar
- Formateo de tamaño de archivos (Bytes, KB, MB, GB)
- Identificación de tipos de archivo por MIME type

### Fechas Inteligentes
- Usa `dayjs` para formateo de fechas
- Muestra "HH:mm" si es hoy
- Muestra "Ayer HH:mm" si fue ayer
- Muestra día de la semana si fue esta semana
- Muestra fecha completa para mensajes antiguos

### Performance
- Scroll automático solo cuando el drawer está abierto
- Refs para manipulación directa del DOM
- Cleanup de previews de imágenes para evitar memory leaks

## Mejoras Futuras Potenciales

- [ ] Soporte para markdown en mensajes
- [ ] Emojis picker
- [ ] Indicador de "escribiendo..."
- [ ] Notificaciones de nuevos mensajes
- [ ] Búsqueda en mensajes
- [ ] Reacciones a mensajes
- [ ] Edición de mensajes enviados
- [ ] Mensajes de voz
- [ ] Compresión de imágenes antes de enviar

## Notas de Diseño

El diseño sigue los principios de:
- **Minimalismo**: Solo elementos esenciales
- **Claridad**: Jerarquía visual clara
- **Consistencia**: Mismo lenguaje de diseño que el resto de la app
- **Accesibilidad**: Contraste y tamaños adecuados
- **Modernidad**: Gradientes, sombras suaves, animaciones fluidas
