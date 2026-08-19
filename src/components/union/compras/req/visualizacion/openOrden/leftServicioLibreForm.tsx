import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../../store/action/action';

const parsearNumero = (valor: string): number => {
    if (!valor || valor.trim() === '') return 0;
    const limpio = valor.replace(/\./g, '').replace(',', '.');
    const num = parseFloat(limpio);
    return isNaN(num) ? 0 : num;
};

const formatearNumero = (valor: number): string =>
    new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(valor || 0);

export default function LeftServicioLibreForm() {
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const admin = useSelector((state: any) => state.admin || state.administration || {});
    const requisicion = useSelector((state: any) => state.requisicion || {});

    const ordenCompras = admin.ordenCompras;
    const ordenId = params.get('openOrden');

    const [descripcionLibre, setDescripcionLibre] = useState('');
    const [cantidad, setCantidad] = useState('1');
    const [precio, setPrecio] = useState('0');
    const [descuento, setDescuento] = useState('0');
    const [asignaciones, setAsignaciones] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(false);

    const proyectos = useMemo(() => {
        const fromOrden = Array.isArray(ordenCompras?.requisiciones) ? ordenCompras.requisiciones : [];
        if (fromOrden.length) {
            return fromOrden.map((r: any) => ({
                id: Number(r.id),
                nombre: r.nombre || r.name || `Proyecto ${r.id}`,
            })).filter((p: any) => p.id);
        }
        const ids: number[] = requisicion?.requisicionesSeleccionadas || requisicion?.ids || [];
        const consolidado = requisicion?.realProyectosRequisicion?.proyectos || [];
        return ids.map((id) => {
            const found = consolidado.find((p: any) => Number(p.id) === Number(id));
            return { id: Number(id), nombre: found?.nombre || found?.name || `Proyecto ${id}` };
        }).filter((p: any) => p.id);
    }, [ordenCompras, requisicion]);

    const cerrar = () => {
        const next = new URLSearchParams(params);
        next.delete('openServicio');
        setParams(next);
    };

    const addServicio = async () => {
        const desc = descripcionLibre.trim();
        if (!desc) {
            (dispatch as any)(actions.HandleAlerta('Ingresa la descripción del servicio', 'mistake'));
            return;
        }

        const cantidadNum = parsearNumero(cantidad);
        if (!cantidadNum || cantidadNum <= 0) {
            (dispatch as any)(actions.HandleAlerta('Ingresa una cantidad válida', 'mistake'));
            return;
        }

        const precioNum = parsearNumero(precio);
        if (!precioNum || precioNum <= 0) {
            (dispatch as any)(actions.HandleAlerta('Ingresa un precio válido', 'mistake'));
            return;
        }

        const descuentoNum = Math.min(parsearNumero(descuento), precioNum);
        const precioTotal = Math.max(0, precioNum - descuentoNum);
        const precioUnidad = cantidadNum > 0 ? precioNum / cantidadNum : precioNum;

        const proyectosPayload = proyectos
            .map((p) => ({
                requisicionId: p.id,
                cantidad: parsearNumero(asignaciones[p.id] || '0'),
            }))
            .filter((p) => p.cantidad > 0);

        if (proyectos.length > 0 && proyectosPayload.length === 0) {
            (dispatch as any)(actions.HandleAlerta('Asigna el servicio al menos a un proyecto', 'mistake'));
            return;
        }

        const totalAsignado = proyectosPayload.reduce((s, p) => s + p.cantidad, 0);
        if (proyectos.length > 0 && Math.abs(totalAsignado - cantidadNum) > 0.001) {
            (dispatch as any)(actions.HandleAlerta('La suma por proyecto debe igualar la cantidad total', 'mistake'));
            return;
        }

        if (!ordenCompras?.id) {
            (dispatch as any)(actions.HandleAlerta('No hay una orden de compra seleccionada', 'mistake'));
            return;
        }

        const body = {
            descripcionLibre: desc,
            cantidad: cantidadNum,
            precio: precioNum,
            descuento: descuentoNum,
            precioUnidad,
            precioTotal,
            cotizacionId: ordenCompras.id,
            proyectos: proyectosPayload,
        };

        setLoading(true);
        try {
            await axios.post('/api/requisicion/post/add/comprasCotizacion/item/servicio-libre', body);
            (dispatch as any)(actions.HandleAlerta('Servicio agregado', 'positive'));
            (dispatch as any)(actions.axiosToGetOrdenComprasAdmin(false, ordenId || ordenCompras.id));
            cerrar();
        } catch (err) {
            console.error(err);
            (dispatch as any)(actions.HandleAlerta('No se pudo agregar el servicio', 'mistake'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="leftServicioLibreForm">
            <button className="btnCerrarItem" onClick={cerrar} type="button">
                <span>×</span>
            </button>

            <div className="headerLeftData" style={{ padding: '10px', boxSizing: 'border-box' }}>
                <h1 style={{ marginTop: 0 }}>Agregar servicio</h1>
                <span>Línea manual fuera del catálogo del proveedor (no afecta inventario).</span>
            </div>

            <div className="bodyLeftData" style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label>
                    <span>Descripción</span>
                    <textarea
                        value={descripcionLibre}
                        onChange={(e) => setDescripcionLibre(e.target.value)}
                        rows={3}
                        style={{ width: '100%', marginTop: 4 }}
                        placeholder="Ej: Transporte, instalación, mano de obra..."
                    />
                </label>

                <label>
                    <span>Cantidad</span>
                    <input
                        type="text"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value.replace(/[^\d.,]/g, ''))}
                        style={{ width: '100%', marginTop: 4 }}
                    />
                </label>

                <label>
                    <span>Precio</span>
                    <input
                        type="text"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value.replace(/[^\d.,]/g, ''))}
                        onBlur={() => setPrecio(formatearNumero(parsearNumero(precio)))}
                        style={{ width: '100%', marginTop: 4 }}
                    />
                </label>

                <label>
                    <span>Descuento</span>
                    <input
                        type="text"
                        value={descuento}
                        onChange={(e) => setDescuento(e.target.value.replace(/[^\d.,]/g, ''))}
                        onBlur={() => setDescuento(formatearNumero(parsearNumero(descuento)))}
                        style={{ width: '100%', marginTop: 4 }}
                    />
                </label>

                {proyectos.length > 0 && (
                    <div>
                        <span>Asignación por proyecto</span>
                        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {proyectos.map((p) => (
                                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ flex: 1, fontSize: 13 }}>{p.nombre}</span>
                                    <input
                                        type="text"
                                        value={asignaciones[p.id] ?? ''}
                                        onChange={(e) =>
                                            setAsignaciones({
                                                ...asignaciones,
                                                [p.id]: e.target.value.replace(/[^\d.,]/g, ''),
                                            })
                                        }
                                        placeholder="0"
                                        style={{ width: 80 }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    onClick={addServicio}
                    disabled={loading}
                    style={{
                        marginTop: 8,
                        padding: '10px 16px',
                        background: '#1890ff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? 'Guardando...' : 'Agregar servicio a la OC'}
                </button>
            </div>
        </div>
    );
}
