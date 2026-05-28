import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook personalizado para manejar sonidos de notificación
 */
export function useNotificationSound(soundPath = '/src/contexts/sound/notificationSound.mp3') {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    // Recuperar preferencia del localStorage o por defecto true
    const saved = localStorage.getItem('union-notification-sound-enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const audioRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Inicializar el audio
  useEffect(() => {
    const audio = new Audio(soundPath);
    
    // Configurar propiedades del audio
    audio.preload = 'auto';
    audio.volume = 0.6; // Volumen sutil (60%)
    
    // Event listeners
    const handleCanPlayThrough = () => {
      setIsLoaded(true);
      setError(null);
    };
    
    const handleError = (e) => {
      console.warn('[NotificationSound] Error cargando sonido:', e.target.error);
      setError(e.target.error);
      setIsLoaded(false);
    };
    
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', handleError);
    
    audioRef.current = audio;
    
    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, [soundPath]);

  // Guardar preferencia en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('union-notification-sound-enabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // Función para reproducir el sonido
  const playNotificationSound = useCallback(async () => {
    if (!soundEnabled || !audioRef.current || !isLoaded) {
      return false;
    }

    try {
      // Resetear audio para que se pueda reproducir múltiples veces seguidas
      audioRef.current.currentTime = 0;
      
      // Reproducir con manejo de promesa
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        await playPromise;
      }
      
      return true;
    } catch (error) {
      // Los navegadores pueden bloquear autoplay hasta que haya interacción del usuario
      if (error.name === 'NotAllowedError') {
        console.info('[NotificationSound] Sonido bloqueado - requiere interacción del usuario');
      } else {
        console.warn('[NotificationSound] Error reproduciendo sonido:', error);
      }
      return false;
    }
  }, [soundEnabled, isLoaded]);

  // Función para alternar el sonido
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  // Función para establecer el volumen (0.0 - 1.0)
  const setVolume = useCallback((volume) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  // Función para probar el sonido (útil para configuración)
  const testSound = useCallback(async () => {
    if (!audioRef.current || !isLoaded) {
      return false;
    }

    try {
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        await playPromise;
      }
      
      return true;
    } catch (error) {
      console.warn('[NotificationSound] Error en test de sonido:', error);
      return false;
    }
  }, [isLoaded]);

  return {
    soundEnabled,
    setSoundEnabled,
    toggleSound,
    playNotificationSound,
    testSound,
    setVolume,
    isLoaded,
    error,
    // Estado para debugging
    debug: {
      isLoaded,
      error,
      audioSrc: audioRef.current?.src,
      volume: audioRef.current?.volume
    }
  };
}