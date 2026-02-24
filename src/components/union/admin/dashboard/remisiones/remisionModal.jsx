import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../store/action/action';
import jsPDF from 'jspdf';
import axios from 'axios';

export default function RemisionModal({ remision, onClose }) {
    const dispatch = useDispatch();
    // Obtener usuario actual del store
    const usuarioActual = useSelector((store) => {
        return store?.usuario?.user?.user?.name || 
               store?.user?.nombre || 
               store?.auth?.user?.name || 
               store?.auth?.user?.nombre ||
               'Usuario';
    });

    if (!remision) return null;

    // Estados para campos editables
    const [placa, setPlaca] = useState(remision.placa || '');
    const [guia, setGuia] = useState(remision.guia || '');
    const [cajas, setCajas] = useState(remision.cajas || '');
    const [ocNumero, setOcNumero] = useState(remision.ocNumero || remision.oc || '');
    const [ovNumero, setOvNumero] = useState(remision.ovNumero || remision.ov || '');
    const [fechaRemision, setFechaRemision] = useState(
        remision.fechaRemision 
            ? new Date(remision.fechaRemision).toISOString().slice(0, 16)
            : remision.createdAt 
                ? new Date(remision.createdAt).toISOString().slice(0, 16)
                : ''
    );
    const [observaciones, setObservaciones] = useState(remision.observaciones || '');
    const [guardando, setGuardando] = useState(false);
    
    // Estados para controlar qué campo está en modo edición
    const [editandoPlaca, setEditandoPlaca] = useState(false);
    const [editandoGuia, setEditandoGuia] = useState(false);
    const [editandoCajas, setEditandoCajas] = useState(false);
    const [editandoOcNumero, setEditandoOcNumero] = useState(false);
    const [editandoOvNumero, setEditandoOvNumero] = useState(false);
    const [editandoFechaRemision, setEditandoFechaRemision] = useState(false);
    const [editandoObservaciones, setEditandoObservaciones] = useState(false);

    const formatearFecha = (fecha) => {
        if (!fecha) return 'N/A';
        const date = new Date(fecha);
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return `${date.getDate()} ${meses[date.getMonth()]}, ${date.getFullYear()}`;
    };

    // Sincronizar estados cuando la remisión se actualice desde Redux
    useEffect(() => {
        if (remision) {
            setPlaca(remision.placa || '');
            setGuia(remision.guia || '');
            setCajas(remision.cajas || '');
            setOcNumero(remision.ocNumero || remision.oc || '');
            setOvNumero(remision.ovNumero || remision.ov || '');
            setObservaciones(remision.observaciones || '');
            if (remision.fechaRemision) {
                setFechaRemision(new Date(remision.fechaRemision).toISOString().slice(0, 16));
            } else if (remision.createdAt) {
                setFechaRemision(new Date(remision.createdAt).toISOString().slice(0, 16));
            } else {
                setFechaRemision('');
            }
        }
    }, [remision]);

    const handleGuardarCambios = async () => {
        if (guardando) return; // Evitar múltiples llamadas simultáneas
        
        setGuardando(true);
        try {
            const payload = {
                placa: placa || null,
                guia: guia || null,
                cajas: cajas ? parseInt(cajas) : null,
                oc: ocNumero || null,
                ov: ovNumero || null,
                fechaRemision: fechaRemision ? new Date(fechaRemision).toISOString() : null,
                observaciones: observaciones || null
            };

            await axios.put(`/api/remision/put/actualizar/${remision.id}`, payload);
            
            // Recargar la remisión silenciosamente
            dispatch(actions.axiosToGetRemision(false, remision.id));
        } catch (error) {
            console.error('[REMISION] Error al guardar:', error);
            dispatch(actions.HandleAlerta('Error al guardar los cambios', 'mistake'));
        } finally {
            setGuardando(false);
        }
    };

    const handleDescargarPDF = () => {
        try {
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 15;
            let yPos = margin;

            // Configuración de colores
            const colorAzul = [47, 139, 253]; // #2f8bfd
            const colorGris = [128, 128, 128];
            const colorGrisClaro = [240, 240, 240];

            // ========== HEADER ==========
            // Información de la empresa (izquierda)
            doc.setFontSize(14);
            doc.setTextColor(...colorAzul);
            doc.setFont(undefined, 'bold');
            doc.text('Modulares Costa Gomez SAS', margin, yPos);
            yPos += 6;

            doc.setFontSize(9);
            doc.setTextColor(...colorGris);
            doc.setFont(undefined, 'normal');
            doc.text('NIT: 901165150-3', margin, yPos);
            yPos += 4;
            doc.text('CL 11 13 15, Cali - Valle del Cauca', margin, yPos);
            yPos += 4;
            doc.text('PBX: 3739940', margin, yPos);

            // Box de número de remisión (alineado con detalles del transportador)
            const boxWidth = 70;
            const boxHeight = 25;
            const envioX = pageWidth / 2 + 10; // Misma posición X que detalles del transportador
            const boxX = envioX;
            const boxY = margin;
            
            doc.setFillColor(...colorAzul);
            doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 3, 3, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.setFont(undefined, 'normal');
            doc.text('REMISIÓN NO.', boxX + 5, boxY + 7);
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            const numeroRemision = String(remision.numeroRemision || '');
            const textWidth = doc.getTextWidth(numeroRemision);
            doc.text(numeroRemision, boxX + (boxWidth - textWidth) / 2, boxY + 14);
            
            // Fecha de emisión (debajo del box, alineada con detalles del transportador)
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(...colorGris);
            const fechaParaPDF = fechaRemision || remision.createdAt;
            const fechaTexto = `FECHA DE EMISIÓN: ${String(formatearFecha(fechaParaPDF))}`;
            doc.text(fechaTexto, envioX, boxY + boxHeight + 5);

            yPos = boxY + boxHeight + 15;

            // ========== INFORMACIÓN DEL CLIENTE Y DETALLES DE ENVÍO ==========
            const clienteStartY = yPos;
            
            // Información del cliente (izquierda)
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, 'bold');
            doc.text('INFORMACIÓN DEL CLIENTE', margin, yPos);
            yPos += 6;

            doc.setFont(undefined, 'normal');
            doc.setFontSize(9);
            const cliente = remision?.requisicion?.cotizacion?.client;
            const nombreCliente = cliente?.name || cliente?.nombre || 'N/A';
            doc.text(`Nombre/Razón: ${String(nombreCliente)}`, margin, yPos);
            yPos += 5;
            doc.text(`NIT/C.C.: ${String(cliente?.nit || 'N/A')}`, margin, yPos);
            yPos += 5;
            doc.text(`Dirección: ${String(cliente?.direccion || 'N/A')}`, margin, yPos);

            // Detalles del transportador (derecha) - usando envioX ya definido arriba
            yPos = clienteStartY;
            
            doc.setFont(undefined, 'bold');
            doc.text('Detalles del TRANSPORTADOR', envioX, yPos);
            yPos += 6;

            doc.setFont(undefined, 'normal');
            doc.setFontSize(9);
            doc.text(`Placa: ${String(placa || 'N/A')}`, envioX, yPos);
            yPos += 5;
            doc.text(`Guía: ${String(guia || 'N/A')}`, envioX, yPos);
            yPos += 5;
            doc.text(`Cajas: ${String(cajas || 'N/A')}`, envioX, yPos);

            yPos = clienteStartY + 30;

            // ========== DETALLES (Vendedor, OC.Nro, OV.Nro) ==========
            const detallesStartY = yPos;
            doc.setFont(undefined, 'bold');
            doc.setFontSize(9);
            doc.text('DETALLES', margin, yPos);
            yPos += 6;

            doc.setFont(undefined, 'normal');
            doc.setFontSize(9);
            const vendedor = remision?.requisicion?.cotizacion?.user?.name || remision?.vendedor || remision?.requisicion?.cotizacion?.vendedor?.name || remision?.requisicion?.cotizacion?.vendedor?.nombre || 'N/A';
            doc.text(`Vendedor: ${String(vendedor)}`, margin, yPos);
            yPos += 5;
            doc.text(`OC.Nro: ${String(ocNumero || 'N/A')}`, margin, yPos);
            yPos += 5;
            doc.text(`OV.Nro: ${String(ovNumero || 'N/A')}`, margin, yPos);
            yPos += 5;
            const numeroCotizacion = remision?.requisicionId ? Number(remision.requisicionId + 21719) : 'N/A';
            doc.text(`Nro. Cotización: ${String(numeroCotizacion)}`, margin, yPos);

            yPos = detallesStartY + 30;

            // ========== TABLA DE PRODUCTOS ==========
            const tableStartY = yPos;
            const tableWidth = pageWidth - (margin * 2);
            const colRef = margin;
            const colDesc = margin + 25;
            const colSolicitada = pageWidth - margin - 50;
            const colDespachada = pageWidth - margin - 20;

            // Header de la tabla
            doc.setFillColor(...colorGrisClaro);
            doc.rect(margin, yPos - 5, tableWidth, 8, 'F');
            
            doc.setFontSize(9);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text('Cantidad', colRef, yPos);
            doc.text('Producto', colDesc, yPos);
            doc.text('Solicitada', colSolicitada, yPos);
            doc.text('Despachada', colDespachada, yPos);
            yPos += 10;

            // Línea separadora
            doc.setDrawColor(200, 200, 200);
            doc.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 5;

            // Items de la remisión
            doc.setFont(undefined, 'normal');
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            
            remision?.itemRemisions?.forEach((item, index) => {
                // Verificar si necesita nueva página
                if (yPos > pageHeight - 60) {
                    doc.addPage();
                    yPos = margin;
                    
                    // Redibujar header de tabla en nueva página
                    doc.setFillColor(...colorGrisClaro);
                    doc.rect(margin, yPos - 5, tableWidth, 8, 'F');
                    doc.setFont(undefined, 'bold');
                    doc.setFontSize(9);
                    doc.text('Cantidad', colRef, yPos);
                    doc.text('Producto', colDesc, yPos);
                    doc.text('Solicitada', colSolicitada, yPos);
                    doc.text('Despachada', colDespachada, yPos);
                    yPos += 10;
                    doc.line(margin, yPos, pageWidth - margin, yPos);
                    yPos += 5;
                    doc.setFont(undefined, 'normal');
                }

                const ref = String(item.id || `REF-${index + 1}`);
                const descripcion = `${String(item?.kit?.name || item?.producto?.item || 'N/A')}${item?.kit?.extension?.name ? ` - ${String(item.kit.extension.name)}` : ''}${item?.medida ? ` (${String(item.medida)})` : ''}`;
                const solicitada = item?.necesidadProyecto?.cantidadComprometida 
                    ? String(Number(item.necesidadProyecto.cantidadComprometida).toFixed(0))
                    : '0';
                const despachada = String(Number(item?.cantidad || 0).toFixed(0));

                // REF/SKU
                doc.text(ref, colRef, yPos);
                
                // Descripción (con manejo de texto largo)
                const descripcionWidth = colSolicitada - colDesc - 5;
                const descripcionLines = doc.splitTextToSize(String(descripcion), descripcionWidth);
                doc.text(descripcionLines, colDesc, yPos);
                
                // Cantidades (alineadas a la derecha)
                const solicitadaWidth = doc.getTextWidth(solicitada);
                doc.text(solicitada, colSolicitada + (20 - solicitadaWidth), yPos);
                
                const despachadaWidth = doc.getTextWidth(despachada);
                doc.text(despachada, colDespachada + (20 - despachadaWidth), yPos);
                
                // Incrementar Y según la altura de la descripción
                yPos += Math.max(7, descripcionLines.length * 5);
            });

            yPos += 10;

            // ========== OBSERVACIONES Y RESUMEN ==========
            // Verificar si necesita nueva página
            if (yPos > pageHeight - 80) {
                doc.addPage();
                yPos = margin;
            }

            const observacionesStartY = yPos;
            const resumenX = pageWidth / 2 + 10;

            // Observaciones (izquierda)
            doc.setFont(undefined, 'bold');
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            doc.text('OBSERVACIONES / NOTAS DE ENTREGA', margin, yPos);
            yPos += 7;

            doc.setFont(undefined, 'normal');
            doc.setFontSize(9);
            const observacionesWidth = pageWidth / 2 - margin - 5;
            
            if (observaciones) {
                const notas = doc.splitTextToSize(String(observaciones), observacionesWidth);
                doc.text(notas, margin, yPos);
                yPos += notas.length * 5 + 5;
            } else {
                doc.setTextColor(...colorGris);
                doc.text('Añadir comentarios sobre la entrega...', margin, yPos);
                doc.setTextColor(0, 0, 0);
                yPos += 10;
            }

            // Resumen (derecha)
            yPos = observacionesStartY;
            doc.setFont(undefined, 'bold');
            doc.setFontSize(9);
            doc.text('RESUMEN', resumenX, yPos);
            yPos += 7;

            doc.setFont(undefined, 'normal');
            doc.setFontSize(9);
            doc.text(`Total Referencias: ${String(totalReferencias)}`, resumenX, yPos);
            yPos += 6;
            doc.text(`Total Unidades Solicitadas: ${String(totalSolicitada.toFixed(0))}`, resumenX, yPos);
            yPos += 6;

            // Total Despachadas destacado
            doc.setFont(undefined, 'bold');
            doc.setTextColor(...colorAzul);
            doc.setFontSize(12);
            const totalDespachadaTexto = String(totalDespachada.toFixed(0));
            doc.text(`Total Unidades Despachadas: ${totalDespachadaTexto}`, resumenX, yPos);

            // ========== LÍNEAS DE FIRMA Y PIE DE PÁGINA (casi al final de la página) ==========
            // Configurar fuente para calcular el texto del pie de página
            doc.setFontSize(8);
            doc.setFont(undefined, 'normal');
            
            // Calcular posición cerca del final de la página
            // Texto del pie de página
            const textoPiePagina = 'Los materiales con este documento recibido, los aceptamos a satisfacción, acorde a nuestro pedido y con el nivel de calidad requerido. No se aceptan reclamaciones posteriores a la entrega aceptada.';
            // Asegurar que el ancho respete los márgenes izquierdo y derecho
            const anchoTextoPie = pageWidth - (margin * 2);
            // Calcular líneas para estimar altura (pero usaremos maxWidth al dibujar)
            const lineasPiePagina = doc.splitTextToSize(textoPiePagina, anchoTextoPie);
            const alturaPiePagina = lineasPiePagina.length * 4 + 15; // Altura del texto + separador + margen
            
            // Posición de las firmas: aproximadamente 50mm del borde inferior
            const espacioDesdeAbajo = 50;
            const firmaY = pageHeight - espacioDesdeAbajo;
            
            // Verificar si hay suficiente espacio en la página actual
            if (firmaY < yPos + 20) {
                // Si no hay espacio, crear nueva página
                doc.addPage();
                yPos = margin;
            } else {
                // Si hay espacio, mover yPos a la posición de las firmas
                yPos = firmaY - 15; // Dejar un poco de espacio antes de las firmas
            }

            const firmaLineWidth = 60;
            const espacioEntreFirmas = pageWidth - (margin * 2) - (firmaLineWidth * 2);
            const firmaIzquierdaX = margin;
            const firmaDerechaX = margin + firmaLineWidth + espacioEntreFirmas;

            // Línea izquierda - Despachado
            doc.setDrawColor(0, 0, 0); 
            doc.setLineWidth(0.5);
            doc.line(firmaIzquierdaX, firmaY, firmaIzquierdaX + firmaLineWidth, firmaY);
            
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            const textoDespachado = 'Despachado';
            const textoDespachadoWidth = doc.getTextWidth(textoDespachado);
            doc.text(textoDespachado, firmaIzquierdaX + (firmaLineWidth - textoDespachadoWidth) / 2, firmaY + 5);

            // Línea derecha - Recibido
            doc.line(firmaDerechaX, firmaY, firmaDerechaX + firmaLineWidth, firmaY);
            
            const textoRecibido = 'Recibido';
            const textoRecibidoWidth = doc.getTextWidth(textoRecibido);
            doc.text(textoRecibido, firmaDerechaX + (firmaLineWidth - textoRecibidoWidth) / 2, firmaY + 5);

            // ========== PIE DE PÁGINA (justo después de las firmas, cerca del final) ==========
            const piePaginaY = firmaY + 15; // 15mm después de las firmas
            
            // Línea separadora antes del pie de página
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.3);
            doc.line(margin, piePaginaY, pageWidth - margin, piePaginaY);

            // Texto del pie de página (la fuente ya está configurada arriba)
            doc.setTextColor(...colorGris);
            // Dibujar el texto completo respetando el margen derecho usando maxWidth
            const textoPieY = piePaginaY + 8;
            doc.text(textoPiePagina, margin, textoPieY, {
                maxWidth: anchoTextoPie,
                align: 'left'
            });

            // Calcular altura del texto del pie de página para saber dónde poner "Remisionado por"
            const lineasPiePaginaCalculadas = doc.splitTextToSize(textoPiePagina, anchoTextoPie);
            const alturaTextoPie = lineasPiePaginaCalculadas.length * 4; // Aproximadamente 4mm por línea
            
            // Texto "Remisionado por [usuario]" - debajo del texto del pie de página
            const remisionadoPorY = textoPieY + alturaTextoPie + 6; // 6mm de separación
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0); // Negro para que sea más visible
            const textoRemisionado = `Remisionado por ${usuarioActual}`;
            doc.text(textoRemisionado, margin, remisionadoPorY, {
                maxWidth: anchoTextoPie,
                align: 'left'
            });

            // Descargar PDF
            doc.save(`${remision.numeroRemision}.pdf`);
            dispatch(actions.HandleAlerta('PDF generado y descargado exitosamente', 'positive'));
        } catch (error) {
            console.error('[REMISION] Error al generar PDF:', error);
            dispatch(actions.HandleAlerta('Error al generar el PDF', 'mistake'));
        }
    };

    const handleRemisionar = async () => {
        try {
            // TODO: Implementar endpoint para remisionar
            console.log('[REMISION] Remisionar:', remision.numeroRemision);
            dispatch(actions.HandleAlerta('Remisión procesada exitosamente', 'positive'));
        } catch (error) {
            console.error('[REMISION] Error al remisionar:', error);
            dispatch(actions.HandleAlerta('Error al procesar la remisión', 'mistake'));
        }
    };

    // Calcular totales
    const totalReferencias = remision?.itemRemisions?.length || 0;
    const totalSolicitada = remision?.itemRemisions?.reduce((sum, item) => 
        sum + Number(item?.necesidadProyecto?.cantidadComprometida || 0), 0) || 0;
    const totalDespachada = remision?.itemRemisions?.reduce((sum, item) => 
        sum + Number(item?.cantidad || 0), 0) || 0;

    return (
        <div className="modal" style={{ zIndex: 15 }}>
            <div className="hiddenModal" onClick={onClose}></div>
            <div className="containerModal" style={{ 
                maxWidth: '1000px',
                width: '100%',
                padding: '0',
                borderRadius: '12px',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: '#fff'
            }}>
                {/* Header con información de empresa y número de remisión */}
                <div style={{
                    padding: '30px',
                    borderBottom: '1px solid #e0e0e0',
                    position: 'relative'
                }}>
                    <button 
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            right: '20px',
                            top: '20px',
                            background: 'transparent',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#666',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = '#f0f0f0';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        ✕
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        {/* Información de la empresa */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: '#e3f2fd',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '12px',
                                    fontSize: '20px'
                                }}>
                                    🏢
                                </div>
                                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#333' }}>
                                    Modulares Costa Gomez SAS
                                </h2>
                            </div>
                            <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
                                <div>NIT: 901165150-3</div>
                                <div>CL 11 13 15, Cali - Valle del Cauca</div>
                                <div>PBX: 3739940</div>
                            </div>
                        </div>

                        {/* Número de remisión y fecha */}
                        <div style={{ textAlign: 'right' }}>
                            <div style={{
                                background: '#2f8bfd',
                                color: '#fff',
                                padding: '20px 30px',
                                borderRadius: '8px',
                                marginBottom: '10px',
                                minWidth: '150px'
                            }}>
                                <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '5px' }}>
                                    REMISIÓN NO.
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: '700' }}>
                                    {remision.numeroRemision}
                                </div>
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                    FECHA DE EMISIÓN:
                                </label>
                                {editandoFechaRemision ? (
                                    <input
                                        type="datetime-local"
                                        value={fechaRemision}
                                        onChange={(e) => setFechaRemision(e.target.value)}
                                        onBlur={() => {
                                            setEditandoFechaRemision(false);
                                            handleGuardarCambios();
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setEditandoFechaRemision(false);
                                                handleGuardarCambios();
                                            }
                                        }}
                                        autoFocus
                                        style={{
                                            padding: '4px 8px',
                                            fontSize: '12px',
                                            border: '1px solid #2f8bfd',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box',
                                            outline: 'none',
                                            width: '100%'
                                        }}
                                    />
                                ) : (
                                    <div
                                        onClick={() => setEditandoFechaRemision(true)}
                                        style={{
                                            padding: '4px 8px',
                                            fontSize: '12px',
                                            border: '1px solid transparent',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            display: 'inline-block',
                                            minWidth: '150px'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.background = '#f0f0f0';
                                            e.currentTarget.style.border = '1px dashed #ddd';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.border = '1px solid transparent';
                                        }}
                                    >
                                        {fechaRemision ? formatearFecha(fechaRemision) : formatearFecha(remision.createdAt)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenido principal */}
                <div style={{ padding: '30px' }}>
                    {/* Información del cliente y detalles de envío */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '25px',
                        marginBottom: '30px'
                    }}>
                        {/* Información del cliente */}
                        <div style={{
                            background: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                marginBottom: '15px',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#333'
                            }}>
                                <span style={{ marginRight: '8px' }}>👤</span>
                                INFORMACIÓN DEL CLIENTE
                            </div>
                            <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.8' }}>
                                <div><strong>Nombre/Razón:</strong> {remision?.requisicion?.cotizacion?.client?.name || 'N/A'}</div>
                                <div><strong>NIT/C.C.:</strong> {remision?.requisicion?.cotizacion?.client?.nit || 'N/A'}</div>
                                <div><strong>Dirección:</strong> {remision?.requisicion?.cotizacion?.client?.direccion || 'N/A'}</div>
                            </div>
                        </div>

                        

                        {/* Detalles de envío - EDITABLE */}
                        <div style={{
                            background: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                marginBottom: '15px',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#333'
                            }}>
                                <span style={{ marginRight: '8px' }}>🚚</span>
                                Detalles del TRANSPORTADOR
                            </div>
                            <div style={{ fontSize: '13px', color: '#666' }}>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                        Placa:
                                    </label>
                                    {editandoPlaca ? (
                                        <input
                                            type="text"
                                            value={placa}
                                            onChange={(e) => setPlaca(e.target.value)}
                                            onBlur={() => {
                                                setEditandoPlaca(false);
                                                handleGuardarCambios();
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    setEditandoPlaca(false);
                                                    handleGuardarCambios();
                                                }
                                            }}
                                            placeholder="ABC123"
                                            autoFocus
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                fontSize: '13px',
                                                border: '1px solid #2f8bfd',
                                                borderRadius: '6px',
                                                boxSizing: 'border-box',
                                                outline: 'none'
                                            }}
                                        />
                                    ) : (
                                        <div
                                            onClick={() => setEditandoPlaca(true)}
                                            style={{
                                                padding: '8px 12px',
                                                fontSize: '13px',
                                                border: '1px solid transparent',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                minHeight: '34px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                background: placa ? 'transparent' : '#f5f5f5',
                                                color: placa ? '#333' : '#999'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = '#f0f0f0';
                                                e.currentTarget.style.border = '1px dashed #ddd';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = placa ? 'transparent' : '#f5f5f5';
                                                e.currentTarget.style.border = '1px solid transparent';
                                            }}
                                        >
                                            {placa || 'Click para editar...'}
                                        </div>
                                    )}
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                        Guía:
                                    </label>
                                    {editandoGuia ? (
                                        <input
                                            type="text"
                                            value={guia}
                                            onChange={(e) => setGuia(e.target.value)}
                                            onBlur={() => {
                                                setEditandoGuia(false);
                                                handleGuardarCambios();
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    setEditandoGuia(false);
                                                    handleGuardarCambios();
                                                }
                                            }}
                                            placeholder="Número de guía"
                                            autoFocus
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                fontSize: '13px',
                                                border: '1px solid #2f8bfd',
                                                borderRadius: '6px',
                                                boxSizing: 'border-box',
                                                outline: 'none'
                                            }}
                                        />
                                    ) : (
                                        <div
                                            onClick={() => setEditandoGuia(true)}
                                            style={{
                                                padding: '8px 12px',
                                                fontSize: '13px',
                                                border: '1px solid transparent',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                minHeight: '34px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                background: guia ? 'transparent' : '#f5f5f5',
                                                color: guia ? '#333' : '#999'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = '#f0f0f0';
                                                e.currentTarget.style.border = '1px dashed #ddd';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = guia ? 'transparent' : '#f5f5f5';
                                                e.currentTarget.style.border = '1px solid transparent';
                                            }}
                                        >
                                            {guia || 'Click para editar...'}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                        Cajas:
                                    </label>
                                    {editandoCajas ? (
                                        <input
                                            type="text"
                                            value={cajas}
                                            onChange={(e) => setCajas(e.target.value)}
                                            onBlur={() => {
                                                setEditandoCajas(false);
                                                handleGuardarCambios();
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    setEditandoCajas(false);
                                                    handleGuardarCambios();
                                                }
                                            }}
                                            placeholder="Número de cajas"
                                            autoFocus
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                fontSize: '13px',
                                                border: '1px solid #2f8bfd',
                                                borderRadius: '6px',
                                                boxSizing: 'border-box',
                                                outline: 'none'
                                            }}
                                        />
                                    ) : (
                                        <div
                                            onClick={() => setEditandoCajas(true)}
                                            style={{
                                                padding: '8px 12px',
                                                fontSize: '13px',
                                                border: '1px solid transparent',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                minHeight: '34px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                background: cajas ? 'transparent' : '#f5f5f5',
                                                color: cajas ? '#333' : '#999'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = '#f0f0f0';
                                                e.currentTarget.style.border = '1px dashed #ddd';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = cajas ? 'transparent' : '#f5f5f5';
                                                e.currentTarget.style.border = '1px solid transparent';
                                            }}
                                        >
                                            {cajas || 'Click para editar...'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{
                            background: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                marginBottom: '15px',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#333'
                            }}>
                                <span style={{ marginRight: '8px' }}>👤</span>
                                DETALLES
                            </div>
                            <div style={{ fontSize: '13px', color: '#666' }}>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                        Vendedor:
                                    </label>
                                    <div style={{
                                        padding: '8px 12px',
                                        fontSize: '13px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '6px',
                                        background: '#f5f5f5',
                                        color: '#666'
                                    }}>
                                        {remision?.requisicion?.cotizacion?.user.name || remision?.vendedor || remision?.requisicion?.cotizacion?.vendedor?.name || remision?.requisicion?.cotizacion?.vendedor?.nombre || 'N/A'}
                                    </div>
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                        OC.Nro:
                                    </label>
                                    {editandoOcNumero ? (
                                        <input
                                            type="text"
                                            value={ocNumero}
                                            onChange={(e) => setOcNumero(e.target.value)}
                                            onBlur={() => {
                                                setEditandoOcNumero(false);
                                                handleGuardarCambios();
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    setEditandoOcNumero(false);
                                                    handleGuardarCambios();
                                                }
                                            }}
                                            placeholder="Número de orden de compra"
                                            autoFocus
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                fontSize: '13px',
                                                border: '1px solid #2f8bfd',
                                                borderRadius: '6px',
                                                boxSizing: 'border-box',
                                                outline: 'none'
                                            }}
                                        />
                                    ) : (
                                        <div
                                            onClick={() => setEditandoOcNumero(true)}
                                            style={{
                                                padding: '8px 12px',
                                                fontSize: '13px',
                                                border: '1px solid transparent',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                minHeight: '34px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                background: ocNumero ? 'transparent' : '#f5f5f5',
                                                color: ocNumero ? '#333' : '#999'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = '#f0f0f0';
                                                e.currentTarget.style.border = '1px dashed #ddd';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = ocNumero ? 'transparent' : '#f5f5f5';
                                                e.currentTarget.style.border = '1px solid transparent';
                                            }}
                                        >
                                            {ocNumero || 'Click para editar...'}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                        OV.Nro:
                                    </label>
                                    {editandoOvNumero ? (
                                        <input
                                            type="text"
                                            value={ovNumero}
                                            onChange={(e) => setOvNumero(e.target.value)}
                                            onBlur={() => {
                                                setEditandoOvNumero(false);
                                                handleGuardarCambios();
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    setEditandoOvNumero(false);
                                                    handleGuardarCambios();
                                                }
                                            }}
                                            placeholder="Número de orden de venta"
                                            autoFocus
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                fontSize: '13px',
                                                border: '1px solid #2f8bfd',
                                                borderRadius: '6px',
                                                boxSizing: 'border-box',
                                                outline: 'none'
                                            }}
                                        />
                                    ) : (
                                        <div
                                            onClick={() => setEditandoOvNumero(true)}
                                            style={{
                                                padding: '8px 12px',
                                                fontSize: '13px',
                                                border: '1px solid transparent',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                minHeight: '34px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                background: ovNumero ? 'transparent' : '#f5f5f5',
                                                color: ovNumero ? '#333' : '#999'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = '#f0f0f0';
                                                e.currentTarget.style.border = '1px dashed #ddd';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = ovNumero ? 'transparent' : '#f5f5f5';
                                                e.currentTarget.style.border = '1px solid transparent';
                                            }}
                                        >
                                            {ovNumero || 'Click para editar...'}
                                        </div>

                                        
                                    )}
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                        Nro. Cotización:
                                    </label>
                                    <div style={{
                                        padding: '8px 12px',
                                        fontSize: '13px',
                                        borderRadius: '6px',
                                        color: '#666'
                                    }}>
                                        {Number(remision?.requisicionId + 21719)}
                                    </div>
                                    {console.log('remision', remision)}
                                </div>
                            </div>
                        </div><br /><br />

                    {/* Tabla de productos */}
                    <div style={{ marginBottom: '30px' }}>
                        <table style={{ 
                            width: '100%', 
                            borderCollapse: 'collapse',
                            background: '#fff',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}>
                            <thead style={{ background: '#f8f9fa' }}>
                                <tr>
                                    <th style={{ 
                                        padding: '15px', 
                                        textAlign: 'left',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        color: '#666',
                                        borderBottom: '2px solid #e0e0e0'
                                    }}>
                                        Código
                                    </th>
                                    <th style={{ 
                                        padding: '15px', 
                                        textAlign: 'left',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        color: '#666',
                                        borderBottom: '2px solid #e0e0e0'
                                    }}>
                                        DESCRIPCIÓN DEL PRODUCTO
                                    </th>
                                    <th style={{ 
                                        padding: '15px', 
                                        textAlign: 'center',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        color: '#666',
                                        borderBottom: '2px solid #e0e0e0'
                                    }}>
                                        CANT. SOLICITADA
                                    </th>
                                    <th style={{ 
                                        padding: '15px', 
                                        textAlign: 'center',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        color: '#666',
                                        borderBottom: '2px solid #e0e0e0'
                                    }}>
                                        CANT. DESPACHADA
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {remision?.itemRemisions?.map((item, index) => (
                                    <tr key={item.id || index}>
                                        <td style={{ 
                                            padding: '15px', 
                                            borderBottom: '1px solid #e0e0e0',
                                            fontSize: '13px',
                                            color: '#333'
                                        }}>
                                            {item?.kitId || item?.productoId}
                                        </td>
                                        <td style={{ 
                                            padding: '15px', 
                                            borderBottom: '1px solid #e0e0e0',
                                            fontSize: '13px',
                                            color: '#333'
                                        }}>
                                            {item?.kit?.name || item?.producto?.item || 'N/A'}
                                            {item?.kit?.extension?.name && ` - ${item.kit.extension.name}`}
                                            {item?.medida && ` (${item.medida})`}
                                        </td>
                                        <td style={{ 
                                            padding: '15px', 
                                            textAlign: 'center',
                                            borderBottom: '1px solid #e0e0e0',
                                            fontSize: '13px',
                                            color: '#333'
                                        }}>
                                            {item?.necesidadProyecto?.cantidadComprometida 
                                                ? Number(item.necesidadProyecto.cantidadComprometida).toFixed(0) 
                                                : '0'}
                                        </td>
                                        <td style={{ 
                                            padding: '15px', 
                                            textAlign: 'center',
                                            borderBottom: '1px solid #e0e0e0',
                                            fontSize: '13px',
                                            color: '#333'
                                        }}>
                                            <span style={{
                                                background: '#e3f2fd',
                                                color: '#1976d2',
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                fontWeight: '600',
                                                display: 'inline-block'
                                            }}>
                                                {Number(item?.cantidad || 0).toFixed(0)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Observaciones y resumen */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '25px',
                        marginBottom: '30px'
                    }}>
                        {/* Observaciones - EDITABLE */}
                        <div>
                            <div style={{ 
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '10px',
                                color: '#333'
                            }}>
                                OBSERVACIONES / NOTAS DE ENTREGA
                            </div>
                            {editandoObservaciones ? (
                                <textarea
                                    value={observaciones}
                                    onChange={(e) => setObservaciones(e.target.value)}
                                    onBlur={() => {
                                        setEditandoObservaciones(false);
                                        handleGuardarCambios();
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                            setEditandoObservaciones(false);
                                            handleGuardarCambios();
                                        }
                                    }}
                                    placeholder="Añadir comentarios sobre la entrega... (Escape para guardar)"
                                    rows="4"
                                    autoFocus
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        fontSize: '13px',
                                        border: '1px solid #2f8bfd',
                                        borderRadius: '8px',
                                        boxSizing: 'border-box',
                                        resize: 'vertical',
                                        fontFamily: 'inherit',
                                        lineHeight: '1.5',
                                        outline: 'none'
                                    }}
                                />
                            ) : (
                                <div
                                    onClick={() => setEditandoObservaciones(true)}
                                    style={{
                                        width: '100%',
                                        minHeight: '100px',
                                        padding: '12px',
                                        fontSize: '13px',
                                        border: '1px solid transparent',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        background: observaciones ? 'transparent' : '#f5f5f5',
                                        color: observaciones ? '#333' : '#999',
                                        lineHeight: '1.5',
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = '#f0f0f0';
                                        e.currentTarget.style.border = '1px dashed #ddd';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = observaciones ? 'transparent' : '#f5f5f5';
                                        e.currentTarget.style.border = '1px solid transparent';
                                    }}
                                >
                                    {observaciones || 'Click para añadir comentarios sobre la entrega...'}
                                </div>
                            )}
                        </div>

                        {/* Resumen */}
                        <div style={{
                            background: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0'
                        }}>
                            <div style={{ 
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '15px',
                                color: '#333'
                            }}>
                                RESUMEN
                            </div>
                            <div style={{ fontSize: '13px', color: '#666', lineHeight: '2' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span>Total Referencias:</span>
                                    <span style={{ fontWeight: '600' }}>{totalReferencias}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span>Total Unidades Solicitadas:</span>
                                    <span style={{ fontWeight: '600' }}>{totalSolicitada.toFixed(0)}</span>
                                </div>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    paddingTop: '10px',
                                    borderTop: '1px solid #e0e0e0',
                                    marginTop: '10px'
                                }}>
                                    <span style={{ fontWeight: '600' }}>Total Unidades Despachadas:</span>
                                    <span style={{ 
                                        fontWeight: '700', 
                                        fontSize: '18px',
                                        color: '#2f8bfd'
                                    }}>
                                        {totalDespachada.toFixed(0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '15px', 
                        justifyContent: 'space-between',
                        paddingTop: '20px',
                        borderTop: '1px solid #e0e0e0'
                    }}>
                        <button
                            onClick={handleGuardarCambios}
                            disabled={guardando}
                            style={{
                                padding: '12px 24px',
                                fontSize: '14px',
                                fontWeight: '600',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                background: '#fff',
                                color: '#666',
                                cursor: guardando ? 'not-allowed' : 'pointer',
                                opacity: guardando ? 0.6 : 1
                            }}
                        >
                            {guardando ? 'Guardando...' : '💾 Guardar Cambios'}
                        </button>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button
                                onClick={handleDescargarPDF}
                                style={{
                                    padding: '12px 24px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    background: '#f5f5f5',
                                    color: '#333',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = '#e0e0e0';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = '#f5f5f5';
                                }}
                            >
                                📥 Descargar PDF
                            </button>

                            {remision.estado === 'Activa' && (
                                <button
                                    onClick={handleRemisionar}
                                    style={{
                                        padding: '12px 24px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        border: 'none',
                                        borderRadius: '6px',
                                        background: '#2f8bfd',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = '#1976d2';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = '#2f8bfd';
                                    }}
                                >
                                    ✓ Remisionar Despacho
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
