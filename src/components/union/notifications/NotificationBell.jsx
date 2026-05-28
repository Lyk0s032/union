import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNotifications } from '../../../contexts/SocketContext';
import SoundToggle from './SoundToggle';
import * as actions from '../../store/action/action';
import axios from 'axios';
import './notificationBell.less';

const NotificationBell = ({ className = '' }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const {
    notifications,
    unseenCount,
    markAllAsSeen,
    markAsRead,
    clearNotifications,
    loadNotificationsFromDB,
    initializeNotificationPermissions
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const dropdownRef = useRef(null);
  const bellRef = useRef(null);

  // Solicitar permisos de notificación al montar por primera vez
  useEffect(() => {
    if (!isInitialized) {
      initializeNotificationPermissions();
      setIsInitialized(true);
    }
  }, [initializeNotificationPermissions, isInitialized]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !bellRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleBellClick = async () => {
    const wasOpen = isOpen;
    setIsOpen(!wasOpen);
    
    // Si se está abriendo la campana, cargar notificaciones de la BD
    if (!wasOpen) {
      console.log('[NotificationBell] Abriendo campana, cargando notificaciones...');
      await loadNotificationsFromDB();
      
      // Dar un pequeño delay para permitir que se carguen las notificaciones
      // antes de marcar como vistas
      setTimeout(() => {
        if (unseenCount > 0) {
          markAllAsSeen();
        }
      }, 100);
    }
  };

  /**
   * 🧠 TRADUCTOR INTELIGENTE HÍBRIDO 🧠
   * Maneja notificaciones de manera inteligente según su categoría:
   * - MUNDO DISPATCH: Infla Redux primero, luego navega (para requerimientos)
   * - MUNDO PARAMS: Navega directamente con parámetros URL (para otros módulos)
   */
  const handleNotificationClick = async (notification) => {
    try {
      console.log('[NotificationBell] 🔔 Procesando notificación:', notification);
      
      // 1️⃣ EJECUCIÓN API: Marcar como leída PRIMERO
      if (!notification.isRead && notification.id) {
        console.log('[NotificationBell] 📝 Marcando como leída:', notification.id);
        await axios.put(`/api/notifications/${notification.id}/mark-as-read`, {}, {
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedPeople'))}`
          }
        });
        
        // Actualizar estado local para quitar indicador visual
        markAsRead(notification.id);
      }
      
      // Cerrar el dropdown
      setIsOpen(false);
      
      // 2️⃣ EVALUACIÓN DE RUTAS HÍBRIDA
      const { category, actionUrl, targetId } = notification;
      
      console.log('[NotificationBell] 🎯 Analizando:', { category, actionUrl, targetId });
      
      if (!actionUrl) {
        console.warn('[NotificationBell] ⚠️ No hay actionUrl definida');
        return;
      }
      
      // Verificar si es URL externa
      if (actionUrl.startsWith('http://') || actionUrl.startsWith('https://')) {
        console.log('[NotificationBell] 🌐 Abriendo URL externa');
        window.open(actionUrl, '_blank', 'noopener,noreferrer');
        return;
      }
      
      // Verificar si es solo un query param (empieza con ?)
      if (actionUrl.startsWith('?')) {
        console.log('[NotificationBell] 🔗 Agregando query params a la URL actual');
        const currentPath = window.location.pathname;
        navigate(`${currentPath}${actionUrl}`);
        return;
      }
      
      const normalUrl = actionUrl.startsWith('/') ? actionUrl : `/${actionUrl}`;

      // Rutas que usan ?openReq= para que el componente destino
      // dispache y abra el item vía Redux (misma lógica que un clic manual)
      const OPEN_REQ_ROUTES = ['/produccion/solicitudes', '/comercial/solicitudes'];

      if (OPEN_REQ_ROUTES.includes(normalUrl) && targetId) {
        console.log('[NotificationBell] 🎯 Navegando con openReq:', normalUrl, targetId);
        navigate(`${normalUrl}?openReq=${targetId}`, {
          state: { openReqId: targetId, fromNotification: true }
        });

      } else if (targetId) {
        // Resto de rutas: pasar el id como query param genérico
        const sep = normalUrl.includes('?') ? '&' : '?';
        console.log('[NotificationBell] 🔗 Navegando con id:', `${normalUrl}${sep}id=${targetId}`);
        navigate(`${normalUrl}${sep}id=${targetId}`);

      } else {
        console.log('[NotificationBell] 🧭 Navegando a ruta limpia:', normalUrl);
        navigate(normalUrl);
      }
      
      console.log('[NotificationBell] ✅ Navegación completada exitosamente');
      
    } catch (error) {
      console.error('[NotificationBell] ❌ Error procesando notificación:', error);
      
      // Fallback: navegación básica si algo falla
      if (notification.actionUrl) {
        console.log('[NotificationBell] 🔄 Aplicando fallback de navegación...');
        const fallbackUrl = notification.actionUrl.startsWith('/') 
          ? notification.actionUrl 
          : `/${notification.actionUrl}`;
        navigate(fallbackUrl);
      }
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Hace un momento';
    
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays}d`;
  };

  return (
    <div className={`wa-bell-container ${className}`}>
      <button 
        ref={bellRef}
        className={`wa-bell-button ${unseenCount > 0 ? 'wa-bell-button--has-notifications' : ''}`}
        onClick={handleBellClick}
        aria-label={`Notificaciones${unseenCount > 0 ? ` (${unseenCount} nuevas)` : ''}`}
      >
        {/* Icono de campana SVG */}
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="wa-bell-icon"
        >
          <path 
            d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 19V20H3V19L5 17V11C5 7.9 7.03 5.17 10 4.29C10 4.19 10 4.1 10 4C10 2.34 11.34 1 13 1S16 2.34 16 4C16 4.1 16 4.19 16 4.29C18.97 5.17 21 7.9 21 11V17L23 19ZM7 18H17V11C17 8.24 14.76 6 12 6S7 8.24 7 11V18ZM10 21C10 22.1 10.9 23 12 23S14 22.1 14 21H10Z" 
            fill="currentColor"
          />
        </svg>
        
        {/* Contador de notificaciones */}
        {unseenCount > 0 && (
          <span className="wa-bell-badge">
            {unseenCount > 99 ? '99+' : unseenCount}
          </span>
        )}
      </button>

      {/* Dropdown de notificaciones */}
      {isOpen && (
        <div ref={dropdownRef} className="wa-bell-dropdown">
          <div className="wa-bell-dropdown__header">
            <h3 className="wa-bell-dropdown__title">Notificaciones</h3>
            <div className="wa-bell-dropdown__actions">
              <SoundToggle />
              {notifications.length > 0 && (
                <button 
                  className="wa-bell-dropdown__clear-btn"
                  onClick={clearNotifications}
                >
                  Limpiar todo
                </button>
              )}
            </div>
          </div>

          <div className="wa-bell-dropdown__content">
            {notifications.length === 0 ? (
              <div className="wa-bell-dropdown__empty">
                <svg 
                  width="48" 
                  height="48" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="wa-bell-dropdown__empty-icon"
                >
                  <path 
                    d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 19V20H3V19L5 17V11C5 7.9 7.03 5.17 10 4.29C10 4.19 10 4.1 10 4C10 2.34 11.34 1 13 1S16 2.34 16 4C16 4.1 16 4.19 16 4.29C18.97 5.17 21 7.9 21 11V17L23 19ZM7 18H17V11C17 8.24 14.76 6 12 6S7 8.24 7 11V18Z" 
                    fill="currentColor"
                  />
                </svg>
                <p>No hay notificaciones</p>
              </div>
            ) : (
              <div className="wa-bell-dropdown__list">
                {notifications.map((notification, index) => (
                  <div 
                    key={notification.id || index}
                    className={`wa-bell-notification-item ${!notification.isRead ? 'wa-bell-notification-item--unread' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="wa-bell-notification-item__content">
                      <h4 className="wa-bell-notification-item__title">
                        {notification.title || 'Nueva notificación'}
                      </h4>
                      <p className="wa-bell-notification-item__message">
                        {notification.message || notification.body || 'Tienes una nueva actualización'}
                      </p>
                      <span className="wa-bell-notification-item__time">
                        {formatTime(notification.createdAt || notification.timestamp)}
                      </span>
                    </div>
                    {!notification.isRead && (
                      <div className="wa-bell-notification-item__unread-dot"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="wa-bell-dropdown__footer">
              <button className="wa-bell-dropdown__view-all">
                Ver todas las notificaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;