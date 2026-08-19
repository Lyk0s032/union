export const getNumeroPedidoFromRequisicion = (req) => {
    if (!req) return null;
    const cotizacionId = req.cotizacionId ?? req.cotizacion?.id;
    if (cotizacionId == null || cotizacionId === '') return null;
    return Number(cotizacionId) + 21719;
};

export const getRequisicionesFromOrden = (orden) => {
    if (!orden || !Array.isArray(orden.requisiciones)) return [];
    return orden.requisiciones;
};
