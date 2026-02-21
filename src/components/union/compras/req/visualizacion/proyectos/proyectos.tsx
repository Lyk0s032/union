import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ItemProyecto from './itemProyecto';
import { Proyecto } from '../types';

// Función para calcular el costo total del proyecto basado en necesidadProyectos
function calcTotal(project: any) {
    if (!project || !Array.isArray(project.necesidadProyectos)) return 0;

    return project.necesidadProyectos.reduce((total: number, req: any) => {
        // convertir cantidad a número
        const cantidad = Number(req.cantidadComprometida || 0);

        // precio del kit (campo valor)
        let precio = 0;
        if (req.kit?.priceKits?.length > 0) {
            precio = Number(req.kit.priceKits[0].valor || 0);
        }

        // precio del producto (campo valor)
        if (req.producto?.productPrices?.length > 0) {
            precio = Number(req.producto.productPrices[0].valor || 0);
        }

        return total + (cantidad * precio);
    }, 0);
}

// Función para generar PDF con el historial de compras
function generarPDFCompras(proyecto: any, dataProyecto: any, totalComprado: number, proyectoId: number) {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    // Título
    doc.setFontSize(18);
    doc.text('Historial de Compras del Proyecto', pageWidth / 2, 20, { align: 'center' });
    
    // Información del proyecto
    doc.setFontSize(12);
    doc.text(`Proyecto: ${proyecto.nombre}`, 14, 30);
    doc.text(`Cliente: ${proyecto.cliente}`, 14, 37);
    doc.text(`Cotización: ${21719 + proyecto.cotizacionId}`, 14, 44);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-CO')}`, 14, 51);
    
    // Total comprado
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Comprado: $${new Intl.NumberFormat('es-CO').format(totalComprado)}`, 14, 65);
    doc.setFont('helvetica', 'normal');

    // Obtener órdenes de compra con su valor total (solo items asignados a este proyecto)
    const ordenesCompras: any[] = [];
    
    console.log('🔍 generarPDFCompras - proyectoId:', proyectoId);
    console.log('🔍 generarPDFCompras - dataProyecto.compras:', dataProyecto?.compras);
    
    if (Array.isArray(dataProyecto?.compras)) {
        dataProyecto.compras.forEach((compra: any, index: number) => {
            console.log(`🔍 Procesando compra ${index + 1}:`, compra.id, compra.name);
            
            // Filtrar solo los items que están asignados a este proyecto específico
            const items = compra.comprasCotizacionItems || [];
            let valorAsignadoTotal = 0; // Suma de valorAsignado de items asignados a este proyecto
            let valorTotalOrden = 0; // Suma de precioTotal de todos los items de la orden
            let itemsAsignadosAlProyecto = 0;
            
            console.log(`🔍 Items en compra ${compra.id}:`, items.length);
            
            // Primero calcular el valor total de la orden (todos los items)
            items.forEach((item: any, itemIndex: number) => {
                valorTotalOrden += Number(item.precioTotal || 0);
                
                // Verificar estructura de itemToProjects
                if (itemIndex === 0) {
                    console.log(`🔍 Estructura del primer item:`, {
                        tieneItemToProjects: !!item.itemToProjects,
                        itemToProjects: item.itemToProjects,
                        tipo: Array.isArray(item.itemToProjects) ? 'array' : typeof item.itemToProjects
                    });
                }
            });
            
            // Luego calcular solo el valor asignado a este proyecto
            items.forEach((item: any) => {
                if (Array.isArray(item.itemToProjects)) {
                    item.itemToProjects.forEach((itp: any) => {
                        console.log(`🔍 itemToProject:`, {
                            projectId: itp.projectId,
                            proyectoIdBuscado: proyectoId,
                            coincide: itp.projectId === proyectoId,
                            valorAsignado: itp.valorAsignado
                        });
                        
                        // Intentar diferentes formas de comparar el ID
                        if (itp.projectId === proyectoId || 
                            Number(itp.projectId) === Number(proyectoId) ||
                            String(itp.projectId) === String(proyectoId)) {
                            valorAsignadoTotal += Number(itp.valorAsignado || 0);
                            itemsAsignadosAlProyecto++;
                            console.log(`✅ Item asignado encontrado - valorAsignado: ${itp.valorAsignado}`);
                        }
                    });
                }
            });
            
            console.log(`🔍 Compra ${compra.id} - valorAsignadoTotal: ${valorAsignadoTotal}, itemsAsignados: ${itemsAsignadosAlProyecto}`);
            
            // Solo agregar la orden si tiene items asignados a este proyecto
            if (itemsAsignadosAlProyecto > 0 && valorAsignadoTotal > 0) {
                // Calcular el descuento proporcional basado en el valor asignado vs valor total de la orden
                const descuentoTotal = Number(compra.descuento || 0);
                const descuentoProporcional = valorTotalOrden > 0 ? (valorAsignadoTotal / valorTotalOrden) * descuentoTotal : 0;
                const valorTotal = valorAsignadoTotal - descuentoProporcional;
                
                ordenesCompras.push({
                    numeroOrden: compra.id || 'N/A',
                    nombreOrden: compra.name || 'Sin nombre',
                    proveedor: compra.proveedorId || compra.proveedor?.nombre || 'Sin proveedor',
                    fecha: compra.createdAt || compra.fecha || 'Sin fecha',
                    valorBruto: valorAsignadoTotal,
                    descuento: descuentoProporcional,
                    valorTotal: valorTotal,
                    cantidadItems: itemsAsignadosAlProyecto
                });
                
                console.log(`✅ Orden agregada: ${compra.id} - valorTotal: ${valorTotal}`);
            } else {
                console.log(`⚠️ Orden ${compra.id} NO agregada - itemsAsignados: ${itemsAsignadosAlProyecto}, valorAsignadoTotal: ${valorAsignadoTotal}`);
            }
        });
    } else {
        console.log('⚠️ No hay compras en dataProyecto');
    }
    
    console.log('🔍 Total órdenes encontradas:', ordenesCompras.length);

    // Encabezados de tabla
    const head = [['Orden de Compra', 'Proveedor', 'Valor Bruto', 'Descuento', 'Valor Total']];
    
    // Filas de datos
    const fmt = (v: number) => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(v);
    const body = ordenesCompras.map(orden => {
        const ordenCompleta = `${orden.numeroOrden} - ${orden.nombreOrden}`;
        return [
            ordenCompleta,
            orden.proveedor.toString(),
            `$${fmt(orden.valorBruto)}`,
            `$${fmt(orden.descuento)}`,
            `$${fmt(orden.valorTotal)}`
        ];
    });

    // Generar tabla
    autoTable(doc, {
        startY: 75,
        head: head,
        body: body.length > 0 ? body : [['No hay órdenes de compra registradas', '', '', '', '']],
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { left: 14, right: 14 }
    });

    // Totales al final
    const finalY = (doc as any).lastAutoTable ? ((doc as any).lastAutoTable.finalY as number) + 10 : 75;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen', 14, finalY);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total de órdenes de compra: ${ordenesCompras.length}`, 14, finalY + 8);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total comprado: $${new Intl.NumberFormat('es-CO').format(totalComprado)}`, 14, finalY + 16);

    // Guardar PDF
    const nombreArchivo = `compras-proyecto-${proyecto.id}-${new Date().getTime()}.pdf`;
    doc.save(nombreArchivo);
}

export default function ProyectosRequisicion(){
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState<number | null>(null);
    const [dataProyecto, setDataProyecto] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [totalValorReal, setTotalValorReal] = useState(0);
    const [costoTotalProyecto, setCostoTotalProyecto] = useState(0);
    const realData = useSelector((state: any) => state.requisicion.realProyectosRequisicion);
    
    // Mapear datos del backend a la estructura esperada
    const proyectos = useMemo(() => {
        if (!realData || !realData.proyectos) return [];
        
        return realData.proyectos.map((req: any) => {
            const cotizacion = req.cotizacion || {};
            const cliente = cotizacion.client || {};
            
            // Calcular totales desde los items
            let totalProyecto = 0;
            let totalComprado = 0;
            
            if (req.itemRequisicions && Array.isArray(req.itemRequisicions)) {
                req.itemRequisicions.forEach((item: any) => {
                    const cantidad = Number(item.cantidad || 0);
                    const cantidadEntrega = Number(item.cantidadEntrega || 0);
                    
                    let precio = 0;
                    if (item.materium && item.materium.prices && item.materium.prices.length > 0) {
                        const activePrice = item.materium.prices.find((p: any) => p.state === 'active') || item.materium.prices[0];
                        const precioBase = Number(activePrice?.valor || activePrice?.valor || 0);
                        console.log('precio base', precioBase);
                        
                        // Si la unidad es 'kg', dividir el precio por la medida para obtener precio por kilo
                        if(item?.materium?.unidad == 'kg' && item.materium.medida > 0){
                            precio = precioBase / Number(item.materium.medida);
                            console.log('Precio con kg', precio);
                        } else {
                            console.log('precio base', precioBase);
                            precio = precioBase;
                        }
                    } else if (item.producto && item.producto.productPrices && item.producto.productPrices.length > 0) {
                        const activePrice = item.producto.productPrices.find((p: any) => p.state === 'active') || item.producto.productPrices[0];
                        precio = Number(activePrice?.precio || activePrice?.price || 0);
                    }
                    
                    console.log('item', item);
                    totalProyecto += cantidad * precio + 1000000;
                    totalComprado += cantidadEntrega * precio;
                });
            }
            
            return {
                id: req.id,
                nombre: cotizacion.name || `Requisición ${req.id}`,
                cotizacionId: cotizacion.id || req.id,
                fecha: req.fecha || req.createdAt || new Date().toISOString(),
                estado: req.estado || 'pendiente',
                cliente: cliente.name || cliente.nombre || 'Sin cliente',
                totalProyecto,
                totalComprado,
                totalFaltante: totalProyecto - totalComprado
            };
        });
    }, [realData]);

    // Efecto para cargar los datos cuando se selecciona un proyecto
    useEffect(() => {
        console.log('🔄 useEffect ejecutado - Proyecto seleccionado:', proyectoSeleccionado);
        
        if (!proyectoSeleccionado) {
            console.log('🔄 Limpiando datos del proyecto');
            setDataProyecto(null);
            setTotalValorReal(0);
            setCostoTotalProyecto(0);
            return;
        }

        // Función para obtener los datos del proyecto desde la API
        const getProject = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/requisicion/get/project/get/project/${proyectoSeleccionado}`);
                const d = res.data;
                console.log('📦 Estructura de compras:', d?.compras);
                console.log('📦 necesidadProyectos:', d?.necesidadProyectos);
                console.log('📦 comprasCotizacionItems directo:', d?.comprasCotizacionItems);

                // Calcular el total de valorAsignado desde los itemToProjects (total comprado)
                // Método 1: Desde compras -> comprasCotizacionItems -> itemToProjects -> valorAsignado
                let totalComprado = 0;
                if (Array.isArray(d?.compras)) {
                    d.compras.forEach((compra: any) => {
                        (compra.comprasCotizacionItems || []).forEach((item: any) => {
                            (item.itemToProjects || []).forEach((it: any) => {
                                const v = Number(it.valorAsignado || 0);
                                if (!isNaN(v)) totalComprado += v;
                            });
                        });
                    });
                }
                
                // Método 2 alternativo: Si no hay datos en compras, intentar desde comprasCotizacionItems directamente
                // (como se hace en openProject.jsx con precioTotal)
                if (totalComprado === 0 && Array.isArray(d?.comprasCotizacionItems) && d.comprasCotizacionItems.length > 0) {
                    totalComprado = d.comprasCotizacionItems.reduce(
                        (sum: number, item: any) => sum + Number(item.precioTotal || 0),
                        0
                    );
                }
                
                console.log('💰 Total comprado calculado:', totalComprado);

                // Calcular el costo total del proyecto
                console.log('🔍 Llamando calcTotal con d:', d);
                console.log('🔍 necesidadProyectos:', d?.necesidadProyectos);
                const costoTotal = calcTotal(d);
                console.log('💰 Costo total del proyecto calculado:', costoTotal);
                console.log('🔍 Estableciendo costoTotalProyecto con:', costoTotal);

                setDataProyecto(d);
                setTotalValorReal(totalComprado);
                setCostoTotalProyecto(costoTotal);
                console.log('✅ Estado actualizado - costoTotalProyecto debería ser:', costoTotal);

            } catch (err) {
                console.error('❌ Error al obtener datos del proyecto:', err);
                setDataProyecto(null);
                setTotalValorReal(0);
                setCostoTotalProyecto(0);
            } finally {
                setLoading(false);
            }
        };

        getProject();
    }, [proyectoSeleccionado]);

    // Calcular lo que falta por comprar
    const totalFaltante = costoTotalProyecto - totalValorReal;

    console.log('📊 Estado actual:', {
        proyectoSeleccionado,
        loading,
        totalValorReal,
        costoTotalProyecto,
        totalFaltante,
        dataProyecto: dataProyecto ? 'existe' : 'null'
    });

    return (
        <div className="proyectosRequisicion">
            <div className="containerProyectos">
                <div className="headerProyectos">
                    <div className="titleSection">
                        <h1>Proyectos</h1>
                        <span>Información general</span>
                    </div>
                </div>
                
                <div className="contentProyectos">
                    <div className="leftContent">
                        <div className="sectionTitle">
                            <h3>General</h3>
                        </div>
                        <div className="listaProyectos">
                            {proyectos.length > 0 ? proyectos.map((proyecto) => (
                                <ItemProyecto
                                    key={proyecto.id}
                                    proyecto={proyecto}
                                    isSelected={proyectoSeleccionado === proyecto.id}
                                    onSelect={() => {
                                        console.log('🎯 onSelect llamado para proyecto:', proyecto.id);
                                        const nuevoId = proyectoSeleccionado === proyecto.id ? null : proyecto.id;
                                        console.log('🎯 Nuevo ID seleccionado:', nuevoId);
                                        setProyectoSeleccionado(nuevoId);
                                    }}
                                />
                            )) : (
                                <p style={{ padding: '20px', color: '#666', textAlign: 'center' }}>
                                    No hay proyectos disponibles
                                </p>
                            )}
                        </div>
                    </div>
                    
                    <div className="rightContent">
                        <div className="sectionTitle">
                            <h3>Cliente</h3>
                        </div>
                        {proyectoSeleccionado ? (
                            <div className="detalleProyecto">
                                {(() => {
                                    const proyecto = proyectos.find(p => p.id === proyectoSeleccionado);
                                    if (!proyecto) return null;
                                    
                                    if (loading) {
                                        return (
                                            <div style={{ padding: '20px', textAlign: 'center' }}>
                                                <p>Cargando información del proyecto...</p>
                                            </div>
                                        );
                                    }
                                    
                                    // Mostrar error si no hay datos y no está cargando
                                    if (!dataProyecto && !loading) {
                                        return (
                                            <div style={{ padding: '20px', textAlign: 'center', color: '#d32f2f' }}>
                                                <p>No se pudo cargar la información del proyecto.</p>
                                                <p style={{ fontSize: '12px', marginTop: '10px' }}>
                                                    Revisa la consola para más detalles.
                                                </p>
                                            </div>
                                        );
                                    }
                                    
                                    return (
                                        <>
                                            <div className="infoCliente">
                                                <h4>{proyecto.cliente}</h4>
                                            </div>
                                            
                                            <div className="resumenFinanciero">
                                                <div className="itemResumen">
                                                    <span className="label">Total comprado</span>
                                                    <h3 className="valorComprado">
                                                        ${new Intl.NumberFormat('es-CO', { currency: 'COP' }).format(totalValorReal || 0)}
                                                    </h3>
                                                </div>
                                                
                                                {/* <div className="itemResumen">
                                                    <span className="label">Costo total del proyecto</span>
                                                    <h3 className="valorTotal">
                                                        ${new Intl.NumberFormat('es-CO', { currency: 'COP' }).format(costoTotalProyecto || 0)}
                                                    </h3>
                                                </div>
                                                
                                                <div className="itemResumen">
                                                    <span className="label">Falta por comprar</span>
                                                    <h3 className="valorFaltante">
                                                        ${new Intl.NumberFormat('es-CO', { currency: 'COP' }).format(totalFaltante || 0)}
                                                    </h3>
                                                </div> */}
                                            </div>
                                            
                                            <div className="accionesProyecto">
                                                <button className="btnCotizacion" onClick={() => {
                                                    // Aquí iría la lógica para abrir la cotización
                                                    console.log('Abrir cotización:', proyecto.cotizacionId);
                                                }}>
                                                    <span>Ver cotización</span>
                                                </button>
                                                <button className="btnPDF" onClick={() => {
                                                    generarPDFCompras(proyecto, dataProyecto, totalValorReal, proyectoSeleccionado);
                                                }}>
                                                    <span>Descargar PDF</span>
                                                </button>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        ) : (
                            <div className="sinSeleccion">
                                <p>Selecciona un proyecto para ver los detalles</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
} 