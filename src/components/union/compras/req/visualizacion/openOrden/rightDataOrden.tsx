import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import * as actions from '../../../../../store/action/action';
import axios from 'axios';

// Componente PDF para la orden de compra (definido antes de su uso)
const pdfStyles = StyleSheet.create({
    page: {
        padding: 40,
        paddingBottom: 60,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#007bff',
        paddingBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 5,
    },
    supplierSection: {
        marginBottom: 20,
    },
    supplierName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 5,
    },
    supplierInfo: {
        fontSize: 10,
        color: '#666',
        marginBottom: 3,
    },
    table: {
        marginTop: 20,
        marginBottom: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tableRow: {
        flexDirection: 'row',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    colDesc: { width: '50%', fontSize: 10 },
    colQty: { width: '15%', fontSize: 10 },
    colPrice: { width: '15%', fontSize: 10, textAlign: 'right' },
    colTotal: { width: '20%', fontSize: 10, textAlign: 'right' },
    summary: {
        marginTop: 20,
        marginBottom: 30,
        paddingTop: 15,
        borderTopWidth: 2,
        borderTopColor: '#ccc',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingRight: 20,
    },
    summaryLabel: {
        fontSize: 11,
        color: '#666',
    },
    summaryValue: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingRight: 20,
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#007bff',
    },
    totalValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#007bff',
    },
});

interface PdfDocumentOrdenProps {
    ordenCompras: any;
    resumenOrden: {
        valorBruto: number;
        descuentoTotal: number;
        iva: number;
        totalNeto: number;
    };
    tieneIva: boolean;
}

const PdfDocumentOrden = React.memo(({ ordenCompras, resumenOrden, tieneIva }: PdfDocumentOrdenProps) => {
    // Validaciones
    if (!ordenCompras || ordenCompras === 404 || ordenCompras === 'notrequest') {
        return (
            <Document>
                <Page size="A4" style={pdfStyles.page}>
                    <Text>No hay datos de orden de compra disponibles</Text>
                </Page>
            </Document>
        );
    }

    // Validar resumenOrden
    if (!resumenOrden || typeof resumenOrden !== 'object') {
        return (
            <Document>
                <Page size="A4" style={pdfStyles.page}>
                    <Text>Error: Datos de resumen inválidos</Text>
                </Page>
            </Document>
        );
    }

    // Asegurar que todos los valores sean números válidos
    const valorBruto = typeof resumenOrden.valorBruto === 'number' && !isNaN(resumenOrden.valorBruto) ? resumenOrden.valorBruto : 0;
    const descuentoTotal = typeof resumenOrden.descuentoTotal === 'number' && !isNaN(resumenOrden.descuentoTotal) ? resumenOrden.descuentoTotal : 0;
    const iva = typeof resumenOrden.iva === 'number' && !isNaN(resumenOrden.iva) ? resumenOrden.iva : 0;
    const totalNeto = typeof resumenOrden.totalNeto === 'number' && !isNaN(resumenOrden.totalNeto) ? resumenOrden.totalNeto : 0;

    const proveedor = ordenCompras?.proveedor || ordenCompras?.provider || {};
    const items = Array.isArray(ordenCompras?.comprasCotizacionItems) 
        ? ordenCompras.comprasCotizacionItems 
        : Array.isArray(ordenCompras?.items) 
        ? ordenCompras.items 
        : [];
    const fecha = ordenCompras?.fecha || ordenCompras?.createdAt || new Date().toISOString();
    const fechaFormateada = typeof fecha === 'string' ? fecha.split('T')[0] : new Date().toISOString().split('T')[0];

    // Debug: verificar estructura de items
    if (items.length > 0) {
        console.log('PDF - Primer item:', items[0]);
        console.log('PDF - Cantidad:', items[0].cantidad, 'Tipo:', typeof items[0].cantidad);
        console.log('PDF - Precio:', items[0].precio, 'Tipo:', typeof items[0].precio);
        console.log('PDF - PrecioTotal:', items[0].precioTotal, 'Tipo:', typeof items[0].precioTotal);
    }

    const formatearNumero = (num: number | undefined | null | string) => {
        // Convertir a número si es string
        const numero = typeof num === 'string' ? parseFloat(num) : (typeof num === 'number' ? num : 0);
        if (isNaN(numero) || numero === 0) return '0';
        return new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(Math.round(numero));
    };

    // Calcular la nota antes del return para evitar problemas con el reconciler
    const nota = ordenCompras?.description || ordenCompras?.note || ordenCompras?.descripcion || '';
    const tieneNota = nota && nota.trim();

    return (
        <Document>
            <Page size="A4" style={pdfStyles.page}>
                <View style={pdfStyles.header}>
                    <Text style={pdfStyles.title}>
                        Orden de Compra #{ordenCompras?.id || 'N/A'}
                    </Text>
                    <Text style={pdfStyles.supplierInfo}>Fecha: {fechaFormateada}</Text>
                </View>

                <View style={pdfStyles.supplierSection}>
                    <Text style={pdfStyles.supplierName}>{proveedor.nombre || proveedor.name || 'Sin proveedor'}</Text>
                    {proveedor.nit && (
                        <Text style={pdfStyles.supplierInfo}>NIT: {proveedor.nit}</Text>
                    )}
                    {proveedor.email && (
                        <Text style={pdfStyles.supplierInfo}>Email: {proveedor.email}</Text>
                    )}
                    {proveedor.telefono && (
                        <Text style={pdfStyles.supplierInfo}>Teléfono: {proveedor.telefono}</Text>
                    )}
                </View>

                {items.length > 0 && (
                    <View style={pdfStyles.table}>
                        <View style={pdfStyles.tableHeader}>
                            <Text style={pdfStyles.colDesc}>Descripción</Text>
                            <Text style={pdfStyles.colQty}>Cantidad</Text>
                            <Text style={pdfStyles.colPrice}>Precio</Text>
                            <Text style={pdfStyles.colTotal}>Total</Text>
                        </View>
                        {items.map((item: any, index: number) => {
                            const materia = item.materium || {};
                            const producto = item.producto || {};
                            const nombre = producto.item || materia.description || 'Sin nombre';
                            
                            // Convertir valores a números - usar la misma lógica que en la interfaz
                            const cantidad = Number(item.cantidad || 0);
                            const precio = Number(item.precio || 0);
                            const descuento = Number(item.descuento || 0);
                            const total = Number(item.precioTotal || 0);

                            return (
                                <View key={item.id || index} style={pdfStyles.tableRow}>
                                    <Text style={pdfStyles.colDesc}>{String(nombre)}</Text>
                                    <Text style={pdfStyles.colQty}>{isNaN(cantidad) ? '0' : cantidad.toFixed(2)}</Text>
                                    <Text style={pdfStyles.colPrice}>${formatearNumero(isNaN(precio) ? 0 : precio)}</Text>
                                    <Text style={pdfStyles.colTotal}>${formatearNumero(isNaN(total) ? 0 : total)}</Text>
                                </View>
                            );
                        })}
                    </View>
                )}

                <View style={pdfStyles.summary}>
                    <View style={pdfStyles.summaryRow}>
                        <Text style={pdfStyles.summaryLabel}>Valor bruto:</Text>
                        <Text style={pdfStyles.summaryValue}>${formatearNumero(valorBruto)}</Text>
                    </View>
                    <View style={pdfStyles.summaryRow}>
                        <Text style={pdfStyles.summaryLabel}>Descuento:</Text>
                        <Text style={pdfStyles.summaryValue}>${formatearNumero(descuentoTotal)}</Text>
                    </View>
                    {tieneIva && (
                        <View style={pdfStyles.summaryRow}>
                            <Text style={pdfStyles.summaryLabel}>IVA (19%):</Text>
                            <Text style={pdfStyles.summaryValue}>${formatearNumero(iva)}</Text>
                        </View>
                    )}
                    <View style={pdfStyles.totalRow}>
                        <Text style={pdfStyles.totalLabel}>Total neto:</Text>
                        <Text style={pdfStyles.totalValue}>${formatearNumero(totalNeto)}</Text>
                    </View>
                </View>

                {/* Agregar notas si existen - usando renderizado condicional directo */}
                {tieneNota && (
                    <View style={{ marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#e0e0e0' }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, color: '#007bff' }}>
                            Notas:
                        </Text>
                        <Text style={{ fontSize: 10, color: '#333', lineHeight: 1.5 }}>
                            {nota}
                        </Text>
                    </View>
                )}
            </Page>
        </Document>
    );
});

export default function RightDataOrden() {
    const [params] = useSearchParams();
    const dispatch = useDispatch();
    const admin = useSelector((state: any) => state.admin || state.administration || {});
    const ordenId = params.get('openOrden');

    const ordenCompras = admin.ordenCompras;
    const loadingOrdenCompras = !!admin.loadingOrdenCompras;

    const [editNota, setEditNota] = useState(false);
    const [notaValue, setNotaValue] = useState('');
    const [tieneIva, setTieneIva] = useState(true); // Por defecto activado
    const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
    const [eliminandoItem, setEliminandoItem] = useState<number | null>(null);
    const [enviandoOrden, setEnviandoOrden] = useState(false);
    const [pdfReady, setPdfReady] = useState(true);

    useEffect(() => {
        if (!ordenId) return;
        (dispatch as any)(actions.axiosToGetOrdenComprasAdmin(true, ordenId));
    }, [ordenId, dispatch]);

    useEffect(() => {
        if (!ordenCompras || ordenCompras === 404 || ordenCompras === 'notrequest') return;
        const nota = ordenCompras.description || ordenCompras.note || ordenCompras.descripcion || '';
        setNotaValue(nota || '');
    }, [ordenCompras]);

    const header = useMemo(() => {
        if (!ordenCompras || ordenCompras === 404 || ordenCompras === 'notrequest') {
            return { titulo: 'Orden de compra', estado: '—', nit: '', proveedor: '' };
        }
        const prov = ordenCompras.proveedor || ordenCompras.provider || {};
        const titulo = `OC ${ordenCompras.id} ${String(ordenCompras.name || '').toUpperCase()}`.trim();
        const estado = ordenCompras.estado || ordenCompras.state || ordenCompras.estadoPago || '—';
        const nit = prov.nit ? `NIT ${prov.nit}` : '';
        const proveedor = prov.nombre || prov.name || '';
        return { titulo, estado, nit, proveedor };
    }, [ordenCompras]);

    const tieneProductos = useMemo(() => {
        if (!ordenCompras || ordenCompras === 404 || ordenCompras === 'notrequest') return false;
        const items = ordenCompras.comprasCotizacionItems || ordenCompras.items || [];
        return Array.isArray(items) && items.length > 0;
    }, [ordenCompras]);

    const itemsOrdenados = useMemo(() => {
        if (!ordenCompras || ordenCompras === 404 || ordenCompras === 'notrequest') return [];
        const items = ordenCompras.comprasCotizacionItems || ordenCompras.items || [];
        if (!Array.isArray(items)) return [];
        // Ordenar por ID o fecha de creación
        return [...items].sort((a, b) => {
            const idA = a.id || 0;
            const idB = b.id || 0;
            return idB - idA; // Orden descendente (más recientes primero)
        });
    }, [ordenCompras]);

    const formatearPrecio = (valor: number) => {
        return new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(valor || 0);
    };

    // Calcular totales de la orden
    const resumenOrden = useMemo(() => {
        if (!ordenCompras || ordenCompras === 404 || ordenCompras === 'notrequest') {
            return { valorBruto: 0, descuentoTotal: 0, iva: 0, totalNeto: 0 };
        }
        const items = ordenCompras.comprasCotizacionItems || ordenCompras.items || [];
        if (!Array.isArray(items)) {
            return { valorBruto: 0, descuentoTotal: 0, iva: 0, totalNeto: 0 };
        }

        const valorBruto = items.reduce((sum: number, item: any) => {
            const precio = Number(item.precio || 0);
            return sum + (isNaN(precio) ? 0 : precio);
        }, 0);
        const descuentoTotal = items.reduce((sum: number, item: any) => {
            const descuento = Number(item.descuento || 0);
            return sum + (isNaN(descuento) ? 0 : descuento);
        }, 0);
        const subtotal = Math.max(0, valorBruto - descuentoTotal);
        const iva = tieneIva ? Math.max(0, subtotal * 0.19) : 0; // IVA del 19% solo si tieneIva está activado
        const totalNeto = Math.max(0, subtotal + iva);

        return { 
            valorBruto: isNaN(valorBruto) ? 0 : valorBruto, 
            descuentoTotal: isNaN(descuentoTotal) ? 0 : descuentoTotal, 
            iva: isNaN(iva) ? 0 : iva, 
            totalNeto: isNaN(totalNeto) ? 0 : totalNeto 
        };
    }, [ordenCompras, tieneIva]);

    // Función para actualizar la nota de la orden
    const updateNote = async () => {
        if (!ordenCompras?.id || ordenCompras === 404 || ordenCompras === 'notrequest') {
            return;
        }
        const body = {
            ordenId: ordenCompras.id,
            description: notaValue
        };
        try {
            await axios.put('/api/requisicion/post/update/cotizaciones/one', body);
            setEditNota(false);
            (dispatch as any)(actions.axiosToGetOrdenComprasAdmin(false, ordenCompras.id));
            (dispatch as any)(actions.HandleAlerta('Nota actualizada', 'positive'));
        } catch (error) {
            console.error(error);
            (dispatch as any)(actions.HandleAlerta('No hemos logrado actualizar la nota', 'mistake'));
        }
    };

    // Función para enviar la orden de compra a financiero
    const sendToFinanciero = async () => {
        if (!ordenCompras?.id || ordenCompras === 404 || ordenCompras === 'notrequest') {
            (dispatch as any)(actions.HandleAlerta('No hay orden de compra para enviar', 'mistake'));
            return;
        }
        setEnviandoOrden(true);
        try {
            const res = await axios.get(`/api/requisicion/get/update/cotizacion/${ordenCompras.id}`);
            (dispatch as any)(actions.axiosToGetOrdenComprasAdmin(false, ordenCompras.id));
            (dispatch as any)(actions.HandleAlerta('Cotización aprobada', 'positive'));
            return res;
        } catch (err) {
            console.error(err);
            (dispatch as any)(actions.HandleAlerta('No hemos logrado aprobar esto', 'mistake'));
            return null;
        } finally {
            setEnviandoOrden(false);
        }
    };

    // Función para eliminar un item de la orden de compra
    const eliminarItemComprasCotizacion = async (item: any) => {
        // 1 Construimos el body
        const body = {
            itemId: item.materiumId ? item.materiumId : item.productoId,
            tipo: !item.materiumId ? 'producto' : 'materia',
            comprasId: item.comprasCotizacionId
        };

        setEliminandoItem(item.id);
        try {
            // 2 Enviamos el DELETE con body
            const send = await axios.post('/api/requisicion/delete/remove/compras/item', body);
            (dispatch as any)(actions.HandleAlerta('Item removido', 'positive'));
            (dispatch as any)(actions.axiosToGetOrdenComprasAdmin(false, params.get('openOrden')));
            return send;
        } catch (error) {
            console.error(error);
            (dispatch as any)(actions.HandleAlerta('No hemos logrado eliminar esto', 'mistake'));
        } finally {
            setEliminandoItem(null);
        }
    };

    // Memorizar el documento PDF para evitar re-renderizados problemáticos
    const pdfDocument = useMemo(() => {
        if (!tieneProductos || !ordenCompras || ordenCompras === 404 || ordenCompras === 'notrequest') {
            return null;
        }
        return (
            <PdfDocumentOrden
                ordenCompras={ordenCompras}
                resumenOrden={resumenOrden}
                tieneIva={tieneIva}
            />
        );
    }, [ordenCompras, resumenOrden, tieneIva, tieneProductos]);

    // Manejar el cambio del checkbox del IVA con un pequeño delay para evitar errores de re-renderizado
    const handleIvaChange = (checked: boolean) => {
        setPdfReady(false);
        setTieneIva(checked);
        // Reactivar el PDF después de un breve delay para permitir que el estado se actualice
        setTimeout(() => {
            setPdfReady(true);
        }, 100);
    };

    // Debug: verificar datos
    useEffect(() => {
        if (ordenCompras && ordenCompras !== 404 && ordenCompras !== 'notrequest') {
            console.log('Orden compras para PDF:', ordenCompras);
            console.log('Resumen orden:', resumenOrden);
            console.log('Tiene productos:', tieneProductos);
        }
    }, [ordenCompras, resumenOrden, tieneProductos]);

    return (
        <div className="rightDataOrden">
            {loadingOrdenCompras && (
                <div className="rightOrdenLoading">
                    <h3>Cargando orden...</h3>
                    <span>Estamos trayendo la información de la OC</span>
                </div>
            )}

            {!loadingOrdenCompras && (ordenCompras === 404 || ordenCompras === 'notrequest') && (
                <div className="rightOrdenEmpty">
                    <h3>No encontramos la orden</h3>
                    <span>Vuelve a intentarlo o selecciona otra OC</span>
                </div>
            )}

            {!loadingOrdenCompras && ordenCompras && ordenCompras !== 404 && ordenCompras !== 'notrequest' && (
                <>
                    <div className="rightOrdenHeader">
                        <h1>{header.titulo}</h1>
                        <div className="rightOrdenMeta">
                            <div className="metaLine">
                                <span className="metaLabel">Estado:</span>
                                <span className="metaValue">{header.estado}</span>
                            </div>
                            {header.nit ? <div className="metaMuted">{header.nit}</div> : null}
                            {header.proveedor ? <div className="metaProveedor">{header.proveedor}</div> : null}
                        </div>
                    </div>

                    <div className="rightOrdenBody">
                        {!tieneProductos ? (
                            <div className="rightOrdenNoProducts">
                                <span>No hay producto aun</span>
                            </div>
                        ) : (
                            <div className="rightOrdenItemsList">
                                {itemsOrdenados.map((item: any, index: number) => {
                                    const materia = item.materium || {};
                                    const producto = item.producto || {};
                                    const esProducto = !!item.productoId;
                                    const itemId = esProducto ? producto.id : materia.id;
                                    const itemNombre = esProducto ? producto.item : materia.description;
                                    const cantidad = item.cantidad || 0;
                                    const precio = item.precio || 0;
                                    const descuento = item.descuento || 0;
                                    const precioTotal = item.precioTotal || 0;
                                    const fecha = item.createdAt ? String(item.createdAt).split('T')[0] : '';

                                    // Obtener unidad: primero de itemRequisicion, luego del elemento
                                    const unidad = item.itemRequisicion?.unidad 
                                        || (Array.isArray(item.itemRequisicions) && item.itemRequisicions[0]?.unidad)
                                        || producto.unidad 
                                        || materia.unidad 
                                        || '';

                                    // Obtener medida: primero de itemRequisicion, luego del item, luego del elemento
                                    let medida = item.itemRequisicion?.medida 
                                        || (Array.isArray(item.itemRequisicions) && item.itemRequisicions[0]?.medida)
                                        || item.medida 
                                        || producto.medida 
                                        || materia.medida 
                                        || '';

                                    // Si la unidad es 'kg', la medida mostrada siempre es 1 (por kilo individual)
                                    if (unidad === 'kg' && medida) {
                                        medida = 1;
                                    }

                                    // Formatear medida y unidad para mostrar
                                    const medidaUnidadDisplay = medida && unidad 
                                        ? `${medida} ${unidad}` 
                                        : unidad 
                                        ? unidad 
                                        : '';

                                    return (
                                        <div 
                                            key={item.id || index} 
                                            className="rightOrdenItem"
                                            onMouseEnter={() => setHoveredItemId(item.id)}
                                            onMouseLeave={() => setHoveredItemId(null)}
                                        >
                                            {/* Botón X para eliminar (aparece en hover) */}
                                            {hoveredItemId === item.id && (
                                                <button
                                                    className="rightOrdenItemDelete"
                                                    onClick={() => eliminarItemComprasCotizacion(item)}
                                                    disabled={eliminandoItem === item.id}
                                                    title="Eliminar item"
                                                >
                                                    {eliminandoItem === item.id ? '...' : '×'}
                                                </button>
                                            )}
                                            <div className="rightOrdenItemContent">
                                                {/* Badge circular con el ID del item */}
                                                <div className="rightOrdenItemBadge">
                                                    <span className="itemBadgeNumber">{itemId || item.id || index + 1}</span>
                                                </div>

                                                {/* Contenido principal: Nombre arriba, información abajo en horizontal */}
                                                <div className="rightOrdenItemMain">
                                                    {/* Nombre del item */}
                                                    <h3 className="rightOrdenItemNombre">{itemNombre || 'Sin nombre'} </h3>
                                                    {medidaUnidadDisplay && <span>{medidaUnidadDisplay}</span>}
                                                    {/* Información en horizontal: Cantidad total, Descuento, Precio total */}
                                                    <div className="rightOrdenItemInfo">
                                                        <div className="rightOrdenItemInfoItem">
                                                            <span className="infoLabel">Cantidad total</span>
                                                            <span className="infoValue">{Number(cantidad || 0).toFixed(2)}</span>
                                                        </div>
                                                        <div className="rightOrdenItemInfoItem">
                                                            <span className="infoLabel">Descuento</span>
                                                            <span className="infoValue">${formatearPrecio(descuento)}</span>
                                                        </div>
                                                        <div className="rightOrdenItemInfoItem">
                                                            <span className="infoLabel">Precio total</span>
                                                            <span className="infoValue">${formatearPrecio(precioTotal)}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Fecha (opcional, si existe) */}
                                                    {fecha && (
                                                        <span className="rightOrdenItemFecha">{fecha}</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Sección de nota (si existe) */}
                                            {item.nota && (
                                                <div className="rightOrdenItemNota">
                                                    <span className="notaLabel">Nota</span>
                                                    <span className="notaHint">(Click en la nota para editar)</span>
                                                    <div className="notaContent">{item.nota}</div>
                                                </div>
                                            )}

                                            {/* Proyectos asociados (si existen) */}
                                            {item.itemToProjects && Array.isArray(item.itemToProjects) && item.itemToProjects.length > 0 && (
                                                <div className="rightOrdenItemProjects">
                                                    <span className="projectsLabel">Proyectos:</span>
                                                    <div className="projectsList">
                                                        {item.itemToProjects.map((proj: any, pIndex: number) => (
                                                            <span key={pIndex} className="projectTag">
                                                                {proj.requisicion?.nombre || `Proyecto ${proj.requisicionId}`} ({proj.cantidad})
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="rightOrdenNota">
                        <div className="notaHeader">
                            <span className="notaTitle">Nota</span>
                            <span className="notaHint">(Click en la nota para editar)</span>
                        </div>

                        {!editNota ? (
                            <div
                                className="notaBox"
                                onClick={() => setEditNota(true)}
                                role="button"
                            >
                                {notaValue && notaValue.trim() !== '' ? notaValue : 'No hay ninguna nota'}
                            </div>
                        ) : (
                            <textarea
                                className="notaTextarea"
                                value={notaValue}
                                onChange={(e) => setNotaValue(e.target.value)}
                                onBlur={() => setEditNota(false)}
                                onKeyDown={(e) => {
                                    // Si presiona Enter sin Ctrl+Shift, guardar y cerrar
                                    if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
                                        e.preventDefault();
                                        updateNote();
                                    }
                                    // Si presiona Ctrl+Shift+Enter, permitir salto de línea (comportamiento por defecto)
                                    // No necesitamos hacer nada especial aquí, el textarea ya permite saltos de línea
                                }}
                                autoFocus
                                placeholder="Escribe una nota... (Enter para guardar, Ctrl+Shift+Enter para nueva línea)"
                            />
                        )}
                    </div>

                    {/* Resumen y botones */}
                    <div className="rightOrdenResumen">
                        <div className="rightOrdenResumenTitle">
                            <h3>Resumen de la orden</h3>
                        </div>

                        {/* Checkbox para IVA */}
                        <div className="rightOrdenIvaCheckbox">
                            <label className="ivaCheckboxLabel">
                                <input
                                    type="checkbox"
                                    checked={tieneIva}
                                    onChange={(e) => handleIvaChange(e.target.checked)}
                                    className="ivaCheckbox"
                                />
                                <span>Incluir IVA (19%)</span>
                            </label>
                        </div>
                        
                        <div className="rightOrdenResumenDetalles">
                            <div className="resumenLine">
                                <span className="resumenLabel">Valor bruto:</span>
                                <span className="resumenValue">${formatearPrecio(resumenOrden.valorBruto)}</span>
                            </div>
                            <div className="resumenLine">
                                <span className="resumenLabel">Descuento:</span>
                                <span className="resumenValue">${formatearPrecio(resumenOrden.descuentoTotal)}</span>
                            </div>
                            {tieneIva && (
                                <div className="resumenLine">
                                    <span className="resumenLabel">IVA (19%):</span>
                                    <span className="resumenValue">${formatearPrecio(resumenOrden.iva)}</span>
                                </div>
                            )}
                            <div className="resumenLine highlight">
                                <span className="resumenLabel">Total neto:</span>
                                <span className="resumenValue">${formatearPrecio(resumenOrden.totalNeto)}</span>
                            </div>
                        </div>

                        <div className="rightOrdenBotones">
                            {
                                ordenCompras?.estadoPago ? null : (
                                    <button
                                        className="btnGuardarOrden"
                                        onClick={sendToFinanciero}
                                        disabled={enviandoOrden}
                                    >
                                        {enviandoOrden ? 'Enviando...' : 'Enviar orden de compra'}
                                    </button>
                                )
                            }


                            {tieneProductos && ordenCompras && ordenCompras !== 404 && ordenCompras !== 'notrequest' && pdfDocument && pdfReady ? (
                                <PDFDownloadLink
                                    key={`pdf-${ordenCompras.id}-${tieneIva ? 'con-iva' : 'sin-iva'}-${resumenOrden.totalNeto}`}
                                    document={pdfDocument}
                                    fileName={`orden-compra-${String(ordenCompras?.proveedor?.nombre || ordenCompras?.proveedor?.name || ordenCompras?.id || 'orden').replace(/\s+/g, '-')}.pdf`}
                                >
                                    {({ loading, blob, url, error }) => {
                                        if (error) {
                                            console.error('Error en PDFDownloadLink:', error);
                                        }
                                        
                                        const handleDownload = async (e: React.MouseEvent) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            
                                            if (loading) {
                                                console.log('PDF aún generándose...');
                                                return;
                                            }
                                            
                                            if (error) {
                                                console.error('Error al generar PDF:', error);
                                                return;
                                            }
                                            
                                            if (blob) {
                                                // Crear un enlace temporal y hacer clic para descargar
                                                const downloadUrl = window.URL.createObjectURL(blob);
                                                const link = document.createElement('a');
                                                link.href = downloadUrl;
                                                link.download = `orden-compra-${String(ordenCompras?.proveedor?.nombre || ordenCompras?.proveedor?.name || ordenCompras?.id || 'orden').replace(/\s+/g, '-')}.pdf`;
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                                window.URL.revokeObjectURL(downloadUrl);
                                                console.log('PDF descargado exitosamente');
                                            } else if (url) {
                                                // Si hay URL, usar esa
                                                const link = document.createElement('a');
                                                link.href = url;
                                                link.download = `orden-compra-${String(ordenCompras?.proveedor?.nombre || ordenCompras?.proveedor?.name || ordenCompras?.id || 'orden').replace(/\s+/g, '-')}.pdf`;
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                                console.log('PDF descargado desde URL');
                                            } else {
                                                console.log('Esperando a que el PDF esté listo...');
                                            }
                                        };
                                        
                                        return (
                                            <button 
                                                className="btnDescargarPDF" 
                                                type="button"
                                                style={{ width: '100%' }}
                                                onClick={handleDownload}
                                                disabled={loading}
                                            >
                                                {loading ? 'Generando PDF...' : 'Descargar PDF'}
                                            </button>
                                        );
                                    }}
                                </PDFDownloadLink>
                            ) : (
                                <button 
                                    className="btnDescargarPDF" 
                                    type="button"
                                    style={{ width: '100%', opacity: 0.5, cursor: 'not-allowed' }}
                                    disabled
                                >
                                    No hay productos para descargar
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}