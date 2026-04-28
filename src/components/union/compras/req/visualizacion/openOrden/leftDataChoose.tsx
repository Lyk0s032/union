import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { MdSearch } from 'react-icons/md';
import ItemMPOrden from './itemMPOrden';
import ResultsSearch from './search/resultsSearch';

export default function LeftDataChoose() {
    const [params, setParams] = useSearchParams();
    const admin = useSelector((state: any) => state.admin || state.administration || {});
    const requisicion = useSelector((state: any) => state.requisicion);

    const orden = admin.ordenCompras;
    const loadingOrden = !!admin.loadingOrdenCompras;
    const proveedorId = orden?.proveedorId || orden?.proveedor?.id || null;
    const itemSearchActivo = params.get('itemSearch') === '1';

    const consolidado = requisicion?.realProyectosRequisicion?.consolidado;

    const itemsFiltrados = useMemo(() => {
        if (!Array.isArray(consolidado)) return [];
        if (!proveedorId) return [];
        const pv = Number(proveedorId);
        return consolidado
            .filter((m: any) => (m?.tipo === 'materia' || m?.tipo === 'producto'))
            .filter((m: any) => Array.isArray(m?.precios) && m.precios.some((p: any) => Number(p?.proveedorId) === pv));
    }, [consolidado, proveedorId]);

    /** IDs ya listados en la columna principal (no repetir en búsqueda). */
    const excludeSearchIds = useMemo(() => {
        const materia = new Set<number>();
        const producto = new Set<number>();
        for (const m of itemsFiltrados) {
            const id = Number(m?.id);
            if (!Number.isFinite(id)) continue;
            if (m?.tipo === 'producto') producto.add(id);
            else materia.add(id);
        }
        return { materia, producto };
    }, [itemsFiltrados]);


    const toggleBuscar = () => {
        const next = new URLSearchParams(params);
        if (itemSearchActivo) {
            next.delete('itemSearch');
        } else {
            next.set('itemSearch', '1');
        }
        setParams(next);
    };

    const cerrarBusqueda = () => {
        const next = new URLSearchParams(params);
        next.delete('itemSearch');
        setParams(next);
    };

    return (
        <div className="leftDataChoose">
            <div className="headerLeftData" style={{ paddingLeft: '10px', paddingRight: '10px', boxSizing: 'border-box' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 12,
                        flexWrap: 'wrap',
                    }}
                >
                    <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                        <h1 style={{ marginTop: 0 }}>
                            {itemSearchActivo
                                ? 'Buscar ítems del proveedor'
                                : 'Materia prima necesidad que el proveedor puede suministrar'}
                        </h1>
                        <span>
                            {itemSearchActivo
                                ? 'Catálogo con precio activo para este proveedor (fuera del consolidado).'
                                : 'Esta lista se filtra por el proveedor asociado a la orden de compra.'}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={toggleBuscar}
                        title={itemSearchActivo ? 'Ver lista de necesidad' : 'Buscar otros ítems'}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 42,
                            height: 42,
                            borderRadius: 8,
                            border: '1px solid #ccc',
                            background: itemSearchActivo ? '#e8f4ff' : '#fff',
                            cursor: 'pointer',
                            flexShrink: 0,
                        }}
                    >
                        <MdSearch size={22} color="#1890ff" />
                    </button>
                </div>
            </div>

            {itemSearchActivo ? (
                <ResultsSearch
                    proveedorId={proveedorId}
                    onCloseSearch={cerrarBusqueda}
                    excludeMateriaIds={excludeSearchIds.materia}
                    excludeProductoIds={excludeSearchIds.producto}
                />
            ) : (
                <div className="bodyLeftData">
                    {loadingOrden && (
                        <p style={{ padding: '12px 0', color: '#666' }}>Cargando proveedor de la orden...</p>
                    )}

                    {!loadingOrden && !proveedorId && (
                        <p style={{ padding: '12px 0', color: '#666' }}>
                            Selecciona una orden de compra para ver los ítems disponibles para ese proveedor.
                        </p>
                    )}

                    {!loadingOrden && proveedorId && (!Array.isArray(consolidado) || consolidado.length === 0) && (
                        <p style={{ padding: '12px 0', color: '#666' }}>
                            No hay consolidado cargado aún (analiza una requisición primero).
                        </p>
                    )}

                    {!loadingOrden && proveedorId && Array.isArray(consolidado) && itemsFiltrados.length === 0 && (
                        <p style={{ padding: '12px 0', color: '#666' }}>
                            No hay materias/productos para este proveedor.
                        </p>
                    )}

                    {!loadingOrden &&
                        proveedorId &&
                        itemsFiltrados.map((m: any) => {
                            const faltante = Math.max(0, Number(Number(m.totalCantidad || 0) - Number(m.entregado || 0)));
                            const tipoLabel = m.tipo === 'producto' ? 'Producto terminado' : 'Materia prima';
                            return (
                                <ItemMPOrden
                                    key={`${m.tipo}-${m.id}`}
                                    codigo={m.id}
                                    nombre={m.nombre}
                                    medida={m.medida}
                                    cantidadTotal={faltante}
                                    unidad={m.unidad}
                                    tipo={tipoLabel}
                                />
                            );
                        })}
                </div>
            )}
        </div>
    );
}   