import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// --- CONSTANTES DE COLOR ---
const BG_AZUL_DARK = '#007bff'; 
const BG_DEFAULT = '#ffffff'; 
const COLOR_GRIS = '#666';

// 1. DEFINICIÓN DE ESTILOS (TAMAÑOS DE FUENTE REDUCIDOS)
const styles = StyleSheet.create({
    page: { 
        paddingTop: 30, 
        paddingBottom: 30, 
        paddingHorizontal: 40, 
        fontFamily: 'Helvetica',
        fontSize: 10, // Base para texto más pequeño
        color: '#333',
    },
    // --- Header ---
    headerSection: {
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 5,
    },
    headerTitle: {
        fontSize: 12, // Reducido de 14
        color: BG_AZUL_DARK,
    },
    // --- Barra de Estado Ajustada ---
    statusLabel: {
        fontSize: 10, // Reducido de 12
        color: COLOR_GRIS,
        marginBottom: 5,
    },
    divideStates: {
        flexDirection: 'row',
        justifyContent: 'space-around', 
        alignItems: 'flex-start',
        paddingVertical: 25, // Reducido el padding vertical
        borderBottomWidth: 1,
        borderBottomColor: '#ccc', 
        marginBottom: 15,
    },
    boxLadeCircle: {
        width: '30%',
        textAlign: 'center',
        alignItems: 'center',
    },
    circle: {
        width: 35, // Reducido de 40
        height: 35, // Reducido de 40
        borderRadius: 17.5,
        backgroundColor: BG_DEFAULT,
        borderWidth: 1, 
        borderColor: '#ccc', 
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5, // Reducido el margen
    },
    circleActive: {
        backgroundColor: BG_AZUL_DARK,
        borderColor: BG_AZUL_DARK,
    },
    icon: {
        fontSize: 18, // Reducido de 20
        color: BG_DEFAULT,
    },
    dataText: {
        textAlign: 'center',
    },
    dataTextTitle: {
        fontSize: 12, // Reducido de 14 (Tamaño estándar solicitado)
        fontWeight: 'bold',
        marginBottom: 2,
        color: COLOR_GRIS,
    },
    dataTextTitleActive: {
        color: BG_AZUL_DARK,
    },
    dataTextDate: {
        fontSize: 9, // Reducido de 10
        color: COLOR_GRIS,
    },
    // --- Proveedor (titleDiv) ---
    supplierSection: {
        marginBottom: 15,
    },
    supplierLabel: {
        fontSize: 10, // Reducido de 12
        color: COLOR_GRIS,
    },
    supplierName: {
        marginTop: 2,
        fontSize: 18, // Reducido de 26 (Se mantiene grande, pero menos dominante)
        color: BG_AZUL_DARK,
        marginBottom: 3,
    },
    supplierNit: {
        fontSize: 10, // Mantenido en 12
        color: COLOR_GRIS,
        marginBottom: 8,
    },
    // --- Tabla de Ítems (itemsOrden) ---
    tableContainer: {
        marginTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f8f8f8',
        paddingVertical: 8, // Reducido
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerColDesc: { width: '60%', paddingLeft: 5, fontSize: 10, color: COLOR_GRIS }, // Reducido a 10
    headerColQty: { width: '20%', fontSize: 10, color: COLOR_GRIS },
    headerColPrice: { width: '20%', textAlign: 'right', paddingRight: 5, fontSize: 10, color: COLOR_GRIS },
    
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8, // Reducido
    },
    itemColDesc: { 
        width: '60%', 
        paddingLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemColQty: { width: '20%', fontSize: 10, color: COLOR_GRIS }, // Reducido a 10
    itemColPrice: { width: '20%', textAlign: 'right', paddingRight: 5, fontSize: 10, color: COLOR_GRIS }, // Reducido a 10

    itemLetterCircle: {
        width: 20, // Reducido
        height: 20, // Reducido
        borderRadius: 10,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8, // Reducido
    },
    itemLetterText: {
        fontSize: 9, // Reducido
        color: BG_DEFAULT,
    },
    itemData: {
        flexDirection: 'column',
    },
    itemH3: {
        fontSize: 10, // Mantenido en 12 (Nombre principal del ítem)
        color: 'black',
    },
    itemSpan: {
        fontSize: 10, // Reducido a 10 (Descripción secundaria)
        color: COLOR_GRIS,
    },
    // --- Total Price (titleDiv Lade) ---
    totalSection: {
        marginTop: 30, // Reducido
        textAlign: 'right',
        paddingHorizontal: 30, 
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    priceContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        paddingVertical: 8, // Reducido
    },
    priceLabel: {
        fontSize: 10, // Reducido a 10
        color: COLOR_GRIS,
        marginBottom: 3,
    },
    priceTotal: {
        fontSize: 20, // Reducido de 24 (Sigue siendo el elemento principal)
        color: BG_AZUL_DARK,
    }
});

// 2. FUNCIONES AUXILIARES (Sin cambios)
const getItemIdentifier = (item) => {
    if (item.materiaId) return { id: item.materiaId, letter: item.materiaId.toString().charAt(0) };
    if (item.productoId) return { id: item.productoId, letter: item.productoId.toString().charAt(0) };
    return { id: '', letter: '?' };
};

// 3. COMPONENTE DEL DOCUMENTO (Sin cambios en la lógica)
const PdfDocument = ({ 
    ordenCompras, 
    creadoFecha, 
    ordenDeCompraTime, 
    aprobadaCompra, 
    OrdenesTotal 
}) => {
    
    const isPreordenActive = true; 
    const isOrdenCompraActive = !!ordenCompras.estadoPago; 
    const isAprobadaActive = !!aprobadaCompra;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                
                {/* 1. Header (Lamento) */}
                

                {/* 2. Barra de Estado */}
                

                {/* 3. Proveedor y Fecha */}
                <View style={styles.supplierSection}>
                    <Text style={styles.supplierLabel}>Proveedor</Text>
                    <Text style={styles.supplierName}>{ordenCompras.proveedor.nombre}</Text>
                    <Text style={styles.supplierNit}>
                        <Text style={{ fontWeight: 'bold' }}>NIT: </Text>
                        {ordenCompras.proveedor.nit}
                    </Text>
                    <Text style={styles.supplierLabel}>{ordenCompras.fecha.split('T')[0]}</Text>
                </View>

                {/* 4. Ítems de la Orden (Tabla) */}
                {ordenCompras.comprasCotizacionItems?.length > 0 && (
                    <View style={styles.tableContainer}>
                        {/* Encabezado de la tabla */}
                        <View style={styles.tableHeader}>
                            <Text style={styles.headerColDesc}>Descripción</Text>
                            <Text style={styles.headerColQty}>Cantidad</Text>
                            <Text style={styles.headerColPrice}>Precio</Text>
                        </View> 
                        
                        {/* Filas de la tabla */}
                        {ordenCompras.comprasCotizacionItems.map((item, i) => {
                            const { id, letter } = getItemIdentifier(item);
                            return (
                                <View style={styles.tableRow} key={i}>
                                    <View style={styles.itemColDesc}>
                                        <View style={styles.itemLetterCircle}>
                                            <Text style={styles.itemLetterText}>{letter}</Text>
                                        </View>
                                        <View style={styles.itemData}>
                                            <Text style={styles.itemH3}>
                                                {item.materium?.description} {item.producto?.item}
                                            </Text>
                                            <Text style={styles.itemSpan}>
                                                {item.materium?.item}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={styles.itemColQty}>{item.cantidad}</Text>
                                    <Text style={styles.itemColPrice}>
                                        $ {new Intl.NumberFormat('es-CO').format(item.precioTotal)}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* 5. Precio Total */}
                <View style={styles.totalSection}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>Precio</Text>
                        <Text style={styles.priceTotal}>
                            $ {new Intl.NumberFormat('es-CO').format(OrdenesTotal)}
                        </Text>
                    </View>
                </View>

            </Page>
        </Document>
    );
};

export default PdfDocument;