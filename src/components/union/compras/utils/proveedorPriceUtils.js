/**
 * Precio base sin IVA desde catálogo proveedor (MP: price, PT: productPrice).
 * En BD el base imponible está en `descuentos` (nombre legacy, no es descuento comercial).
 */
export const getPrecioBaseSinIva = (priceRecord) => {
    if (!priceRecord) return 0;

    const base = priceRecord.descuentos;
    if (base != null && base !== '' && Number(base) > 0) {
        return Number(base);
    }

    const legacy = priceRecord.precio ?? priceRecord.price;
    if (legacy != null && legacy !== '' && Number(legacy) > 0) {
        return Number(legacy);
    }

    const conIva = Number(priceRecord.valor || 0);
    if (conIva > 0) {
        return Math.round(conIva / 1.19);
    }

    return 0;
};
