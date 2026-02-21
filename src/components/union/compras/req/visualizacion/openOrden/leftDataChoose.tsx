import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import ItemMPOrden from './itemMPOrden';

export default function LeftDataChoose() {
    const admin = useSelector((state: any) => state.admin || state.administration || {});
    const requisicion = useSelector((state: any) => state.requisicion);

    const orden = admin.ordenCompras;
    const loadingOrden = !!admin.loadingOrdenCompras;
    const proveedorId = orden?.proveedorId || orden?.proveedor?.id || null;

    const consolidado = requisicion?.realProyectosRequisicion?.consolidado;

    const itemsFiltrados = useMemo(() => {
        if (!Array.isArray(consolidado)) return [];
        if (!proveedorId) return [];
        const pv = Number(proveedorId);
        return consolidado
            .filter((m: any) => (m?.tipo === 'materia' || m?.tipo === 'producto'))
            .filter((m: any) => Array.isArray(m?.precios) && m.precios.some((p: any) => Number(p?.proveedorId) === pv));
    }, [consolidado, proveedorId]); 


    return (
        <div className="leftDataChoose">
            <div className="headerLeftData">
                <h1>Materia prima necesidad que el proveedor puede suministrar</h1>
                <span>
                    Esta lista se filtra por el proveedor asociado a la orden de compra.
                </span>
            </div>

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

                {!loadingOrden && proveedorId && itemsFiltrados.map((m: any) => {
                    const faltante = Math.max(0, Number((Number(m.totalCantidad || 0) - Number(m.entregado || 0))));
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
        </div>
    );
}   