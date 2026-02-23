import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import * as actions from '../../../../../store/action/action';
import ItemNecesidad from './itemNecesidad';
import DetalleItem from './detalleItem';
import DetalleProveedor from './detalleProveedor';
import { ItemNecesidad as ItemNecesidadType, MedidasCalculadas } from '../types';
import NuevaOrdenCompra from '../ordenCompra/nueva';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ItemNecesidadMP from './itemNecesidadMP';

export default function NecesidadRequisicion(){
    const dispatch = useDispatch();
    const realData = useSelector((state: any) => state.requisicion.realProyectosRequisicion);
    const lineas = useSelector((state: any) => state.system?.lineas || []);
    const req = useSelector((state: any) => state.requisicion);
    const ids = req.requisicionesSeleccionadas || req.ids || [];
    
    
    // Crear un mapa de ID de línea -> nombre de línea para búsqueda rápida
    const mapaLineas = useMemo(() => {
        const mapa = new Map<string | number, string>();
        if (lineas && Array.isArray(lineas)) {
            lineas.forEach((linea: any) => {
                const id = linea.id;
                const nombre = linea.name || linea.nombre;
                if (id && nombre) {
                    mapa.set(id, nombre);
                    // También mapear por string del ID por si acaso
                    mapa.set(String(id), nombre);
                }
            });
        }
        return mapa;
    }, [lineas]);
    
    // Mapear datos del backend (consolidado) a la estructura esperada
    const items = useMemo(() => {
        if (!realData || !realData.consolidado) return [];
        
        return realData.consolidado
            .filter((item: any) => item.tipo === 'materia' || item.tipo === 'producto')
            .map((item: any) => {
                // Obtener precio unitario
                let precioUnitario = 0;
                if (item.precios && Array.isArray(item.precios) && item.precios.length > 0) {
                    const activePrice = item.precios.find((p: any) => p.state === 'active') || item.precios[0];
                    precioUnitario = Number(activePrice?.precio || activePrice?.price || activePrice?.valor || 0);
                }
                
                // Obtener categoría desde línea - usar el nombre real de las líneas del estado
                let categoria = 'General';
                if (item.linea && typeof item.linea === 'object') {
                    categoria = item.linea.name || item.linea.nombre || 'General';
                } else if (typeof item.linea === 'string' || typeof item.linea === 'number') {
                    // Buscar el nombre real en el mapa de líneas
                    const nombreLinea = mapaLineas.get(item.linea) || mapaLineas.get(String(item.linea));
                    categoria = nombreLinea || 'General';
                }
                
                // Formatear medida original
                let medidaOriginal = '';
                if (item.medida && item.unidad) {
                    if (item.unidad === 'mt2') {
                        if(item.tipo === 'producto'){
                            medidaOriginal = `${item.medida}`;
                        }else{
                            medidaOriginal = `${item.cantidad}`;
                        }
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
                    precioUnitario,
                    categoria
                };
            });
    }, [realData, mapaLineas]);
    
    // Obtener categorías solo de las líneas que tienen items
    const categoriasDisponibles = useMemo(() => {
        const categorias = ['Todas'];
        
        // Primero, obtener las categorías únicas de los items
        const categoriasDeItems = new Set<string>();
        items.forEach((item: any) => {
            if (item.categoria) {
                categoriasDeItems.add(item.categoria);
            }
        });
        
        // Si hay líneas en el estado, mapear los nombres de las líneas que coinciden con las categorías de los items
        if (lineas && Array.isArray(lineas) && lineas.length > 0) {
            lineas.forEach((linea: any) => {
                const nombreLinea = linea.name || linea.nombre || (typeof linea === 'string' ? linea : `Línea ${linea.id || ''}`);
                // Solo agregar si esta línea está presente en los items
                if (nombreLinea && categoriasDeItems.has(nombreLinea)) {
                    categorias.push(nombreLinea);
                }
            });
            
            // Si hay categorías en items que no están en las líneas del estado, agregarlas también
            categoriasDeItems.forEach((cat: string) => {
                if (!categorias.includes(cat)) {
                    categorias.push(cat);
                }
            });
        } else {
            // Fallback: si no hay líneas en el estado, usar las de los items
            categorias.push(...Array.from(categoriasDeItems));
        }
        
        return categorias;
    }, [lineas, items]);
    
    // Obtener nombre del proyecto seleccionado
    const proyectoSeleccionado = useMemo(() => {
        if (!realData || !realData.proyectos || realData.proyectos.length === 0) return '';
        const req = realData.proyectos[0];
        const cotizacion = req.cotizacion || {};
        return cotizacion.name || `Requisición ${req.id}`;
    }, [realData]);

    const [searchText, setSearchText] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
    const [estadoFiltro, setEstadoFiltro] = useState<'Todos' | 'Comprado' | 'Parcialmente comprado' | 'Sin comprar'>('Todos');
    const [itemSeleccionado, setItemSeleccionado] = useState<ItemNecesidadType | null>(null);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState<any | null>(null);
    const [panelOrdenAbierto, setPanelOrdenAbierto] = useState(false);
    const [itemsSeleccionados, setItemsSeleccionados] = useState<string[]>([]);
    const [ultimoItemSeleccionado, setUltimoItemSeleccionado] = useState<string | null>(null);

    // Función helper para generar clave única: id-medida
    const getItemKey = (item: ItemNecesidadType): string => {
        return `${item.id}-${item.medida}`;
    };

    // Atajos de teclado - letras T, C, P, S cuando no hay input activo
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Verificar si hay input activo
            const target = event.target as HTMLElement;
            const isInputActive = target && (
                target.tagName === 'INPUT' || 
                target.tagName === 'TEXTAREA' || 
                target.isContentEditable ||
                target.closest('input') ||
                target.closest('textarea')
            );

            // Ctrl + Shift + O para abrir la nueva orden de compra
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && (event.key.toLowerCase() === 'o' || event.code === 'KeyO')) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation?.();
                setPanelOrdenAbierto(true);
                return;
            }

            // Solo procesar letras si NO hay input activo y NO hay modificadores
            if (!isInputActive && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
                const key = event.key.toLowerCase();
                
                // Letras T, C, P, S para filtrar por estado
                if (key === 't' || event.code === 'KeyT') {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation?.();
                    setEstadoFiltro('Todos');
                    return;
                }
                if (key === 'c' || event.code === 'KeyC') {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation?.();
                    setEstadoFiltro('Comprado');
                    return;
                }
                if (key === 'p' || event.code === 'KeyP') {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation?.();
                    setEstadoFiltro('Parcialmente comprado');
                    return;
                }
                if (key === 's' || event.code === 'KeyS') {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation?.();
                    setEstadoFiltro('Sin comprar');
                    return;
                }
            }
        };

        // Agregar listener con captura
        document.addEventListener('keydown', handleKeyDown, true);
        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
        };
    }, []);

    // Función para manejar el click en un proveedor
    const handleProveedorClick = (proveedor: any) => {
        // Solo pasar los datos básicos, el componente DetalleProveedor cargará los datos desde el backend
        setProveedorSeleccionado({
            id: proveedor.id,
            nombre: proveedor.nombre,
            inicial: proveedor.inicial,
            precio: proveedor.precio
        });
    };

    // Función para recargar los datos del item después de actualizar el precio
    const recargarItemData = () => {
        if (!itemSeleccionado?.id || !itemSeleccionado?.tipo) return;
        
        dispatch(actions.gettingItemRequisicion(false)); // false para carga silenciosa
        
        const body = {
            mpId: itemSeleccionado.id,
            ids: ids
        };
        
        const endpoint = itemSeleccionado.tipo === 'materia-prima' 
            ? '/api/requisicion/get/materiales/materia/'
            : '/api/requisicion/get/materiales/producto/';
        
        axios.post(endpoint, body)
            .then((res) => {
                dispatch(actions.getItemRequisicion(res.data));
                
                // Actualizar el precio del proveedor seleccionado si existe
                if (proveedorSeleccionado && res.data) {
                    const proveedores = itemSeleccionado.tipo === 'materia-prima' 
                        ? res.data.prices || []
                        : res.data.productPrices || [];
                    
                    const proveedorActualizado = proveedores.find((p: any) => 
                        p.proveedor?.id === proveedorSeleccionado.id || p.id === proveedorSeleccionado.id
                    );
                    
                    if (proveedorActualizado) {
                        const nuevoPrecio = proveedorActualizado.precio || proveedorActualizado.price || proveedorActualizado.valor || 0;
                        setProveedorSeleccionado({
                            ...proveedorSeleccionado,
                            precioActual: nuevoPrecio,
                            fechaPrecio: new Date().toISOString()
                        });
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                dispatch(actions.getItemRequisicion(404));
            });
    };

    // ============================================
    // ✅ FUNCIÓN REUTILIZABLE - No necesita cambios
    // ============================================
    // Función para calcular Med. Consumo y Necesidad
    const calcularMedidas = (item: ItemNecesidadType): MedidasCalculadas => {
        let medConsumo = 0;
        let necesidad = 0; 
 
        if (item.unidad === 'mt2') {
            // Para mt2: Med. Consumo es el totalCantidad, Necesidad es la cantidad de piezas
            if(item.tipo == 'materia-prima'){
                medConsumo = item.totalCantidad; 
                const medidaMt2 = item.medida
                necesidad = Math.ceil(item.totalCantidad / medidaMt2);
            }
            else if(item.tipo == 'producto-terminado'){
                // const medidaMt2 = item.medida.split('X').map(v => parseFloat(v)).reduce((a, b) => a * b, 1);
                const medidaMt2 = item.medida;
                medConsumo = item.totalCantidad; 
                
                necesidad = Math.ceil(item.totalCantidad);
            }
        }else if(item.unidad === 'mt') {
            medConsumo = item.totalCantidad;
            necesidad = Math.ceil(item.totalCantidad / item.medida);
        
        } else if (item.unidad === 'ml') {
            // Para ml: similar a mt2
            medConsumo = item.totalCantidad;
            necesidad = Math.ceil(item.totalCantidad / item.medida);
        } else if (item.unidad === 'kg') {
            // Para kg: Med. Consumo es el total, Necesidad es la cantidad
            medConsumo = item.totalCantidad;
            necesidad = Math.ceil(item.totalCantidad);
        } else {
            // Para unidades: Med. Consumo es el total, Necesidad es la cantidad
            medConsumo = item.totalCantidad;
            necesidad = item.totalCantidad;
        }

        return { medConsumo, necesidad };
    };

    // Función helper para calcular el estado de un item
    const calcularEstadoItem = (item: ItemNecesidadType): 'Comprado' | 'Parcialmente comprado' | 'Sin comprar' => {
        const { necesidad } = calcularMedidas(item);
        const entregado = item.entregado || 0;
        const falta = Math.max(0, necesidad - entregado);
        const faltaPorComprar = falta;
        
        if (faltaPorComprar <= 0.09) return 'Comprado';
        if (entregado <= 0) return 'Sin comprar';
        return 'Parcialmente comprado';
    };

    // Filtrar items
    const itemsFiltrados = useMemo(() => {
        return items.filter(item => {
            // Filtro por búsqueda (ID o nombre)
            const searchLower = searchText.toLowerCase();
            const matchSearch = 
                item.id.toString().includes(searchText) ||
                item.nombre.toLowerCase().includes(searchLower);

            // Filtro por categoría
            const matchCategoria = 
                categoriaSeleccionada === 'Todas' || 
                item.categoria === categoriaSeleccionada;

            // Filtro por estado
            const estadoItem = calcularEstadoItem(item);
            const matchEstado = 
                estadoFiltro === 'Todos' || 
                estadoItem === estadoFiltro;

            return matchSearch && matchCategoria && matchEstado;
        });
    }, [items, searchText, categoriaSeleccionada, estadoFiltro]);

    // Calcular total de inversión faltante (solo lo que falta por comprar)
    const totalInversion = useMemo(() => {
        return itemsFiltrados.reduce((total, item) => {
            const { necesidad } = calcularMedidas(item);
            const entregado = item.entregado || 0;
            const falta = Math.max(0, necesidad - entregado); // Solo lo que falta
            const precioUnitarioReal = item.unidad == 'kg' ? item.precioUnitario / item.medida : item.unidad === 'mt2' && item.tipo == 'producto-terminado' ? Number(item.precioUnitario * item.medida).toFixed(0) : item.precioUnitario;
            return total + (precioUnitarioReal * falta);
        }, 0); 
    }, [itemsFiltrados]);

    // Calcular total de inversión faltante solo para items seleccionados
    const totalInversionSeleccionados = useMemo(() => {
        const itemsSeleccionadosData = itemsFiltrados.filter(item => itemsSeleccionados.includes(getItemKey(item)));
        return itemsSeleccionadosData.reduce((total, item) => {
            const { necesidad } = calcularMedidas(item);
            const entregado = item.entregado || 0;
            const falta = Math.max(0, necesidad - entregado);
            let precioUnitarioReal = item.unidad == 'kg' ? item.precioUnitario / item.medida : item.unidad === 'mt2' && item.tipo == 'producto-terminado' ? Number(item.precioUnitario * item.medida).toFixed(0) : item.precioUnitario;
            return total + (Number(precioUnitarioReal) * falta);
        }, 0);
    }, [itemsSeleccionados, itemsFiltrados]);

    // Manejar Ctrl+Click para seleccionar/deseleccionar
    const handleCtrlClick = (item: ItemNecesidadType) => {
        const itemKey = getItemKey(item);
        setItemsSeleccionados(prev => {
            if (prev.includes(itemKey)) {
                const nuevos = prev.filter(key => key !== itemKey);
                if (nuevos.length === 0) {
                    setUltimoItemSeleccionado(null);
                }
                return nuevos;
            } else {
                setUltimoItemSeleccionado(itemKey);
                return [...prev, itemKey];
            }
        });
    };

    // Manejar Shift+Click para seleccionar rango
    const handleShiftClick = (item: ItemNecesidadType, index: number) => {
        if (ultimoItemSeleccionado === null) {
            handleCtrlClick(item);
            return;
        }

        const ultimoIndex = itemsFiltrados.findIndex(item => getItemKey(item) === ultimoItemSeleccionado);
        if (ultimoIndex === -1) {
            handleCtrlClick(item);
            return;
        }

        const inicio = Math.min(ultimoIndex, index);
        const fin = Math.max(ultimoIndex, index);
        
        const keysParaSeleccionar = itemsFiltrados
            .slice(inicio, fin + 1)
            .map(item => getItemKey(item));

        setItemsSeleccionados(prev => {
            const nuevos = [...new Set([...prev, ...keysParaSeleccionar])];
            return nuevos;
        });
        setUltimoItemSeleccionado(getItemKey(item));
    };

    // Función para generar PDF para proveedores (sin precios)
    const generarPDFProveedores = () => {
        const itemsSeleccionadosData = itemsFiltrados.filter(item => itemsSeleccionados.includes(getItemKey(item)));
        
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();

        // Título
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Lista de Materiales - Proveedores', pageWidth / 2, 20, { align: 'center' });
        
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

        // Encabezados de tabla
        const head = [['ID', 'Nombre', 'Medida', 'Cantidad Necesaria', 'Unidad']];
        
        // Filas de datos
        const body = itemsSeleccionadosData.map(item => {
            const { necesidad } = calcularMedidas(item);
            const entregado = item.entregado || 0;
            const falta = Math.max(0, necesidad);
            
            return [
                item.id.toString(),
                item.nombre,
                item.medidaOriginal,
                falta.toString(),
                item.unidad
            ];
        });

        // Generar tabla de materiales
        autoTable(doc, {
            startY: startY,
            head: head,
            body: body,
            styles: { fontSize: 9, cellPadding: 3 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            margin: { left: 8, right: 8 }
        });

        // Guardar PDF
        doc.save(`Lista_Materiales_Proveedores_${new Date().getTime()}.pdf`);
    };

    // Función para generar PDF General (con precios y proyectos)
    const generarPDFGeneral = () => {
        const itemsSeleccionadosData = itemsFiltrados.filter(item => itemsSeleccionados.includes(getItemKey(item)));
        const proyectosCount = realData?.proyectos?.length || 0;
        
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();

        // Título
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Consolidado - Materiales Seleccionados', pageWidth / 2, 20, { align: 'center' });
        
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

        // Encabezados de tabla
        const head = [['ID', 'Nombre', 'Medida', 'Unidad', 'Entregado', 'Necesidad', 'Precio Unitario', 'inversión faltante']];
        
        // Filas de datos
        const body = itemsSeleccionadosData.map(item => {
            const { necesidad } = calcularMedidas(item);
            const entregado = item.entregado || 0;
            const falta = Math.max(0, necesidad);
            let precioUnitarioReal = item.unidad == 'kg' ? item.precioUnitario / item.medida : item.unidad === 'mt2' && item.tipo == 'producto-terminado' ? Number(item.precioUnitario * item.medida).toFixed(0) : item.precioUnitario;
            const total = Number(precioUnitarioReal) * Number(necesidad - item.entregado);


            const diferencia = falta - entregado;
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

        // Tabla de totales
        const finalY = (doc as any).lastAutoTable ? ((doc as any).lastAutoTable.finalY as number) + 8 : 32;
        const fmt = (v: number) => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(v);
        
        const totalesHead = [['Concepto', 'Valor']];
        const totalesBody = [
            ['Total Faltante', `$${fmt(totalInversionSeleccionados)} COP`],
            ['Cantidad de Items', itemsSeleccionadosData.length.toString()]
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

        // Guardar PDF
        doc.save(`Consolidado_General_${new Date().getTime()}.pdf`);
    };

    return (
        <div className={`necesidadRequisicion ${itemSeleccionado ? 'panelAbierto' : ''} ${proveedorSeleccionado ? 'panelProveedorAbierto' : ''}`}>
            <div className="containerNecesidad">
                <div className="headerNecesidad">
                    <div className="leftHeader">
                        <h1>Materia prima</h1>
                        <span>Lista de materia prima requerida {itemsFiltrados.length}</span>
                    </div>
                    <div className="rightHeader">
                        <h3 className="proyectoSeleccionado">{proyectoSeleccionado}</h3>
                        {/* <button
                            className="btnPrimario"
                            type="button"
                            onClick={() => setPanelOrdenAbierto(true)}
                            style={{ marginLeft: '12px' }}
                        >
                            Nueva orden de compra
                        </button> */}
                    </div>
                </div>
                <div className="filtrosNecesidad">
                    <input
                        type="text"
                        placeholder="Buscar aquí"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="inputBuscar"
                    />
                    <select
                        value={categoriaSeleccionada}
                        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                        className="selectCategoria"
                    >
                        {categoriasDisponibles.map(cat => (
                            <option key={cat} value={cat}>
                                {cat === 'Todas' ? 'Selecciona una categoría' : cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtros por estado */}
                <div className="filtrosEstado">
                    <button
                        className={`filtroEstadoBtn ${estadoFiltro === 'Todos' ? 'active' : ''}`}
                        onClick={() => setEstadoFiltro('Todos')}
                        type="button"
                        title="Filtrar todos (T)"
                    >
                        Todos
                    </button>
                    <button
                        className={`filtroEstadoBtn ${estadoFiltro === 'Comprado' ? 'active' : ''}`}
                        onClick={() => setEstadoFiltro('Comprado')}
                        type="button"
                        title="Filtrar comprados (C)"
                    >
                        Comprado
                    </button>
                    <button
                        className={`filtroEstadoBtn ${estadoFiltro === 'Parcialmente comprado' ? 'active' : ''}`}
                        onClick={() => setEstadoFiltro('Parcialmente comprado')}
                        type="button"
                        title="Filtrar parcialmente comprados (P)"
                    >
                        Parcialmente comprado
                    </button>
                    <button
                        className={`filtroEstadoBtn ${estadoFiltro === 'Sin comprar' ? 'active' : ''}`}
                        onClick={() => setEstadoFiltro('Sin comprar')}
                        type="button"
                        title="Filtrar sin comprar (S)"
                    >
                        Sin comprar
                    </button>
                </div>

                <div className="tablaNecesidad">
                    <div className="headerTabla">
                        <div className="colItem">Item</div>
                        <div className="colMedConsumo">Med. Consumo</div>
                        <div className="colNecesidad">Necesidad</div>
                        <div className="colPrecio">Precio / U</div>
                        <div className="colTotal">Total promedio</div>
                        <div className="colTotal">Falta por comprar</div>

                    </div>
                    <div className="itemsTabla">
                        {itemsFiltrados.map((item, index) => {
                            const { medConsumo, necesidad } = calcularMedidas(item);
                            const entregado = item.entregado || 0;
                            const falta = Math.max(0, necesidad - entregado);
                            let precioUnitarioReal = item.unidad == 'kg' ? item.precioUnitario / item.medida : item.unidad === 'mt2' && item.tipo == 'producto-terminado' ? Number(item.precioUnitario * item.medida).toFixed(0) : item.precioUnitario;
                            const totalPromedio = precioUnitarioReal * necesidad;
                            const faltaPorComprar = falta > 0 ? precioUnitarioReal * falta : 0;
                            return (
                                item.unidad == 'mt2' && item.tipo == 'materia-prima' ?
                                <ItemNecesidadMP
                                    key={getItemKey(item)}
                                    item={item}
                                    index={index}
                                    medConsumo={medConsumo}
                                    necesidad={necesidad}
                                    entregado={entregado}
                                    falta={falta}
                                    precioUnitario={precioUnitarioReal}
                                    totalPromedio={totalPromedio}
                                    faltaPorComprar={faltaPorComprar}
                                    onClick={() => setItemSeleccionado(item)}
                                    isSelected={itemsSeleccionados.includes(getItemKey(item))}
                                    onCtrlClick={() => handleCtrlClick(item)}
                                    onShiftClick={() => handleShiftClick(item, index)}
                                />
                                :
                                <ItemNecesidad
                                    key={getItemKey(item)}
                                    item={item}
                                    index={index}
                                    medConsumo={medConsumo}
                                    necesidad={necesidad}
                                    entregado={entregado}
                                    falta={falta}
                                    precioUnitario={precioUnitarioReal}
                                    totalPromedio={totalPromedio}
                                    faltaPorComprar={faltaPorComprar}
                                    onClick={() => setItemSeleccionado(item)}
                                    isSelected={itemsSeleccionados.includes(getItemKey(item))}
                                    onCtrlClick={() => handleCtrlClick(item)}
                                    onShiftClick={() => handleShiftClick(item, index)}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="footerNecesidad">
                    <div className="totalInversion">
                        <span>Inversión faltante apróximada</span>
                        <h2>${new Intl.NumberFormat('es-CO').format(totalInversion)}</h2>
                    </div>
                </div>
            </div>
            
            {/* Overlay oscuro cuando algún panel está abierto */}
            {(itemSeleccionado || proveedorSeleccionado) && (
                <div 
                    className="overlayPanel" 
                    onClick={() => {
                        setItemSeleccionado(null);
                        setProveedorSeleccionado(null);
                    }}
                />
            )}
            
            {/* Panel lateral izquierdo - Detalles del proveedor */}
            <DetalleProveedor 
                proveedor={proveedorSeleccionado} 
                item={itemSeleccionado}
                onClose={() => setProveedorSeleccionado(null)} 
                onUpdate={recargarItemData}
            />
            
            {/* Panel lateral derecho - Detalles del item */}
                <DetalleItem 
                    item={itemSeleccionado} 
                    onClose={() => {
                        setItemSeleccionado(null);
                        setProveedorSeleccionado(null); // Cerrar también el panel del proveedor
                    }}
                    onProveedorClick={handleProveedorClick}
                />

            {/* Panel de nueva orden de compra */}
            <NuevaOrdenCompra
                open={panelOrdenAbierto}
                onClose={() => setPanelOrdenAbierto(false)}
            />

            {/* Barra flotante cuando hay items seleccionados */}
            {itemsSeleccionados.length > 0 && (
                <div className="barraItemsSeleccionados" style={{
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
                    <span>{itemsSeleccionados.length} item(s) seleccionado(s)</span>
                    <span style={{ fontSize: '12px', opacity: 0.9 }}>
                        Total faltante: ${new Intl.NumberFormat('es-CO').format(totalInversionSeleccionados)}
                    </span>
                    <button 
                        onClick={generarPDFProveedores}
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
                        PDF Proveedores
                    </button>
                    <button 
                        onClick={generarPDFGeneral}
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
                        PDF General
                    </button>
                    <button 
                        onClick={() => {
                            setItemsSeleccionados([]);
                            setUltimoItemSeleccionado(null);
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
        </div>
    )
}