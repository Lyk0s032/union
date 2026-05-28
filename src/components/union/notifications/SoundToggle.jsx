import React from 'react';
import { useNotifications } from '../../../contexts/SocketContext';
import './soundToggle.less';

const SoundToggle = ({ className = '', showLabel = false }) => {
  const { 
    soundEnabled, 
    toggleSound, 
    testSound, 
    isSoundLoaded, 
    soundError 
  } = useNotifications();

  const handleToggle = () => {
    toggleSound();
    
    // Si se está habilitando el sonido, reproducir sonido de test
    if (!soundEnabled && isSoundLoaded) {
      setTimeout(() => {
        testSound();
      }, 100);
    }
  };

  return (
    <div className={`wa-sound-toggle ${className}`}>
      <button
        className={`wa-sound-toggle__button ${soundEnabled ? 'wa-sound-toggle__button--enabled' : 'wa-sound-toggle__button--disabled'}`}
        onClick={handleToggle}
        title={soundEnabled ? 'Silenciar notificaciones' : 'Habilitar sonido de notificaciones'}
        disabled={soundError || !isSoundLoaded}
      >
        {soundEnabled ? (
          // Icono de sonido habilitado
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M3 9V15H7L12 20V4L7 9H3ZM16.5 12C16.5 10.23 15.48 8.71 14 7.97V16.02C15.48 15.29 16.5 13.77 16.5 12ZM14 3.23V5.29C16.89 6.15 19 8.83 19 12C19 15.17 16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.72 18.01 4.14 14 3.23Z" 
              fill="currentColor"
            />
          </svg>
        ) : (
          // Icono de sonido deshabilitado/muted
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M3.63 3.63C3.24 4.02 3.24 4.65 3.63 5.04L7.29 8.7L7 9H3V15H7L12 20V13.41L16.25 17.66C15.58 18.13 14.81 18.5 14 18.71V20.77C15.38 20.45 16.63 19.82 17.69 18.95L19.95 21.21C20.34 21.6 20.97 21.6 21.36 21.21C21.75 20.82 21.75 20.19 21.36 19.8L5.05 3.49C4.66 3.1 4.03 3.1 3.64 3.49L3.63 3.63ZM19 12C19 12.82 18.85 13.61 18.59 14.34L20.12 15.87C20.68 14.7 21 13.39 21 12C21 7.72 18.01 4.14 14 3.23V5.29C16.89 6.15 19 8.83 19 12ZM16.5 12C16.5 10.23 15.48 8.71 14 7.97V10.18L16.45 12.63C16.48 12.43 16.5 12.21 16.5 12ZM12 4L9.91 6.09L12 8.18V4Z" 
              fill="currentColor"
            />
          </svg>
        )}
      </button>
      
      {showLabel && (
        <span className="wa-sound-toggle__label">
          {soundEnabled ? 'Sonido activado' : 'Sonido desactivado'}
        </span>
      )}
      
      {soundError && (
        <span className="wa-sound-toggle__error" title="Error cargando sonido">
          ⚠️
        </span>
      )}
    </div>
  );
};

export default SoundToggle;