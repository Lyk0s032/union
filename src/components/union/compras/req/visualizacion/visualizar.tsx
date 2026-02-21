import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LeftNavVisualizacion from './leftNavVisualizacion';
import RightVisualizar from './rightVisualizar';
import { axiosToGetRealProyectosRequisicion } from '../../../../store/action/action';

export default function VisualizarRequisicion() {
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const requisicionesSeleccionadas = useSelector((state: any) => state.requisicion.requisicionesSeleccionadas);
    const loadingRealProyectos = useSelector((state: any) => state.requisicion.loadingRealProyectosRequisicion);

    // Llamar a la API cuando se abre la modal
    useEffect(() => {
        if (params.get('open') === 'projects' && requisicionesSeleccionadas.length > 0) {
            (dispatch as any)(axiosToGetRealProyectosRequisicion(requisicionesSeleccionadas));
        }
    }, [params.get('open'), requisicionesSeleccionadas, dispatch]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isControl = event.ctrlKey || event.metaKey;
            const key = event.key.toLowerCase();
            const code = event.code;

            // Escape: Cerrar modal
            if (key === 'escape' || code === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                
                // Remover el parámetro 'open' para cerrar la modal
                params.delete('open');
                setParams(params);
                return false;
            }

            // Verificar si es uno de nuestros atajos con Ctrl
            if (isControl && (code === 'KeyP' || code === 'KeyK' || code === 'KeyI' || code === 'KeyJ')) {
                // PREVENIR INMEDIATAMENTE el comportamiento por defecto
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                
                // Ctrl + P -> Proyectos
                if (code === 'KeyP') {
                    params.set('view', 'proyectos');
                    setParams(params);
                    return false;
                }

                // Ctrl + K -> Kits
                if (code === 'KeyK') {
                    params.set('view', 'kits');
                    setParams(params);
                    return false;
                }

                // Ctrl + I -> Necesidad
                if (code === 'KeyI') {
                    params.set('view', 'necesidad');
                    setParams(params);
                    return false;
                }

                // Ctrl + J -> Órdenes de compra
                if (code === 'KeyJ') {
                    params.set('view', 'ordenes');
                    setParams(params);
                    return false;
                }
            }
        };

        // Agregar el event listener en la fase de captura con prioridad alta
        document.addEventListener('keydown', handleKeyDown, { capture: true, passive: false });
        window.addEventListener('keydown', handleKeyDown, { capture: true, passive: false });

        // Limpiar los event listeners al desmontar
        return () => {
            document.removeEventListener('keydown', handleKeyDown, { capture: true });
            window.removeEventListener('keydown', handleKeyDown, { capture: true });
        };
    }, [params, setParams]);

    return (
        <div className="visualizarRequisicion">
            <div className="containerVisualizar">
                <div className="leftZone">
                    <LeftNavVisualizacion />
                </div>
                <div className="rightZone">
                    <RightVisualizar />
                </div>
            </div>
        </div>
    )
}