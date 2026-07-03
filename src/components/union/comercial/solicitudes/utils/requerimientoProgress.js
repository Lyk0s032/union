export const isProductoTipo = (tipo) => tipo === 'producto';

export const isHijoLeido = (hijo, tipoGrupo) => {
    const esProducto = isProductoTipo(tipoGrupo) || hijo?.tipo === 'producto';
    if (esProducto) {
        return !!(hijo?.leidoCompras || hijo?.leidoProduccion);
    }
    return !!hijo?.leidoProduccion;
};

export const getHijoProgreso = (hijo, tipoGrupo = 'kit') => {
    const leido = isHijoLeido(hijo, tipoGrupo);
    if (hijo.state === 'finish') return 100;
    if (leido && hijo.state === 'creando') return 70;
    if (leido) return 30;
    return 0;
};

export const getHijoEstadoLabel = (hijo, tipoGrupo = 'kit') => {
    const leido = isHijoLeido(hijo, tipoGrupo);
    if (hijo.state === 'finish') return { label: 'Completada', class: 'completed' };
    if (leido && hijo.state === 'creando') return { label: 'En creación', class: 'creating' };
    if (leido) return { label: 'En progreso', class: 'progress' };
    return { label: 'Pendiente', class: 'pending' };
};

export const getContenedorProgreso = (hijos = [], tipoGrupo = 'kit') => {
    if (!hijos.length) return 0;
    const total = hijos.reduce((sum, hijo) => sum + getHijoProgreso(hijo, tipoGrupo), 0);
    return Math.round(total / hijos.length);
};

export const getContenedorEstadoLabel = (hijos = [], tipoGrupo = 'kit') => {
    if (!hijos.length) return { label: 'Sin requerimientos', class: 'pending' };
    if (hijos.every((h) => h.state === 'finish')) return { label: 'Completada', class: 'completed' };
    if (hijos.some((h) => isHijoLeido(h, tipoGrupo) || h.state === 'creando')) {
        return { label: 'En progreso', class: 'progress' };
    }
    return { label: 'Pendiente', class: 'pending' };
};

export const getGrupoLabel = (tipo, hijosCount = 0) => {
    if (isProductoTipo(tipo)) return `Grupo de Productos (${hijosCount})`;
    return `Grupo de Kits (${hijosCount})`;
};

export const getItemLabel = (tipo) => (isProductoTipo(tipo) ? 'Producto terminado' : 'Kit');
