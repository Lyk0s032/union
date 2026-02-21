import React, { useEffect, useState } from 'react'
import { MdOutlineDragIndicator, MdOutlineMoreVert } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import axios from 'axios'
import * as actions from '../../../../store/action/action'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useSearchParams } from 'react-router-dom'

interface TableReqProps {
    searchText: string;
    activeFilter: string;
    requisiciones: any[];
    modoSeleccionMultiple: boolean;
    setModoSeleccionMultiple: (value: boolean) => void;
}

export default function TableReq({ searchText, activeFilter, requisiciones: initialRequisiciones, modoSeleccionMultiple, setModoSeleccionMultiple }: TableReqProps) {
    const [openMenuId, setOpenMenuId] = useState(null);
    const [activeId, setActiveId] = useState(null);
    const [ultimaSeleccionada, setUltimaSeleccionada] = useState<number | null>(null);
    const [modalEditarFecha, setModalEditarFecha] = useState<{ open: boolean; requisicionId: number | null }>({ open: false, requisicionId: null });
    const dispatch = useDispatch();
    const requisicionesSeleccionadas = useSelector((state: any) => state.requisicion.requisicionesSeleccionadas);
    // Estado separado para la selección VISUAL (solo cuando se usa Ctrl+Click)
    const [requisicionesSeleccionadasVisual, setRequisicionesSeleccionadasVisual] = useState<number[]>([]);
    
    // Limpiar última seleccionada cuando no hay selecciones visuales
    useEffect(() => {
        if (requisicionesSeleccionadasVisual.length === 0) {
            setUltimaSeleccionada(null);
        }
    }, [requisicionesSeleccionadasVisual]);
    
    // Sincronizar selección visual con Redux solo cuando se activa/desactiva modoSeleccionMultiple
    // No sincronizar cuando cambia requisicionesSeleccionadas para evitar sobrescribir selecciones del usuario
    useEffect(() => {
        if (!modoSeleccionMultiple) {
            setRequisicionesSeleccionadasVisual([]);
        } else if (requisicionesSeleccionadas.length > 0 && requisicionesSeleccionadasVisual.length === 0) {
            // Solo sincronizar si el modo se activa y hay selecciones en Redux pero no en visual
            // Esto evita sobrescribir cuando el usuario está interactuando
            setRequisicionesSeleccionadasVisual(requisicionesSeleccionadas);
        }
    }, [modoSeleccionMultiple]);

    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openMenuId !== null && !event.target.closest('.menu-containerReq')) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMenuId]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Usar las requisiciones que vienen como prop
    const [requisiciones, setRequisiciones] = useState(initialRequisiciones);

    // Actualizar cuando cambien las requisiciones iniciales
    useEffect(() => {
        setRequisiciones(initialRequisiciones);
    }, [initialRequisiciones]);

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (active.id !== over?.id) {
            setRequisiciones((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    // Función para filtrar por estado
    const filterByEstado = (req) => {
        switch (activeFilter) {
            case 'sin-comprar':
                return req.estado === 'Pendiente' || req.estado === 'pendiente';
            case 'parcialmente':
                return req.estado === 'En proceso' || req.estado === 'comprando';
            case 'finalizadas':
                return req.estado === 'comprado' || req.estado === 'Aprobada' || 
                       req.estado === 'completada' || req.estado === 'aprobada';
            case 'todas':
            default:
                return true;
        }
    };

    // Función para buscar por código o nombre del proyecto
    const searchFilter = (req) => {
        if (!searchText || !searchText.trim()) return true;
    
        const searchLower = searchText.toLowerCase().trim();

        // 1. Convertimos la operación matemática a String para poder buscar
        // Validar que req.codigo sea numérico antes de calcular
        const codigoNum = Number(req.codigo);
        const codigoCalculado = !isNaN(codigoNum) ? String(codigoNum + 21719) : '';
        
        // 2. Verificamos coincidencias
        const codigoMatch = codigoCalculado ? codigoCalculado.includes(searchLower) : false;
        const proyectoMatch = req.proyecto?.toLowerCase().includes(searchLower);
        
        return codigoMatch || proyectoMatch;
    };

    // Aplicar filtros
    const requisicionesFiltradas = requisiciones.filter(req => {
        return filterByEstado(req) && searchFilter(req);
    });
    const activeItem = requisicionesFiltradas.find((item) => item.id === activeId);

    // Función para abrir modal de editar fecha
    const handleAbrirModalEditarFecha = (requisicionId: number) => {
        setModalEditarFecha({ open: true, requisicionId });
        setOpenMenuId(null);
    };

    return (
        <div className="tableReq">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <table>
                    <thead>
                        <tr>
                            <th className='check'></th>
                            <th className='short'></th>
                            <th className='largeThat'></th>
                            <th className='date'>Creación</th>
                            <th className='date'>Entrega</th>
                            <th className='check'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {requisicionesFiltradas.length > 0 ? (
                            <SortableContext items={requisicionesFiltradas.map((req) => req.id)} strategy={verticalListSortingStrategy}>
                                {requisicionesFiltradas.map((req, index) => (
                                    <SortableRow 
                                        key={req.id} 
                                        req={req} 
                                        index={index}
                                        openMenuId={openMenuId} 
                                        toggleMenu={toggleMenu}
                                        isSelected={requisicionesSeleccionadasVisual.includes(req.id)}
                                        requisicionesSeleccionadasVisual={requisicionesSeleccionadasVisual}
                                        setRequisicionesSeleccionadasVisual={setRequisicionesSeleccionadasVisual}
                                        ultimaSeleccionada={ultimaSeleccionada}
                                        onEditarFecha={handleAbrirModalEditarFecha}
                                        setUltimaSeleccionada={setUltimaSeleccionada}
                                        todasRequisiciones={requisicionesFiltradas}
                                        modoSeleccionMultiple={modoSeleccionMultiple}
                                        setModoSeleccionMultiple={setModoSeleccionMultiple}
                                    />
                                ))}
                            </SortableContext>
                        ) : (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                    <p>No se encontraron requisiciones que coincidan con los filtros aplicados.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <DragOverlay>
                    {activeId && activeItem ? (
                        <div className="dragOverlayRow">
                            <table style={{ width: '100%' }}>
                                <tbody>
                                    <tr>
                                        <td className='check'>
                                            <button>
                                                <MdOutlineDragIndicator className='icon' />
                                            </button>
                                        </td>
                                        <td className='short'>
                                            <div className="number">
                                                <h3>{activeItem.numero}</h3>
                                            </div>
                                        </td>
                                        <td className='largeThat'>
                                            <div className="largeThatContent">
                                                <div className="divideTop">
                                                    <button>
                                                        <span>{activeItem.estado}</span>
                                                    </button> 
                                                    <strong> {Number(Number(activeItem.codigo) + Number(21719))}</strong>
                                                </div>
                                                <div className="containerData">
                                                    <h3>{activeItem.proyecto}</h3>
                                                    <span>{activeItem.cliente}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="date">
                                            <span>{activeItem.fechaCreacion}</span>
                                        </td>
                                        <td className="date">
                                            <span>{activeItem.fechaNecesaria || 'Sin fecha'}</span>
                                        </td>
                                        <td className='check'></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
            {modalEditarFecha.open && (
                <ModalEditarFecha
                    requisicionId={modalEditarFecha.requisicionId}
                    onClose={() => setModalEditarFecha({ open: false, requisicionId: null })}
                    onUpdate={() => {
                        // Recargar requisiciones con false para que no muestre loading
                        (dispatch as any)(actions.axiosToGetRequisicions(false));
                    }}
                />
            )}
        </div>
    )
}

function SortableRow({ req, index, openMenuId, toggleMenu, isSelected, ultimaSeleccionada, setUltimaSeleccionada, todasRequisiciones, modoSeleccionMultiple, setModoSeleccionMultiple, requisicionesSeleccionadasVisual, setRequisicionesSeleccionadasVisual, onEditarFecha }) {
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();
    // Función para abrir la requisición
    const handleAbrirRequisicion = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu(req.id);
        dispatch({ type: 'CLEAR_REQUISICIONES_SELECTION' });
        dispatch({ type: 'SET_REQUISICIONES_SELECCIONADAS', payload: [req.id] });
        setRequisicionesSeleccionadasVisual([]);
        setModoSeleccionMultiple(false);
        params.set('open', 'projects');
        setParams(params);
    };
    
    // Función para calcular medidas (replicada de necesidad.tsx)
    const calcularMedidas = (item: any) => {
        let medConsumo = 0;
        let necesidad = 0;
        
        if (item.unidad === 'mt2') {
            if (item.tipo === 'materia-prima') {
                medConsumo = item.totalCantidad;
                const medidaMt2 = item.medida;
                necesidad = Math.ceil(item.totalCantidad / medidaMt2);
            } else if (item.tipo === 'producto-terminado') {
                const medidaMt2 = item.medida;
                medConsumo = item.totalCantidad;
                necesidad = Math.ceil(item.totalCantidad);
            }
        } else if (item.unidad === 'mt') {
            medConsumo = item.totalCantidad;
            necesidad = Math.ceil(item.totalCantidad / item.medida);
        } else if (item.unidad === 'kg') {
            // Para kg: Med. Consumo es el total, Necesidad es la cantidad (igual que necesidad.tsx)
            medConsumo = item.totalCantidad;
            necesidad = Math.ceil(item.totalCantidad);
        } else {
            medConsumo = item.totalCantidad;
            necesidad = Math.ceil(item.totalCantidad / (item.medida || 1));
        }
        
        return { medConsumo, necesidad };
    };
    
    // Función para generar PDF General sin abrir la requisición
    const handleGenerarPDFGeneral = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu(req.id);
        
        try {
            // Obtener datos de la requisición
            const res = await axios.post('/api/requisicion/get/req/multipleReal/', { ids: [req.id] });
            const realData = res.data;
            
            if (!realData || !realData.consolidado) {
                alert('No se encontraron datos para generar el PDF');
                return;
            }
            
            // Procesar items igual que en necesidad.tsx
            const items = realData.consolidado
                .filter((item: any) => item.tipo === 'materia' || item.tipo === 'producto')
                .map((item: any) => {
                    let precioUnitario = 0;
                    if (item.precios && Array.isArray(item.precios) && item.precios.length > 0) {
                        const activePrice = item.precios.find((p: any) => p.state === 'active') || item.precios[0];
                        precioUnitario = Number(activePrice?.precio || activePrice?.price || activePrice?.valor || 0);
                    }
                    
                    let medidaOriginal = '';
                    if (item.medida && item.unidad) {
                        if (item.unidad === 'mt2') {
                            medidaOriginal = `${item.medida}`;
                        } else {
                            medidaOriginal = `${item.medida}`;
                        }
                    } else {
                        medidaOriginal = `1 ${item.unidad || 'unidad'}`;
                    }
                    
                    return {
                        id: item.id,
                        nombre: item.nombre || `Item ${item.id}`,
                        tipo: item.tipo === 'materia' ? 'materia-prima' : 'producto-terminado',
                        unidad: item.unidad || 'unidad',
                        medida: item.medida || 1,
                        medidaOriginal,
                        totalCantidad: item.totalCantidad || 0,
                        entregado: item.entregado || 0,
                        precioUnitario
                    };
                });
            
            const proyectosCount = realData?.proyectos?.length || 0;
            
            // Generar PDF
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            
            // Título
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('Consolidado - Materiales', pageWidth / 2, 20, { align: 'center' });
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Fecha: ${new Date().toLocaleDateString('es-CO')}`, pageWidth / 2, 27, { align: 'center' });
            
            // Tabla de proyectos seleccionados
            let startY = 35;
            if (realData?.proyectos && Array.isArray(realData.proyectos) && realData.proyectos.length > 0) {
                // Preparar datos de la tabla de proyectos
                const proyectosHead = [['Nombre del Proyecto', 'Cotización', 'Cliente']];
                const proyectosBody = realData.proyectos.map((proyecto: any) => {
                    const cotizacion = proyecto.cotizacion || {};
                    const cliente = cotizacion.client || {};
                    const nombreProyecto = cotizacion.name || proyecto.nombre || `Proyecto ${proyecto.id || ''}`;
                    const codigo = proyecto.codigo || cotizacion.codigo || 0;
                    const numeroCotizacion = Number(codigo) + 21719;
                    const nombreCliente = cliente.name || cliente.nombre || 'N/A';
                    
                    return [
                        nombreProyecto,
                        numeroCotizacion.toString(),
                        nombreCliente
                    ];
                });
                
                // Generar tabla de proyectos (mismo ancho que la tabla de materiales)
                autoTable(doc, {
                    startY: startY,
                    head: proyectosHead,
                    body: proyectosBody,
                    styles: { fontSize: 9, cellPadding: 4 },
                    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                    alternateRowStyles: { fillColor: [250, 250, 250] },
                    margin: { left: 8, right: 8 },
                    theme: 'striped'
                });
                
                startY = (doc as any).lastAutoTable ? ((doc as any).lastAutoTable.finalY as number) + 8 : startY + 20;
            }
            
            const head = [['ID', 'Nombre', 'Medida', 'Unidad', 'Entregado', 'Necesidad', 'Precio Unitario', 'Inversión faltante']];
            
            const body = items.map((item: any) => {
                const { necesidad } = calcularMedidas(item);
                const entregado = item.entregado || 0;
                const falta = Math.max(0, necesidad - entregado);
                let precioUnitarioReal = item.unidad == 'kg' ? item.precioUnitario / item.medida : item.unidad === 'mt2' && item.tipo == 'producto-terminado' ? Number((item.precioUnitario * item.medida).toFixed(0)) : item.precioUnitario;
                
                // Usar exactamente la misma fórmula que en necesidad.tsx
                const diferencia = falta;
                const faltaPorComprar = diferencia > 0.09 ? precioUnitarioReal * diferencia : 0;
                
                const fmt = (v: number) => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(v);
                
                return [
                    item.id.toString(),
                    item.nombre,
                    item.unidad == 'kg' ? item.medidaOriginal / item.medida : item.medidaOriginal,
                    item.unidad,
                    entregado.toString(),
                    falta.toString(),
                    `$${fmt(Number(precioUnitarioReal))}`,
                    `$${fmt(faltaPorComprar)}`
                ];
            });
            
            // Generar tabla de materiales
            autoTable(doc, {
                startY: startY,
                head: head,
                body: body,
                styles: { fontSize: 8, cellPadding: 2 },
                headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                alternateRowStyles: { fillColor: [240, 240, 240] },
                margin: { left: 8, right: 8 }
            });
            
            // Calcular total faltante usando exactamente la misma fórmula que en necesidad.tsx
            const totalFaltante = items.reduce((total: number, item: any) => {
                const { necesidad } = calcularMedidas(item);
                const entregado = item.entregado || 0;
                const falta = Math.max(0, necesidad - entregado);
                let precioUnitarioReal = item.unidad == 'kg' ? item.precioUnitario / item.medida : item.unidad === 'mt2' && item.tipo == 'producto-terminado' ? Number((item.precioUnitario * item.medida).toFixed(0)) : item.precioUnitario;
                
                const diferencia = falta;
                const faltaPorComprar = diferencia > 0.09 ? Number(precioUnitarioReal) * diferencia : 0;
                
                return total + faltaPorComprar;
            }, 0);
            
            // Tabla de totales
            const finalY = (doc as any).lastAutoTable ? ((doc as any).lastAutoTable.finalY as number) + 8 : 32;
            const fmt = (v: number) => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(v);
            
            const totalesHead = [['Concepto', 'Valor']];
            const totalesBody = [
                ['Total Faltante', `$${fmt(totalFaltante)} COP`],
                ['Cantidad de Items', items.length.toString()]
            ];
            
            autoTable(doc, {
                startY: finalY,
                head: totalesHead,
                body: totalesBody,
                styles: { fontSize: 10, cellPadding: 4 },
                headStyles: { fillColor: [52, 73, 94], textColor: 255, fontStyle: 'bold' },
                columnStyles: {
                    0: { fontStyle: 'bold', cellWidth: 'auto' },
                    1: { halign: 'right' }
                },
                margin: { left: 8, right: 8 },
                theme: 'plain'
            });
            
            doc.save(`Consolidado_Requisicion_${req.id}_${new Date().getTime()}.pdf`);
        } catch (error) {
            console.error('Error al generar PDF:', error);
            alert('Error al generar el PDF. Por favor, intente nuevamente.');
        }
    };
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: req.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleRowClick = (e: React.MouseEvent) => {
        // Si es Shift+Click, seleccionar rango
        if (e.shiftKey && ultimaSeleccionada !== null) {
            e.preventDefault();
            e.stopPropagation();
            
            // Encontrar índices de la última seleccionada y la actual
            const ultimaIndex = todasRequisiciones.findIndex((r: any) => r.id === ultimaSeleccionada);
            const actualIndex = index;
            
            // Determinar inicio y fin del rango
            const inicio = Math.min(ultimaIndex, actualIndex);
            const fin = Math.max(ultimaIndex, actualIndex);
            
            // Seleccionar todas las requisiciones en el rango
            const idsParaSeleccionar = todasRequisiciones
                .slice(inicio, fin + 1)
                .map((r: any) => r.id);
            
            dispatch({ 
                type: 'SELECT_RANGE_REQUISICIONES', 
                payload: idsParaSeleccionar 
            });
            
            // Actualizar selección visual
            setRequisicionesSeleccionadasVisual(prev => {
                const nuevas = [...new Set([...prev, ...idsParaSeleccionar])];
                return nuevas;
            });
            
            setUltimaSeleccionada(req.id);
            setModoSeleccionMultiple(true);
        }
        // Si es Ctrl+Click, activar modo selección múltiple y seleccionar/deseleccionar
        else if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            e.stopPropagation();
            dispatch({ type: 'TOGGLE_REQUISICION_SELECTION', payload: req.id });
            // Actualizar selección visual
            const isSelected = requisicionesSeleccionadasVisual.includes(req.id);
            if (isSelected) {
                setRequisicionesSeleccionadasVisual(prev => prev.filter(id => id !== req.id));
            } else {
                setRequisicionesSeleccionadasVisual(prev => [...prev, req.id]);
            }
            setUltimaSeleccionada(req.id);
            setModoSeleccionMultiple(true);
        }
        // Si estamos en modo selección múltiple, los clicks normales también seleccionan/deseleccionan
        else if (modoSeleccionMultiple) {
            e.preventDefault();
            e.stopPropagation();
            dispatch({ type: 'TOGGLE_REQUISICION_SELECTION', payload: req.id });
            // Actualizar selección visual
            const isSelected = requisicionesSeleccionadasVisual.includes(req.id);
            if (isSelected) {
                setRequisicionesSeleccionadasVisual(prev => prev.filter(id => id !== req.id));
            } else {
                setRequisicionesSeleccionadasVisual(prev => [...prev, req.id]);
            }
            setUltimaSeleccionada(req.id);
        }
        // Click normal sin modo selección: abrir la modal con una sola requisición (NO seleccionar visualmente)
        else {
            e.preventDefault();
            e.stopPropagation();
            // NO tocar requisicionesSeleccionadasVisual - NO seleccionar visualmente
            // Solo establecer para la API
            dispatch({ type: 'CLEAR_REQUISICIONES_SELECTION' });
            dispatch({ type: 'SET_REQUISICIONES_SELECCIONADAS', payload: [req.id] });
            setRequisicionesSeleccionadasVisual([]); // Limpiar selección visual
            setModoSeleccionMultiple(false);
            params.set('open', 'projects');
            setParams(params);
        }
    };
 
    return (
        <tr 
            ref={setNodeRef} 
            style={style}
            className={`${isDragging ? 'dragging' : ''} ${isSelected ? 'selected' : ''}`}
            onClick={handleRowClick}
        >
            <td className='check'>
                <button
                    {...attributes}
                    {...listeners}
                    className="dragHandle"
                    style={{ cursor: 'grab' }}
                >
                    <MdOutlineDragIndicator className='icon' />
                </button>
            </td>
                            <td className='short'>
                                <div className="number">
                                    <h3>{req.numero}</h3>
                                </div>
                            </td>
                            <td className='largeThat'>
                                <div className="largeThatContent">
                                    <div className="divideTop">
                                        <button>
                                            <span>{req.estado}</span>
                                        </button>
                                        <strong>{Number(Number(req.codigo) + Number(21719))}</strong>
                                    </div>
                                    <div className="containerData">
                                        <h3>{req.proyecto}</h3>
                                        <span>{req.cliente}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="date">
                                <span>{req.fechaCreacion}</span>
                            </td>
                            <td className="date">
                                <span>{req.fechaNecesaria}</span>
                            </td> 
                            <td className='check'>
                                <div className="menu-containerReq">
                                    <button 
                                        className="btnOptions"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleMenu(req.id);
                                        }}
                                        aria-haspopup="true"
                                        aria-expanded={openMenuId === req.id}
                                        aria-label="Opciones del elemento"
                                    >
                                        <MdOutlineMoreVert className='icon' />
                                    </button>

                                    {openMenuId === req.id && (
                                        <div
                                            className="menu-dropdown"
                                            role="menu"
                                            aria-orientation="vertical"
                                            aria-labelledby={`menu-button-${req.id}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                        >
                                            <div className="panel">
                                                <div className="title">
                                                    <strong>Opciones rápidas</strong>
                                                </div>
                                                <nav>
                                                    <ul>
                                                        <li onClick={handleAbrirRequisicion}>
                                                            <div>
                                                                <span>Abrir</span>
                                                            </div>
                                                        </li>
                                                        <li onClick={handleGenerarPDFGeneral}>
                                                            <div>
                                                                <span>Ver presupuesto <strong>(Shift + clic)</strong></span>
                                                            </div>
                                                        </li>
                                                        <li onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            toggleMenu(req.id);
                                                            // Activar modo selección múltiple y seleccionar/deseleccionar
                                                            dispatch({ type: 'TOGGLE_REQUISICION_SELECTION', payload: req.id });
                                                            // Actualizar selección visual
                                                            const isSelected = requisicionesSeleccionadasVisual.includes(req.id);
                                                            if (isSelected) {
                                                                setRequisicionesSeleccionadasVisual(prev => prev.filter(id => id !== req.id));
                                                            } else {
                                                                setRequisicionesSeleccionadasVisual(prev => [...prev, req.id]);
                                                            }
                                                            setUltimaSeleccionada(req.id);
                                                            setModoSeleccionMultiple(true);
                                                        }}>
                                                            <div>
                                                                <span>Seleccionar  <strong>(Ctrl + clic)</strong></span>
                                                            </div>
                                                        </li>
                                                        <li onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleMenu(req.id);
                                                            if (onEditarFecha) {
                                                                onEditarFecha(req.id);
                                                            }
                                                        }}>
                                                            <div>
                                                                <span>Editar fecha de requisición <strong>(Alt + clic)</strong></span>
                                                            </div>
                                                        </li>
                                                        <li onClick={() => {
                                                            toggleMenu(req.id);
                                                            console.log('Eliminar item:', req.id);
                                                        }}>
                                                            <div>
                                                                <span>Eliminar</span>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
    );
}

// Componente Modal para editar fecha de requisición
function ModalEditarFecha({ requisicionId, onClose, onUpdate }: { requisicionId: number | null; onClose: () => void; onUpdate: () => void }) {
    const [fechaBase, setFechaBase] = useState<string>('');
    const [diasHabiles, setDiasHabiles] = useState<string>('0');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!requisicionId || !fechaBase) {
            (dispatch as any)(actions.HandleAlerta('Debes seleccionar una fecha base', 'mistake'));
            return;
        }

        const dias = parseInt(diasHabiles) || 0;
        if (dias < 0) {
            (dispatch as any)(actions.HandleAlerta('Los días hábiles deben ser un número positivo', 'mistake'));
            return;
        }

        setLoading(true);
        try {
            const body = {
                requisicionId: requisicionId,
                fecha: fechaBase,
                necesaria: dias
            };

            await axios.put('/api/requisicion/put/update/requisicion/times', body);
            
            (dispatch as any)(actions.HandleAlerta('Fecha actualizada correctamente', 'positive'));
            onUpdate();
            onClose();
        } catch (error: any) {
            console.error('Error al actualizar fecha:', error);
            (dispatch as any)(actions.HandleAlerta('No se pudo actualizar la fecha', 'mistake'));
        } finally {
            setLoading(false);
        }
    };

    // Obtener fecha de hoy como valor por defecto
    const today = new Date().toISOString().split('T')[0];

    // Calcular fecha resultante
    const calcularFechaResultante = () => {
        if (!fechaBase) return '';
        const dias = parseInt(diasHabiles) || 0;
        if (dias === 0) return fechaBase;
        
        const fecha = new Date(fechaBase);
        let diasSumados = 0;
        let diasHabilesSumados = 0;
        
        // Sumar días hábiles (excluyendo sábados y domingos)
        while (diasHabilesSumados < dias) {
            fecha.setDate(fecha.getDate() + 1);
            diasSumados++;
            const diaSemana = fecha.getDay();
            if (diaSemana !== 0 && diaSemana !== 6) { // No es domingo (0) ni sábado (6)
                diasHabilesSumados++;
            }
        }
        
        return fecha.toISOString().split('T')[0];
    };

    const fechaResultante = calcularFechaResultante();
    const fechaFormateada = fechaResultante 
        ? new Date(fechaResultante).toLocaleDateString('es-CO', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
        : '';

    return (
        <div className="modal" style={{ zIndex: 10000 }}>
            <div 
                className="hiddenModal" 
                onClick={onClose}
            ></div>
            <div className="containerModal" style={{ 
                maxWidth: '550px',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
            }}>
                <div className="top" style={{ 
                    padding: '25px 30px',
                    borderBottom: '1px solid #e8e8e8',
                    background: 'linear-gradient(135deg, #2980b9 0%, #3498db 100%)'
                }}>
                    <h3 style={{ 
                        color: '#fff', 
                        margin: 0, 
                        fontSize: '20px',
                        fontWeight: '600',
                        letterSpacing: '0.3px'
                    }}>
                        Editar fecha de requisición
                    </h3>
                </div>
                <div className="bodyModal" style={{ padding: '30px' }}>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="inputDiv" style={{ marginBottom: '25px' }}>
                            <label htmlFor="fechaBase" style={{ 
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#2c3e50',
                                marginBottom: '8px',
                                display: 'block',
                                letterSpacing: '0.3px'
                            }}>
                                Fecha base
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="date"
                                    id="fechaBase"
                                    value={fechaBase || today}
                                    onChange={(e) => setFechaBase(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 15px',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        color: '#2c3e50',
                                        background: '#fff',
                                        boxSizing: 'border-box',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#2980b9';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(41, 128, 185, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e0e0e0';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        </div>
                        
                        <div className="inputDiv" style={{ marginBottom: '25px' }}>
                            <label htmlFor="diasHabiles" style={{ 
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#2c3e50',
                                marginBottom: '8px',
                                display: 'block',
                                letterSpacing: '0.3px'
                            }}>
                                Días hábiles a sumar
                            </label>
                            <input
                                type="number"
                                id="diasHabiles"
                                min="0"
                                value={diasHabiles}
                                onChange={(e) => setDiasHabiles(e.target.value)}
                                placeholder="Ejemplo: 5"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    color: '#2c3e50',
                                    background: '#fff',
                                    boxSizing: 'border-box',
                                    transition: 'all 0.3s ease',
                                    fontFamily: 'inherit'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#2980b9';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(41, 128, 185, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e0e0e0';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            {fechaResultante && (
                                <div style={{
                                    marginTop: '15px',
                                    padding: '15px',
                                    background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0'
                                }}>
                                    <div style={{ 
                                        fontSize: '12px', 
                                        color: '#7f8c8d',
                                        marginBottom: '5px',
                                        fontWeight: '500'
                                    }}>
                                        Fecha resultante:
                                    </div>
                                    <div style={{ 
                                        fontSize: '16px', 
                                        color: '#2980b9',
                                        fontWeight: '600',
                                        textTransform: 'capitalize'
                                    }}>
                                        {fechaFormateada}
                                    </div>
                                    <div style={{ 
                                        fontSize: '11px', 
                                        color: '#95a5a6',
                                        marginTop: '8px',
                                        fontStyle: 'italic'
                                    }}>
                                        Se sumarán {diasHabiles || 0} días hábiles a la fecha base
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div style={{ 
                            display: 'flex', 
                            gap: '12px', 
                            justifyContent: 'flex-end', 
                            marginTop: '30px',
                            paddingTop: '20px',
                            borderTop: '1px solid #e8e8e8'
                        }}>
                            <button
                                type="button"
                                onClick={onClose}
                                style={{
                                    background: '#fff',
                                    border: '2px solid #e0e0e0',
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    color: '#7f8c8d',
                                    opacity: loading ? 0.5 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        e.currentTarget.style.borderColor = '#bdc3c7';
                                        e.currentTarget.style.background = '#f8f9fa';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#e0e0e0';
                                    e.currentTarget.style.background = '#fff';
                                }}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                style={{
                                    background: loading ? '#95a5a6' : 'linear-gradient(135deg, #2980b9 0%, #3498db 100%)',
                                    border: 'none',
                                    padding: '12px 28px',
                                    borderRadius: '8px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    color: '#fff',
                                    boxShadow: loading ? 'none' : '0 4px 12px rgba(41, 128, 185, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(41, 128, 185, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(41, 128, 185, 0.3)';
                                }}
                                disabled={loading}
                            >
                                {loading ? 'Actualizando...' : 'Actualizar fecha'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}