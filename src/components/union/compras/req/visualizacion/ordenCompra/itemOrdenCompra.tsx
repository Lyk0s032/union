import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ItemOrdenCompraProps {
    orden: any;
}

export default function ItemOrdenCompra({ orden }: ItemOrdenCompraProps) {
    const [params, setParams] = useSearchParams();
    const [descargandoPDF, setDescargandoPDF] = useState(false);
    
    const proyectosCount = Array.isArray(orden?.requisiciones)
        ? orden.requisiciones.length
        : 0;

    const fecha = orden?.createdAt
        ? String(orden.createdAt).split('T')[0]
        : '';

    // Obtener nombre del proveedor
    const proveedor = orden?.proveedor || orden?.provider || {};
    const nombreProveedor = proveedor.nombre || proveedor.name || 'Sin proveedor';

    // Función para formatear números (usada en el PDF)
    const fmt = (v: number) =>
        new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(v || 0);

    // Función para descargar PDF sin abrir la orden
    const handleDescargarPDF = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Evitar que se abra la orden
        
        if (!orden?.id) {
            alert('No se puede generar el PDF: falta el ID de la orden');
            return;
        }

        setDescargandoPDF(true);
        try {
            // Usar el mismo endpoint que se usa cuando se abre la orden
            const res = await axios.get(`/api/requisicion/get/get/admin/ordenDeCompra/${orden.id}`);
            const ordenCompleta = res.data;

            console.log('📦 Datos de orden completa para PDF:', ordenCompleta);

            if (!ordenCompleta || ordenCompleta === 404 || ordenCompleta === 'notrequest') {
                alert('No se encontraron datos para generar el PDF');
                setDescargandoPDF(false);
                return;
            }

            // Generar PDF
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();

            // Título
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text(`Orden de Compra #${ordenCompleta.id || orden.id}`, pageWidth / 2, 20, { align: 'center' });

            // Fecha
            const fechaOrden = ordenCompleta.fecha || ordenCompleta.createdAt || fecha;
            const fechaFormateada = typeof fechaOrden === 'string' ? fechaOrden.split('T')[0] : fecha;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Fecha: ${fechaFormateada}`, pageWidth / 2, 27, { align: 'center' });

            // Información del proveedor
            const proveedor = ordenCompleta.proveedor || ordenCompleta.provider || {};
            let startY = 35;
            
            if (proveedor.nombre || proveedor.name) {
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text(proveedor.nombre || proveedor.name, 14, startY);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                
                if (proveedor.nit) {
                    doc.text(`NIT: ${proveedor.nit}`, 14, startY + 6);
                }
                if (proveedor.email) {
                    doc.text(`Email: ${proveedor.email}`, 14, startY + 12);
                }
                if (proveedor.telefono) {
                    doc.text(`Teléfono: ${proveedor.telefono}`, 14, startY + 18);
                }
                startY += 25;
            }

            // Tabla de items - usar la misma lógica que rightDataOrden.tsx
            const items = ordenCompleta.comprasCotizacionItems || ordenCompleta.items || [];
            
            console.log('📋 Items para PDF:', items);
            console.log('📋 Items es array?', Array.isArray(items));
            console.log('📋 Cantidad de items:', items.length);
            
            if (items.length > 0 && Array.isArray(items)) {
                const head = [['Descripción', 'Cantidad', 'Precio', 'Descuento', 'Total']];
                const body = items.map((item: any) => {
                    const materia = item.materium || {};
                    const producto = item.producto || {};
                    const nombre = producto.item || materia.description || 'Sin nombre';
                    const cantidad = Number(item.cantidad || 0);
                    const precio = Number(item.precio || 0);
                    const descuento = Number(item.descuento || 0);
                    const total = Number(item.precioTotal || 0);

                    return [
                        nombre,
                        isNaN(cantidad) ? '0' : cantidad.toFixed(2),
                        `$${fmt(isNaN(precio) ? 0 : precio)}`,
                        `$${fmt(isNaN(descuento) ? 0 : descuento)}`,
                        `$${fmt(isNaN(total) ? 0 : total)}`
                    ];
                });

                autoTable(doc, {
                    startY: startY,
                    head: head,
                    body: body,
                    styles: { fontSize: 9, cellPadding: 3 },
                    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                    alternateRowStyles: { fillColor: [240, 240, 240] },
                    margin: { left: 14, right: 14 }
                });

                // Calcular resumen - usar la misma lógica que rightDataOrden.tsx
                const valorBruto = items.reduce((sum: number, item: any) => {
                    const precio = Number(item.precio || 0);
                    return sum + (isNaN(precio) ? 0 : precio);
                }, 0);
                const descuentoTotal = items.reduce((sum: number, item: any) => {
                    const descuento = Number(item.descuento || 0);
                    return sum + (isNaN(descuento) ? 0 : descuento);
                }, 0);
                const subtotal = Math.max(0, valorBruto - descuentoTotal);
                const iva = Math.max(0, subtotal * 0.19);
                const totalNeto = Math.max(0, subtotal + iva);

                // Tabla de resumen
                const finalY = (doc as any).lastAutoTable ? ((doc as any).lastAutoTable.finalY as number) + 10 : startY + 20;
                const resumenHead = [['Concepto', 'Valor']];
                const resumenBody = [
                    ['Valor bruto', `$${fmt(valorBruto)}`],
                    ['Descuento', `$${fmt(descuentoTotal)}`],
                    ['IVA (19%)', `$${fmt(iva)}`],
                    ['Total neto', `$${fmt(totalNeto)}`]
                ];

                autoTable(doc, {
                    startY: finalY,
                    head: resumenHead,
                    body: resumenBody,
                    styles: { fontSize: 10, cellPadding: 4 },
                    headStyles: { fillColor: [52, 73, 94], textColor: 255, fontStyle: 'bold' },
                    columnStyles: {
                        0: { fontStyle: 'bold', cellWidth: 'auto' },
                        1: { halign: 'right' }
                    },
                    margin: { left: 14, right: 14 },
                    theme: 'plain'
                });

                // Agregar notas si existen
                const nota = ordenCompleta.description || ordenCompleta.note || ordenCompleta.descripcion || '';
                if (nota && nota.trim()) {
                    const notaY = (doc as any).lastAutoTable ? ((doc as any).lastAutoTable.finalY as number) + 15 : finalY + 20;
                    doc.setFontSize(11);
                    doc.setFont('helvetica', 'bold');
                    doc.text('Notas:', 14, notaY);
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(10);
                    
                    // Dividir el texto en líneas si es muy largo (máximo 80 caracteres por línea)
                    const maxWidth = pageWidth - 28; // Margen izquierdo y derecho
                    const lines = doc.splitTextToSize(nota, maxWidth);
                    doc.text(lines, 14, notaY + 6);
                }
            } else {
                // Si no hay items, mostrar mensaje
                doc.setFontSize(10);
                doc.text('No hay items en esta orden de compra', 14, startY);
                
                // Agregar notas si existen (aunque no haya items)
                const nota = ordenCompleta.description || ordenCompleta.note || ordenCompleta.descripcion || '';
                if (nota && nota.trim()) {
                    const notaY = startY + 15;
                    doc.setFontSize(11);
                    doc.setFont('helvetica', 'bold');
                    doc.text('Notas:', 14, notaY);
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(10);
                    
                    const maxWidth = pageWidth - 28;
                    const lines = doc.splitTextToSize(nota, maxWidth);
                    doc.text(lines, 14, notaY + 6);
                }
            }

            // Guardar PDF
            const nombreArchivo = `orden-compra-${orden.id}-${new Date().getTime()}.pdf`;
            doc.save(nombreArchivo);
        } catch (error: any) {
            console.error('❌ Error al generar PDF:', error);
            console.error('❌ Error response:', error?.response);
            console.error('❌ Error message:', error?.message);
            const mensajeError = error?.response?.data?.message || error?.message || 'Error desconocido';
            alert(`Error al generar el PDF: ${mensajeError}. Por favor, intente nuevamente.`);
        } finally {
            setDescargandoPDF(false);
        }
    };
    return (
        <tr className="itemOrdenCompra" onClick={() => {
            params.set('openOrden', `${orden.id}`);
            setParams(params);
        }}>

            <td className="coding">
                <div className="code">
                    <h3>{orden.id}</h3>
                </div>
            </td>
            <td className="longer">
                <div className="titleNameKitAndData">
                    <div className="extensionColor">
                        <span>{fecha}</span>
                    </div>
                    <div className="nameData">
                        <h3>{orden.name}</h3>
                    </div>
                </div>
            </td>
            <td className="middle" style={{ width: '18%', fontSize: 12, color: '#666' }}>
                <div className="nameData">
                    <h3 style={{ fontSize: 12 }}></h3>
                </div>
                <span>{nombreProveedor}</span>
            </td>
            <td className="middle" style={{ width: '18%', fontSize: 12, color: '#666' }}>
                <div className="nameData">
                    <h3 style={{ fontSize: 12 }}>Proyectos</h3>
                </div>
                <span>{proyectosCount}</span>
            </td>
            <td className="middle" style={{ width: '10%', fontSize: 12 }}>
                <button
                    onClick={handleDescargarPDF}
                    disabled={descargandoPDF}
                    style={{
                        background: descargandoPDF ? '#ccc' : '#2980b9',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: descargandoPDF ? 'not-allowed' : 'pointer',
                        fontSize: '11px',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        if (!descargandoPDF) {
                            e.currentTarget.style.background = '#3498db';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!descargandoPDF) {
                            e.currentTarget.style.background = '#2980b9';
                        }
                    }}
                    title="Descargar PDF de la orden"
                >
                    {descargandoPDF ? 'Generando...' : '📄 PDF'}
                </button>
            </td>
        </tr>
    );
}

