import React, { useState, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import TopReq from './home/top'
import TableReq from './home/table'
import VisualizarRequisicion from './visualizacion/visualizar'
import * as actions from './../../../store/action/action';
import dayjs from 'dayjs'

export default function RequisicionDashboard() {
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const [activeFilter, setActiveFilter] = useState('todas'); // 'todas', 'sin-comprar', 'parcialmente', 'finalizadas'
    const [params, setParams] = useSearchParams();
    const [modoSeleccionMultiple, setModoSeleccionMultiple] = useState(false);
    const requisicionesSeleccionadas = useSelector((state: any) => state.requisicion.requisicionesSeleccionadas);
    const requisicionesFromStore = useSelector((state: any) => state.requisicion.requisicions);
    const loadingRequisiciones = useSelector((state: any) => state.requisicion.loadingRequisicions);
    
    // Cargar requisiciones al montar el componente
    useEffect(() => {
        (dispatch as any)(actions.axiosToGetRequisicions(true));
    }, [dispatch]);
    
    // Mapear datos del backend a la estructura esperada por la tabla
    const allRequisiciones = useMemo(() => {
        if (!requisicionesFromStore || requisicionesFromStore === 'notrequest' || requisicionesFromStore === 404) {
            return [];
        }
        
        if (!Array.isArray(requisicionesFromStore)) {
            return [];
        }
        
        return requisicionesFromStore.map((req: any) => {
            const cotizacion = req.cotizacion || {};
            const cliente = cotizacion.client || {};
            
            // Formatear fechas
            const fechaCreacion = req.fecha || req.createdAt 
                ? dayjs(req.fecha || req.createdAt).format('D [de] MMMM [de] YYYY')
                : 'Sin fecha';
            
            const fechaNecesaria = req.fechaNecesaria || req.fecha_necesaria
                ? dayjs(req.fechaNecesaria || req.fecha_necesaria).format('D [de] MMMM [del] YYYY')
                : 'Sin fecha';
            
            // Mapear estado
            let estado = 'Pendiente';
            if (req.estado) {
                const estadoLower = req.estado.toLowerCase();
                if (estadoLower === 'pendiente') estado = 'Pendiente';
                else if (estadoLower === 'comprando' || estadoLower === 'en proceso') estado = 'En proceso';
                else if (estadoLower === 'completada' || estadoLower === 'aprobada') estado = estadoLower === 'completada' ? 'Completada' : 'Aprobada';
                else estado = req.estado;
            }
            
            return {
                id: req.id,
                numero: req.numero || req.id,
                codigo: cotizacion.id?.toString() || req.id?.toString() || '',
                cliente: cliente.name || cliente.nombre || 'Sin cliente',
                proyecto: cotizacion.name || cotizacion.nombre || `Requisición ${req.id}`,
                estado: estado,
                fechaCreacion: fechaCreacion,
                fechaNecesaria: fechaNecesaria
            };
        });
    }, [requisicionesFromStore]);
    
    // Calcular contadores de filtros con datos reales
    const filterCounts = useMemo(() => {
        return {
            todas: allRequisiciones.length,
            'sin-comprar': allRequisiciones.filter(r => r.estado === 'Pendiente').length,
            'parcialmente': allRequisiciones.filter(r => r.estado === 'En proceso').length,
            'finalizadas': allRequisiciones.filter(r => r.estado === 'comprado' || r.estado === 'Aprobada').length,
        };
    }, [allRequisiciones]);

    const handleAnalizar = () => {
        if (requisicionesSeleccionadas.length > 0) {
            params.set('open', 'projects');
            setParams(params);
        }
    };

    return (
        <div className="noteCompras">
            {modoSeleccionMultiple && requisicionesSeleccionadas.length > 0 && (
                <div className="barraAnalizar" style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1000,
                    background: '#2980b9',
                    color: 'white',
                    padding: '15px 30px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                }}>
                    <span>{requisicionesSeleccionadas.length} requisición(es) seleccionada(s)</span>
                    <button 
                        onClick={handleAnalizar}
                        style={{
                            background: 'white',
                            color: '#2980b9',
                            border: 'none',
                            padding: '8px 20px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                        Analizar
                    </button>
                    <button 
                        onClick={() => {
                            dispatch({ type: 'CLEAR_REQUISICIONES_SELECTION' });
                            setModoSeleccionMultiple(false);
                            // La selección visual se limpiará automáticamente por el useEffect
                        }}
                        style={{
                            background: 'transparent',
                            color: 'white',
                            border: '1px solid white',
                            padding: '8px 15px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        Cancelar
                    </button>
                </div>
            )}
            <TopReq 
                searchText={searchText}
                setSearchText={setSearchText}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                filterCounts={filterCounts}
            />
            <TableReq 
                searchText={searchText}
                activeFilter={activeFilter}
                requisiciones={allRequisiciones}
                modoSeleccionMultiple={modoSeleccionMultiple}
                setModoSeleccionMultiple={setModoSeleccionMultiple}
            />
            {
                params.get('open') == 'projects' ?
                    <VisualizarRequisicion />
                : null
            }
        </div>
    ) 
}