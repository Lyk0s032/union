# Sistema de Notificaciones Premium tipo WhatsApp Web

Este sistema de notificaciones ha sido diseñado para proporcionar una experiencia premium similar a WhatsApp Web, con notificaciones flotantes elegantes y una campana de notificaciones completamente funcional.

## 🚀 Características

- ✅ **Notificaciones flotantes tipo WhatsApp**: Diseño limpio con animaciones suaves
- ✅ **Línea de acento verde**: Indicador visual premium estilo WhatsApp (#25D366)
- ✅ **Detección automática de pestaña activa/inactiva**: Muestra notificaciones flotantes cuando estás activo, nativas cuando estás en segundo plano
- ✅ **Web Notification API**: Notificaciones nativas del sistema operativo
- ✅ **Campana con contador**: Indica notificaciones no vistas con badge
- ✅ **Estados seen/read**: Diferencia entre notificaciones vistas y leídas
- ✅ **Sonido sutil de notificación**: Reproduce audio personalizado con cada notificación
- ✅ **Control de sonido en UI**: Toggle para habilitar/deshabilitar sonidos desde la interfaz
- ✅ **Persistencia de preferencias**: Recuerda la configuración de sonido del usuario
- ✅ **Arquitectura modular**: Sin dependencias externas, compatible con LESS
- ✅ **Responsive**: Adaptado para dispositivos móviles
- ✅ **Modo oscuro**: Soporte opcional para modo oscuro

## 📁 Estructura de Archivos

```
src/components/union/notifications/
├── WhatsAppNotification.jsx      # Componente de notificación flotante
├── whatsappNotification.less     # Estilos de notificación flotante
├── NotificationBell.jsx          # Componente campana con dropdown
├── notificationBell.less         # Estilos de campana
├── SoundToggle.jsx               # Control de sonido on/off
├── soundToggle.less              # Estilos del control de sonido
├── index.js                      # Exportaciones centralizadas
└── README.md                     # Este archivo
```

```
src/hooks/
├── useWebNotifications.js        # Hook para Web Notification API
└── useNotificationSound.js       # Hook para manejo de sonidos
```

```
src/contexts/sound/
└── notificationSound.mp3         # Archivo de sonido de notificación
```

## 🔧 Integración

### 1. SocketContext (Ya integrado)

El contexto de Socket.io maneja automáticamente:

```jsx
// Cuando llega una notificación por socket
socket.on('new_notification', (notification) => {
  // Si la página está activa: muestra notificación flotante
  // Si la página está en segundo plano: muestra notificación nativa
});
```

### 2. Componente de Navegación (Ya integrado)

```jsx
import NotificationBell from './notifications/NotificationBell';

// En tu componente nav
<NotificationBell className="nav-notification-bell" />
```

### 3. Uso del Hook de Notificaciones

```jsx
import { useNotifications } from '../../../contexts/SocketContext';

function MiComponente() {
  const {
    notifications,        // Array de notificaciones
    unseenCount,         // Contador de no vistas
    markAllAsSeen,       // Función para marcar como vistas
    markAsRead,          // Función para marcar como leída
    hasNotificationPermission // Permisos del navegador
  } = useNotifications();
}
```

## 🎨 Personalización de Estilos

Todos los estilos usan el prefijo `wa-` para evitar conflictos:

### Variables LESS Utilizadas

```less
@bgVerde: #25D366;        // Verde WhatsApp
@bgDefault: #FFF;         // Fondo blanco
@colorLetraOscuro: #525456; // Color de texto
@bgTextOpacity: #919eab;  // Texto secundario
@danger: #dc3545;         // Color del badge
```

### Clases CSS Principales

```less
.wa-notification              // Contenedor principal flotante
.wa-notification__card        // Tarjeta de notificación
.wa-notification__accent-line // Línea verde lateral
.wa-bell-container           // Contenedor de campana
.wa-bell-button              // Botón de campana
.wa-bell-badge               // Badge contador
.wa-bell-dropdown            // Dropdown de notificaciones
```

## 🔄 API Endpoints Esperados

El sistema espera estos endpoints en el backend:

```javascript
// Marcar todas las notificaciones como vistas (resetear contador)
PUT /api/notifications/mark-as-seen
Headers: { Authorization: 'Bearer <token>' }

// Marcar notificación específica como leída
PUT /api/notifications/:id/mark-as-read
Headers: { Authorization: 'Bearer <token>' }
```

## 📱 Comportamiento por Estado de Pestaña

### Pestaña Activa (`document.hidden = false`)
- Muestra `WhatsAppNotification` flotante en esquina superior derecha
- Auto-cierre después de 5 segundos
- Botón manual de cierre
- Animación suave de entrada/salida

### Pestaña en Segundo Plano (`document.hidden = true`)
- Muestra notificación nativa del sistema operativo
- Requiere permisos del usuario
- Al hacer clic, enfoca la ventana del ERP

## 🔔 Permisos de Notificación

Los permisos se solicitan automáticamente al cargar la aplicación:

```javascript
// Se ejecuta automáticamente en SocketContext
initializeNotificationPermissions();
```

Estados posibles:
- `granted`: Usuario autorizó notificaciones
- `denied`: Usuario negó notificaciones  
- `default`: No se han solicitado permisos

## 🔊 Sistema de Sonido

### Funcionamiento Automático
Cada vez que llega una notificación por socket, se reproduce automáticamente un sonido sutil si:
- El sonido está habilitado (`soundEnabled = true`)
- El archivo de audio se ha cargado correctamente (`isSoundLoaded = true`)
- El navegador permite la reproducción de audio

### Control de Sonido en UI
El componente `SoundToggle` permite al usuario:
- **Activar/Desactivar** el sonido con un botón visual
- **Probar el sonido** al activarlo (feedback inmediato)
- **Ver el estado visual** (icono de altavoz activo/silenciado)

### Persistencia
Las preferencias de sonido se guardan automáticamente en `localStorage`:
```javascript
// Se guarda como: 'union-notification-sound-enabled' = true/false
localStorage.setItem('union-notification-sound-enabled', JSON.stringify(soundEnabled));
```

### Configuración del Audio
```javascript
// Configuración por defecto del sonido
audio.volume = 0.6;        // Volumen sutil (60%)
audio.preload = 'auto';    // Carga automática del archivo
```

### Hook useNotificationSound
```javascript
const {
  soundEnabled,          // Estado actual del sonido
  setSoundEnabled,       // Cambiar estado manualmente
  toggleSound,           // Alternar estado
  playNotificationSound, // Reproducir sonido manualmente
  testSound,            // Probar sonido (para configuración)
  setVolume,            // Ajustar volumen (0.0 - 1.0)
  isLoaded,             // Audio cargado correctamente
  error                 // Error de carga (si existe)
} = useNotificationSound();
```

## 🎯 Formato de Notificación

Las notificaciones deben tener esta estructura:

```javascript
{
  id: "unique-id",           // ID único
  title: "Título",           // Título principal
  message: "Mensaje",        // Contenido del mensaje  
  createdAt: "2024-01-01",  // Timestamp de creación
  isRead: false,            // Estado leído
  isSeen: false            // Estado visto
}
```

## 🚀 Ejemplo de Uso Completo

```jsx
import React from 'react';
import { useNotifications } from '../contexts/SocketContext';
import NotificationBell from './notifications/NotificationBell';

function MiHeader() {
  const { 
    unseenCount, 
    hasNotificationPermission 
  } = useNotifications();

  return (
    <header>
      <h1>Mi ERP</h1>
      
      {/* Campana con contador automático */}
      <NotificationBell />
      
      {/* Indicador de permisos */}
      {!hasNotificationPermission && (
        <span className="permission-warning">
          Habilita las notificaciones para una mejor experiencia
        </span>
      )}
    </header>
  );
}
```

## 🐛 Debugging

Para debuggear el sistema, revisa la consola:

```javascript
// Logs automáticos del sistema
[Socket] Conectado: abc123
[Notification] Mostrando notificación flotante: {...}
[Notification] Mostrando notificación nativa: {...}
```

## 📱 Responsividad

El sistema está optimizado para:
- **Desktop**: Notificaciones de 320px de ancho
- **Mobile**: Adaptación automática con `calc(100vw - 32px)`
- **Dropdown**: Posicionamiento inteligente según espacio disponible

## 🔐 Seguridad

- Validación de permisos antes de mostrar notificaciones nativas
- Tokens JWT para endpoints de API
- Sanitización automática de contenido de notificaciones
- Límites de longitud para evitar spam visual

Este sistema está completamente integrado y listo para usar. ¡No requiere configuración adicional!