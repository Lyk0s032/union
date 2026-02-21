import React, { useEffect, useRef } from 'react';
import LeftDataChoose from './leftDataChoose';
import RightDataOrden from './rightDataOrden';
import LeftItemOpened from './leftItemOpened';
import { useSearchParams } from 'react-router-dom';

export default function IndexOrden() {
    const [params, setParams] = useSearchParams();
    const paramsRef = useRef(params);

    // Actualizar la referencia cuando cambian los params
    useEffect(() => {
        paramsRef.current = params;
    }, [params]);

    // Función para cerrar la orden
    const cerrarOrden = () => {
        const currentParams = new URLSearchParams(paramsRef.current);
        currentParams.delete('openOrden');
        setParams(currentParams);
    };

    // Manejar Escape con prioridad: si openOrden está abierta, cerrarla primero
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            const code = event.code;
            const currentParams = paramsRef.current;

            // Escape: Cerrar openOrden si está abierta (tiene prioridad)
            if ((key === 'escape' || code === 'Escape') && currentParams.get('openOrden')) {
                // Prevenir que otros listeners se ejecuten
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                
                // Si también hay openItem abierto, cerrarlo primero (última abierta tiene prioridad)
                if (currentParams.get('openItem')) {
                    const newParams = new URLSearchParams(currentParams);
                    newParams.delete('openItem');
                    newParams.delete('openItemTipo');
                    setParams(newParams);
                } else {
                    // Si no hay openItem, cerrar openOrden
                    cerrarOrden();
                }
                return false;
            }
        };

        // Agregar el event listener en la fase de captura con prioridad alta
        // Usar { once: false } para que se ejecute cada vez
        document.addEventListener('keydown', handleKeyDown, { capture: true, passive: false });
        window.addEventListener('keydown', handleKeyDown, { capture: true, passive: false });

        // Limpiar los event listeners al desmontar
        return () => {
            document.removeEventListener('keydown', handleKeyDown, { capture: true });
            window.removeEventListener('keydown', handleKeyDown, { capture: true });
        };
    }, [setParams]);

    return (
        <div className="indexOrden">
            {/* Botón cerrar */}
            <button 
                className="btnCerrarOrden"
                onClick={cerrarOrden}
                title="Cerrar orden (Esc)"
            >
                <span>×</span>
            </button>
            <div className="divideContainerOrden">
                <div className="leftContainerOrden">
                    {
                        params.get('openItem') ? <LeftItemOpened /> : <LeftDataChoose />  
                    }
                </div>
                <div className="rightContainerOrden">
                    <RightDataOrden />
                </div>
            </div>
        </div>
    );
}