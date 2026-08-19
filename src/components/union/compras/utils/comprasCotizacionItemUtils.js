export const isServicioLibreItem = (item) => item?.tipo === 'servicio_libre';

export const getComprasItemDisplayName = (item) => {
    if (!item) return 'Sin nombre';
    if (item.descripcionLibre?.trim()) return item.descripcionLibre.trim();
    const producto = item.producto || {};
    const materia = item.materium || item.materia || {};
    return producto.item || materia.description || 'Sin nombre';
};

export const buildRemoveComprasItemBody = (item) => {
    if (isServicioLibreItem(item)) {
        return { comprasCotizacionItemId: item.id };
    }
    return {
        itemId: item.materiumId ? item.materiumId : item.productoId,
        tipo: !item.materiumId ? 'producto' : 'materia',
        comprasId: item.comprasCotizacionId,
    };
};
