// Exportaciones centralizadas del sistema de notificaciones

// Componentes principales
export { default as WhatsAppNotification } from './WhatsAppNotification';
export { default as NotificationBell } from './NotificationBell';
export { default as SoundToggle } from './SoundToggle';

// Hooks
export { useWebNotifications } from '../../../hooks/useWebNotifications';
export { useNotificationSound } from '../../../hooks/useNotificationSound';

// Context hooks (re-exportación para conveniencia)
export { 
  useSocketContext, 
  useNotifications 
} from '../../../contexts/SocketContext';

// Tipos de notificación para referencia
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success', 
  WARNING: 'warning',
  ERROR: 'error'
};

// Configuraciones por defecto
export const DEFAULT_NOTIFICATION_CONFIG = {
  duration: 5000,
  position: 'top-right',
  autoClose: true,
  closeOnClick: false
};

// Utilidades para crear notificaciones programáticamente
export const createNotification = (title, message, type = 'info') => {
  return {
    id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    message,
    type,
    createdAt: new Date().toISOString(),
    isRead: false,
    isSeen: false
  };
};

// Función de ejemplo para disparar notificaciones manualmente (para testing)
export const showTestNotification = () => {
  const notification = createNotification(
    'Notificación de Prueba',
    'Este es un mensaje de prueba del sistema de notificaciones premium tipo WhatsApp.',
    'info'
  );
  
  // Simular evento de socket para testing
  if (window.socket) {
    window.socket.emit('test_notification', notification);
  }
  
  return notification;
};

// Función para probar únicamente el sonido
export const testNotificationSound = async () => {
  try {
    // Crear un audio temporal para prueba
    const audio = new Audio('/src/contexts/sound/notificationSound.mp3');
    audio.volume = 0.6;
    await audio.play();
    return true;
  } catch (error) {
    console.warn('Error probando sonido:', error);
    return false;
  }
};