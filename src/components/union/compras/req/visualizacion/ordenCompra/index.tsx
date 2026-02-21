import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../../store/action/action';
import NuevaOrdenCompra from './nueva';
import ItemOrdenCompra from './itemOrdenCompra';

export default function OrdenCompra() {
    const [panelAbierto, setPanelAbierto] = useState(false);
    const dispatch = useDispatch();
    const requisicionState = useSelector((state: any) => state.requisicion);
    const idsSeleccionados: number[] = requisicionState.requisicionesSeleccionadas || requisicionState.ids || [];
    const ordenesCompras: any[] | null = requisicionState.cotizacionesCompras || null;

    // Cargar órdenes de compra cuando cambian las requisiciones seleccionadas
    useEffect(() => {
        if (idsSeleccionados && idsSeleccionados.length > 0) {
            (dispatch as any)(actions.axiosToGetCotizacionesCompras(idsSeleccionados));
        }
    }, [idsSeleccionados, dispatch]);

    // Atajo de teclado Ctrl + Shift + O para abrir la nueva orden de compra
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isControl = event.ctrlKey || event.metaKey;
            const key = event.key.toLowerCase();
            const code = event.code;

            // Usamos Ctrl + Shift + O para evitar conflicto con Ctrl + O del navegador
            if (isControl && event.shiftKey && (key === 'o' || code === 'KeyO')) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation?.();
                setPanelAbierto(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown, { capture: true });
        return () => {
            document.removeEventListener('keydown', handleKeyDown, { capture: true });
        };
    }, []);

    // Filtrar órdenes por requisiciones seleccionadas (si hay)
    const ordenesFiltradas = useMemo(() => {
        if (!Array.isArray(ordenesCompras)) return [];
        if (!idsSeleccionados || idsSeleccionados.length === 0) {
            return ordenesCompras;
        }
        return ordenesCompras.filter((orden) =>
            Array.isArray(orden.requisiciones)
                ? orden.requisiciones.some((r: any) => idsSeleccionados.includes(r.id || r.requisicionId))
                : true
        );
    }, [ordenesCompras, idsSeleccionados]);

    return (
        <div className="ordenCompraView">
            <div className="ordenCompraHeader">
                <div>
                    <h1>Órdenes de compra</h1>
                    <span className="subtitulo">
                        Gestiona las órdenes de compra asociadas a estas requisiciones.
                    </span>
                </div>
                <button
                    className="btnPrimario"
                    type="button"
                    onClick={() => setPanelAbierto(true)}
                >
                    Nueva orden de compra
                </button>
            </div>

            {/* Listado de órdenes de compra existentes */}
            <div className="ordenCompraLista">
                {(!ordenesCompras && idsSeleccionados.length > 0) && (
                    <p style={{ padding: '16px', color: '#666' }}>Cargando órdenes de compra...</p>
                )}
                {(ordenesCompras !== null && (!ordenesFiltradas || ordenesFiltradas.length === 0)) && (
                    <p style={{ padding: '16px', color: '#666' }}>
                        No hay órdenes de compra para las requisiciones seleccionadas.
                    </p>
                )}
                {ordenesFiltradas && ordenesFiltradas.length > 0 && (
                    <div className="tablaOrdenesCompra">
                        <table>
                            <thead>
                                <tr>
                                    <th className="coding">ID</th>
                                    <th className="longer">Orden de compra</th>
                                    <th className="middle">Proveedor</th>
                                    <th className="middle">Proyectos</th>
                                    <th className="middle" style={{ width: '10%' }}>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordenesFiltradas.map((orden) => (
                                    <ItemOrdenCompra key={orden.id} orden={orden} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <NuevaOrdenCompra
                open={panelAbierto}
                onClose={() => setPanelAbierto(false)}
            />
        </div>
    );
}