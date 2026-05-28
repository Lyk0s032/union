import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para manejar notificaciones web nativas y detección de visibilidad
 */
export function useWebNotifications() {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );
  const [isPageVisible, setIsPageVisible] = useState(!document.hidden);

  // Solicitar permisos de notificación
  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') {
      console.warn('Este navegador no soporta notificaciones web');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error('Error al solicitar permisos de notificación:', error);
      return 'denied';
    }
  }, []);

  // Mostrar notificación nativa del sistema
  const showNativeNotification = useCallback((title, options = {}) => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
      return null;
    }

    const defaultOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'union-erp',
      renotify: true,
      requireInteraction: false,
      silent: false,
      ...options
    };

    try {
      const notification = new Notification(title, defaultOptions);
      
      // Auto cerrar después de 6 segundos
      setTimeout(() => {
        notification.close();
      }, 6000);

      // Enfocar la ventana al hacer clic
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error('Error al mostrar notificación nativa:', error);
      return null;
    }
  }, []);

  // Detectar cambios en la visibilidad de la página
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Monitorear cambios en los permisos
  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission);
    }
  }, []);

  // Solicitar permisos automáticamente al montar (solo una vez)
  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      // No solicitar automáticamente, esperar a que el usuario interactúe
      // requestPermission();
    }
  }, []);

  return {
    permission,
    isPageVisible,
    requestPermission,
    showNativeNotification,
    isSupported: typeof Notification !== 'undefined',
    isGranted: permission === 'granted'
  };
}