import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useWebNotifications } from '../hooks/useWebNotifications';
import { useNotificationSound } from '../hooks/useNotificationSound';
import WhatsAppNotification from '../components/union/notifications/WhatsAppNotification';
import axios from 'axios';

const SocketContext = createContext(null);

// Misma base que axios.defaults.baseURL, sin trailing slash
// const SOCKET_URL = 'http://192.168.1.22:3000/';
const SOCKET_URL = 'https://unionapi-production.up.railway.app/';

export function SocketProvider({ children }) {
  const { user } = useSelector((store) => store.usuario);
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  
  // Estados para notificaciones flotantes tipo WhatsApp
  const [activeWhatsAppNotification, setActiveWhatsAppNotification] = useState(null);
  const [unseenCount, setUnseenCount] = useState(0);
  
  // Hook para notificaciones web nativas
  const { 
    isPageVisible, 
    showNativeNotification, 
    requestPermission, 
    isGranted: hasNotificationPermission 
  } = useWebNotifications();

  // Hook para sonido de notificaciones
  const { 
    soundEnabled, 
    setSoundEnabled, 
    toggleSound, 
    playNotificationSound,
    testSound,
    setVolume: setSoundVolume,
    isLoaded: isSoundLoaded,
    error: soundError 
  } = useNotificationSound();

  // Función para cargar notificaciones de la BD
  const loadNotificationsFromDB = async (token) => {
    try {
      console.log('[Notifications] Cargando notificaciones desde BD...');
      console.log('[Notifications] Token:', token ? 'Disponible' : 'No disponible');
      
      const response = await axios.get('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('[Notifications] Response:', response);
      
      if (response.data && response.data.success) {
        const dbNotifications = response.data.data || [];
        
        // Combinar notificaciones de BD con las que pueden haber llegado por socket
        setNotifications(prevNotifications => {
          // Crear un Set con los IDs existentes para evitar duplicados
          const existingIds = new Set(prevNotifications.map(n => n.id));
          
          // Filtrar notificaciones de BD que no están en el estado actual
          const newDbNotifications = dbNotifications.filter(n => !existingIds.has(n.id));
          
          // Combinar y ordenar por fecha de creación
          const combined = [...prevNotifications, ...newDbNotifications]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 30); // Mantener límite de 30
          
          console.log('[Notifications] Notificaciones combinadas:', combined.length);
          return combined;
        });
        
        setUnseenCount(response.data.unseenCount || 0);
        console.log('[Notifications] Notificaciones BD:', dbNotifications.length, 'No vistas:', response.data.unseenCount);
      } else {
        console.error('[Notifications] Error del servidor:', response.data?.msg || 'Error desconocido');
      }
    } catch (error) {
      console.error('[Notifications] Error al cargar notificaciones desde BD:', error);
      if (error.response) {
        console.error('[Notifications] Response data:', error.response.data);
        console.error('[Notifications] Response status:', error.response.status);
      }
    }
  };

  useEffect(() => {
    // Sin usuario logueado: desconectar si había socket activo
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setNotifications([]);
      setUnseenCount(0);
      return;
    }

    const token = JSON.parse(localStorage.getItem('loggedPeople'));
    if (!token) return;

    // Cargar notificaciones existentes de la BD al inicializar
    console.log('[Socket] Inicializando y cargando notificaciones...');
    loadNotificationsFromDB(token);

    const socket = io(SOCKET_URL, {
      auth: { token },
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('[Socket] Conectado:', socket.id);
    });

    socket.on('new_notification', (notification) => {
      setNotifications((prev) => {
        // Evitar duplicados basándose en el ID de la notificación
        const isDuplicate = prev.some(n => n.id === notification.id);
        if (isDuplicate) return prev;
        
        // Agregar la nueva notificación al principio y mantener límite de 30
        const updatedNotifications = [notification, ...prev];
        return updatedNotifications.slice(0, 30);
      });
      
      // Incrementar contador de no vistas
      setUnseenCount(prev => prev + 1);
      
      // Reproducir sonido sutil de notificación
      if (soundEnabled && isSoundLoaded) {
        playNotificationSound().catch(error => {
          console.warn('[Socket] No se pudo reproducir sonido de notificación:', error);
        });
      }
      
      // Mostrar notificación según el estado de la página
      if (isPageVisible) {
        // Si la página está activa: mostrar notificación tipo WhatsApp
        setActiveWhatsAppNotification({
          id: Date.now(),
          title: notification.title || 'Nueva notificación',
          message: notification.message || notification.body || 'Tienes una nueva actualización'
        });
      } else {
        // Si la página está en segundo plano: mostrar notificación nativa
        if (hasNotificationPermission) {
          showNativeNotification(
            notification.title || 'UNION ERP',
            {
              body: notification.message || notification.body || 'Tienes una nueva actualización',
              icon: '/favicon.ico',
              tag: `notification-${notification.id || Date.now()}`
            }
          );
        }
      }
    });

    socket.on('connect_error', (err) => {
      console.warn('[Socket] Error de conexión:', err.message);
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Desconectado');
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  const clearNotifications = () => {
    setNotifications([]);
    setUnseenCount(0);
  };

  const removeNotification = (index) =>
    setNotifications((prev) => prev.filter((_, i) => i !== index));

  // Cerrar notificación tipo WhatsApp
  const closeWhatsAppNotification = () => {
    setActiveWhatsAppNotification(null);
  };

  // Marcar todas las notificaciones como vistas (resetear contador)
  const markAllAsSeen = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('loggedPeople'));
      if (!token) return;

      await axios.put('/api/notifications/mark-as-seen', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setUnseenCount(0);
      // Actualizar las notificaciones locales para marcarlas como vistas
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isSeen: true }))
      );
    } catch (error) {
      console.error('Error al marcar notificaciones como vistas:', error);
    }
  };

  // Marcar una notificación específica como leída
  const markAsRead = async (notificationId) => {
    try {
      const token = JSON.parse(localStorage.getItem('loggedPeople'));
      if (!token) return;

      await axios.put(`/api/notifications/${notificationId}/mark-as-read`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Actualizar el estado local
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };

  // Solicitar permisos de notificación al usuario (llamar cuando monte la app)
  const initializeNotificationPermissions = () => {
    requestPermission();
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        notifications,
        clearNotifications,
        removeNotification,
        unseenCount,
        markAllAsSeen,
        markAsRead,
        loadNotificationsFromDB: () => {
          const token = JSON.parse(localStorage.getItem('loggedPeople'));
          if (token) return loadNotificationsFromDB(token);
        },
        initializeNotificationPermissions,
        hasNotificationPermission,
        // Funcionalidades de sonido
        soundEnabled,
        setSoundEnabled,
        toggleSound,
        testSound,
        setSoundVolume,
        isSoundLoaded,
        soundError
      }}
    >
      {children}
      
      {/* Notificación flotante tipo WhatsApp */}
      {activeWhatsAppNotification && (
        <WhatsAppNotification
          key={activeWhatsAppNotification.id}
          title={activeWhatsAppNotification.title}
          message={activeWhatsAppNotification.message}
          onClose={closeWhatsAppNotification}
          autoClose={true}
          duration={5000}
        />
      )}
    </SocketContext.Provider>
  );
}

/** Hook para consumir el contexto desde cualquier componente */
export function useSocketContext() {
  return useContext(SocketContext);
}

/** Alias semántico para el hook de notificaciones */
export function useNotifications() {
  const { 
    notifications, 
    clearNotifications, 
    removeNotification,
    unseenCount,
    markAllAsSeen,
    markAsRead,
    loadNotificationsFromDB,
    initializeNotificationPermissions,
    hasNotificationPermission,
    // Funcionalidades de sonido
    soundEnabled,
    setSoundEnabled,
    toggleSound,
    testSound,
    setSoundVolume,
    isSoundLoaded,
    soundError
  } = useSocketContext();
  
  return { 
    notifications, 
    clearNotifications, 
    removeNotification,
    unseenCount,
    markAllAsSeen,
    markAsRead,
    loadNotificationsFromDB,
    initializeNotificationPermissions,
    hasNotificationPermission,
    // Funcionalidades de sonido
    soundEnabled,
    setSoundEnabled,
    toggleSound,
    testSound,
    setSoundVolume,
    isSoundLoaded,
    soundError
  };
}
