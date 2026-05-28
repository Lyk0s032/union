import React, { useState, useEffect } from 'react';
import './whatsappNotification.less';

const WhatsAppNotification = ({ 
  title = "Nueva notificación", 
  message = "Tienes una nueva actualización", 
  onClose,
  autoClose = true,
  duration = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Activar animación de entrada inmediatamente
    setIsVisible(true);

    // Auto cerrar después del tiempo especificado
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsLeaving(true);
    
    // Esperar a que termine la animación de salida
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 350); // Duración de la animación de salida
  };

  if (!isVisible && !isLeaving) return null;

  return (
    <div className={`wa-notification ${isVisible ? 'wa-notification--visible' : ''} ${isLeaving ? 'wa-notification--leaving' : ''}`}>
      <div className="wa-notification__card">
        <div className="wa-notification__accent-line"></div>
        
        <div className="wa-notification__content">
          <div className="wa-notification__header">
            <h4 className="wa-notification__title">{title}</h4>
            <button 
              className="wa-notification__close-btn"
              onClick={handleClose}
              aria-label="Cerrar notificación"
            >
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M9 3L3 9M3 3L9 9" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          
          <p className="wa-notification__message">{message}</p>
          
          <div className="wa-notification__footer">
            <span className="wa-notification__timestamp">Ahora</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppNotification;