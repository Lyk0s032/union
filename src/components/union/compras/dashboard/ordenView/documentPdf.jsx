import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Estilos del PDF (mismo diseño que rightDataOrden.tsx)
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
    notesSection: {
        marginTop: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    notesTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#007bff',
    },
    notesText: {
        fontSize: 10,
        color: '#333',
        lineHeight: 1.5,
    },
});

const PdfDocument = ({ 
    ordenCompras, 
    resumenOrden,
    tieneIva = true
}) => {
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

    const formatearNumero = (num) => {
        // Convertir a número si es string
        const numero = typeof num === 'string' ? parseFloat(num) : (typeof num === 'number' ? num : 0);
        if (isNaN(numero) || numero === 0) return '0';
        return new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(Math.round(numero));
    };

    // Calcular la nota antes del return
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
                        {items.map((item, index) => {
                            const materia = item.materium || {};
                            const producto = item.producto || {};
                            const nombre = producto.item || materia.description || 'Sin nombre';
                            
                            // Convertir valores a números
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

                {/* Agregar notas si existen */}
                {tieneNota && (
                    <View style={pdfStyles.notesSection}>
                        <Text style={pdfStyles.notesTitle}>
                            Notas:
                        </Text>
                        <Text style={pdfStyles.notesText}>
                            {nota}
                        </Text>
                    </View>
                )}
            </Page>
        </Document>
    );
};

export default PdfDocument;
