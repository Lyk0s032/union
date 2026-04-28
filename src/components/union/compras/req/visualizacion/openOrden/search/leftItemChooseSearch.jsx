import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../../../store/action/action';

/**
 * Detalle de un ítem elegido desde la búsqueda por proveedor (fuera del consolidado).
 * Permite agregar a la orden con el mismo endpoint que LeftItemOpened, sin reparto por proyectos.
 */
export default function LeftItemChooseSearch() {
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();

    const requisicion = useSelector((state) => state.requisicion);
    const ordenCompra = requisicion?.ordenCompra;

    const openSearchItem = params.get('openSearchItem');
    const openSearchTipo = params.get('openSearchTipo') || 'materia';
    const isProducto = openSearchTipo === 'producto';

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    const [movimientoActual, setMovimientoActual] = useState(0);
    const [inputMovimiento, setInputMovimiento] = useState('0');
    const [precioCompra, setPrecioCompra] = useState('0');
    const [descuentoCompra, setDescuentoCompra] = useState('0');
    const [precioEditadoManualmente, setPrecioEditadoManualmente] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setInputMovimiento(movimientoActual.toString());
    }, [movimientoActual]);

    useEffect(() => {
        if (!openSearchItem) return;
        setLoading(true);
        setLoadError(false);
        setData(null);
        const url = isProducto
            ? `/api/materia/producto/get/${openSearchItem}`
            : `/api/materia/get/${openSearchItem}`;
        axios
            .get(url)
            .then((res) => setData(res.data))
            .catch((e) => {
                console.log(e);
                setLoadError(true);
            })
            .finally(() => setLoading(false));
    }, [openSearchItem, isProducto]);

    useEffect(() => {
        setMovimientoActual(0);
        setInputMovimiento('0');
        setPrecioCompra('0');
        setDescuentoCompra('0');
        setPrecioEditadoManualmente(false);
    }, [openSearchItem]);

    const producto = useMemo(() => {
        if (!data) {
            return {
                id: openSearchItem ? Number(openSearchItem) : 0,
                nombre: 'Cargando...',
                medida: 1,
                unidad: '',
                precioActual: 0,
                fechaPrecio: '',
            };
        }
        const nombre = isProducto
            ? data.item || data.name || data.description || ''
            : data.description || data.item || data.name || '';
        const medida = Number(data.medida || 1);
        const unidad = data.unidad || '';

        let precioActual = 0;
        let fechaPrecio = '';
        const proveedorId = ordenCompra?.proveedorId || ordenCompra?.proveedor?.id;

        if (proveedorId) {
            if (isProducto) {
                const priceFound = data.productPrices?.find((p) => p.proveedorId == proveedorId);
                if (priceFound) {
                    if (unidad === 'mt2') {
                        precioActual = Number(
                            (Number(priceFound.valor || priceFound.precio || priceFound.price || 0) * medida).toFixed(0)
                        );
                    } else {
                        precioActual = Number(priceFound.valor || priceFound.precio || priceFound.price || 0);
                    }
                    fechaPrecio = priceFound.updatedAt || priceFound.createdAt || '';
                }
            } else {
                const priceFound = data.prices?.find((p) => p.proveedorId == proveedorId);
                if (priceFound) {
                    const precioCaja = Number(priceFound.valor || priceFound.precio || priceFound.price || 0);
                    if (unidad === 'kg') {
                        const medidaKg = medida > 0 ? medida : 1;
                        precioActual = precioCaja / medidaKg;
                    } else {
                        precioActual = precioCaja;
                    }
                    fechaPrecio = priceFound.updatedAt || priceFound.createdAt || '';
                }
            }
        }

        return {
            id: Number(data.id || openSearchItem || 0),
            nombre,
            medida,
            unidad,
            precioActual,
            fechaPrecio: fechaPrecio ? String(fechaPrecio).split('T')[0] : '',
        };
    }, [data, isProducto, openSearchItem, ordenCompra]);

    const proveedor = useMemo(() => {
        if (ordenCompra?.proveedor) {
            const prov = ordenCompra.proveedor;
            return {
                nombre: prov.nombre || prov.name || '',
                nit: prov.nit || '',
                email: prov.email || '',
                telefono: prov.telefono || prov.phone || '',
            };
        }
        return { nombre: '', nit: '', email: '', telefono: '' };
    }, [ordenCompra]);

    const formatearNumero = useCallback((valor) => {
        const numero =
            typeof valor === 'string'
                ? parseFloat(valor.replace(/\./g, '').replace(',', '.')) || 0
                : valor;
        const partes = numero.toFixed(2).split('.');
        const parteEntera = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return `${parteEntera},${partes[1]}`;
    }, []);

    const parsearNumero = useCallback((valor) => {
        const numeroLimpio = String(valor).replace(/\./g, '').replace(',', '.');
        return parseFloat(numeroLimpio) || 0;
    }, []);

    const precioAutomatico = useMemo(() => {
        const cantidad = movimientoActual;
        const precio = producto.precioActual || 0;
        return cantidad * precio;
    }, [movimientoActual, producto.precioActual]);

    useEffect(() => {
        if (!precioEditadoManualmente) {
            setPrecioCompra(formatearNumero(precioAutomatico));
        }
    }, [precioAutomatico, precioEditadoManualmente, formatearNumero]);

    const precioTotal = useMemo(() => {
        const precio = parsearNumero(precioCompra);
        const descuento = parsearNumero(descuentoCompra);
        return Math.max(0, precio - descuento);
    }, [precioCompra, descuentoCompra, parsearNumero]);

    const handleMovimientoChange = (value) => {
        setInputMovimiento(value);
    };

    const handleMovimientoBlur = () => {
        const numValue = parseFloat(inputMovimiento) || 0;
        const valorEntero = Math.floor(Math.max(0, numValue));
        setMovimientoActual(valorEntero);
        setInputMovimiento(valorEntero.toString());
    };

    const handleMovimientoKeyDown = (e) => {
        if (e.key === 'Enter') {
            const numValue = parseFloat(inputMovimiento) || 0;
            const valorEntero = Math.floor(Math.max(0, numValue));
            setMovimientoActual(valorEntero);
            setInputMovimiento(valorEntero.toString());
            e.target.blur();
        }
    };

    const handlePrecioCompraChange = (value) => {
        const valorLimpio = value.replace(/[^\d.,]/g, '');
        setPrecioCompra(valorLimpio);
        setPrecioEditadoManualmente(true);
    };

    const handlePrecioCompraBlur = () => {
        const numValue = parsearNumero(precioCompra);
        setPrecioCompra(formatearNumero(Math.max(0, numValue)));
    };

    const handleDescuentoCompraChange = (value) => {
        const valorLimpio = value.replace(/[^\d.,]/g, '');
        setDescuentoCompra(valorLimpio);
    };

    const handleDescuentoCompraBlur = () => {
        const numValue = parsearNumero(descuentoCompra);
        const precio = parsearNumero(precioCompra);
        setDescuentoCompra(formatearNumero(Math.max(0, Math.min(numValue, precio))));
    };

    const cerrar = () => {
        const next = new URLSearchParams(params);
        next.delete('openSearchItem');
        next.delete('openSearchTipo');
        setParams(next);
    };

    const addItemToOrden = async () => {
        if (!movimientoActual || movimientoActual <= 0) {
            dispatch(actions.HandleAlerta('Debes ingresar una cantidad en zona de movimientos', 'mistake'));
            return;
        }

        const precioParseado = parsearNumero(precioCompra);
        if (!precioParseado || precioParseado <= 0) {
            dispatch(actions.HandleAlerta('Debes ingresar un precio de compra válido', 'mistake'));
            return;
        }

        if (!ordenCompra || !ordenCompra.id) {
            dispatch(actions.HandleAlerta('No hay una orden de compra seleccionada', 'mistake'));
            return;
        }

        const ordenId = params.get('orden') || ordenCompra.id;
        const unidad = producto.unidad || '';
        const cantidad = movimientoActual;

        const precioUnidad =
            unidad === 'kg' ? producto.precioActual || 0 : precioParseado / cantidad;

        const totalFunction = precioParseado;
        const descuentoFunction = parsearNumero(descuentoCompra);
        const final = totalFunction - descuentoFunction;

        const body = {
            cantidad,
            cotizacionId: ordenId,
            precioUnidad,
            precio: totalFunction,
            descuento: descuentoFunction,
            precioTotal: final,
            productoId: isProducto ? producto.id : null,
            ordenCompraId: ordenCompra.id,
            materiaId: !isProducto ? producto.id : null,
            proyectos: [],
            medida: producto.medida || 1,
        };

        setSaving(true);
        try {
            await axios.post('/api/requisicion/post/add/comprasCotizacion/item/add', body);
            dispatch(actions.HandleAlerta('Anexado', 'positive'));
            dispatch(actions.axiosToGetOrdenComprasAdmin(false, ordenId));
            cerrar();
        } catch (err) {
            console.log(err);
            dispatch(actions.HandleAlerta('Error al agregar el item a la orden', 'mistake'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="leftItemOpened">
            <button type="button" className="btnCerrarItem" onClick={cerrar} title="Cerrar">
                <span>×</span>
            </button>

            {loading && (
                <div style={{ padding: '40px 0', textAlign: 'center', color: '#666' }}>
                    <h3 style={{ margin: 0, fontWeight: 600 }}>Cargando información…</h3>
                    <p style={{ margin: '6px 0 0 0', fontSize: 12 }}>Ítem fuera del consolidado</p>
                </div>
            )}

            {!loading && loadError && (
                <div style={{ padding: '40px 0', textAlign: 'center', color: '#666' }}>
                    <h3 style={{ margin: 0, fontWeight: 600 }}>No encontramos el ítem</h3>
                </div>
            )}

            {!loading && !loadError && data && (
                <>
                    <div className="topSectionItemOpened">
                        <div className="productoInfo">
                            <div className="flexDiv">
                                <div className="productoBadge">
                                    <span>{producto.id}</span>
                                </div>
                                <div>
                                    <h1 className="productoNombre">{producto.nombre}</h1>
                                    <div className="productoMedida">
                                        <span>
                                            {producto.medida} {producto.unidad}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="productoPrecio">
                                <span className="precioLabel">Precio actual (proveedor)</span>
                                <span className="precioValor">$ {producto.precioActual.toLocaleString('es-CO')}</span>
                            </div>
                            <div className="productoFecha">{producto.fechaPrecio}</div>
                        </div>

                        <div className="proveedorInfo">
                            <h2 className="proveedorNombre">{proveedor.nombre}</h2>
                            <div className="proveedorContacto">
                                <span>NIT {proveedor.nit}</span>
                                <span>{proveedor.email}</span>
                                <span>{proveedor.telefono}</span>
                            </div>
                        </div>
                    </div>

                    <div className="movimientoSection">
                        <h3 className="movimientoTitulo">Zona de movimientos</h3>
                        <p style={{ fontSize: 12, color: '#666', margin: '0 0 8px 0' }}>
                            Ítem no ligado a la requisición: indica la cantidad a comprar.
                        </p>
                        <div className="movimientoInput">
                            <input
                                type="number"
                                className="movimientoInputField"
                                value={inputMovimiento}
                                onChange={(e) => handleMovimientoChange(e.target.value)}
                                onBlur={handleMovimientoBlur}
                                onKeyDown={handleMovimientoKeyDown}
                                step="0.01"
                            />
                            <span className="movimientoSeparador"> </span>
                            <span className="movimientoTotal" style={{ opacity: 0.7 }}>
                                {producto.unidad || 'ud'}
                            </span>
                        </div>
                    </div>

                    <div className="detallesCompraSection">
                        <h3 className="detallesCompraTitulo">Detalles de la compra</h3>
                        <div className="detallesCompraInputs">
                            <div className="detalleCompraInput">
                                <div className="detalleCompraLabel">
                                    <span>Precio de la compra</span>
                                </div>
                                <input
                                    type="text"
                                    className="detalleCompraInputField"
                                    value={precioCompra}
                                    onChange={(e) => handlePrecioCompraChange(e.target.value)}
                                    onBlur={handlePrecioCompraBlur}
                                    placeholder="0,00"
                                />
                            </div>
                            <div className="detalleCompraInput">
                                <div className="detalleCompraLabel">
                                    <span>Descuento de la compra</span>
                                </div>
                                <input
                                    type="text"
                                    className="detalleCompraInputField"
                                    value={descuentoCompra}
                                    onChange={(e) => handleDescuentoCompraChange(e.target.value)}
                                    onBlur={handleDescuentoCompraBlur}
                                    placeholder="0,00"
                                />
                            </div>
                        </div>

                        {precioTotal > 0 && (
                            <div
                                style={{
                                    marginTop: '12px',
                                    padding: '12px',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: '4px',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <span style={{ fontWeight: 600 }}>Precio total:</span>
                                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#1890ff' }}>
                                        ${' '}
                                        {precioTotal.toLocaleString('es-CO', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                            </div>
                        )}

                        <button
                            type="button"
                            className="btnIncluirOrdenCompra"
                            onClick={() => {
                                if (!saving) addItemToOrden();
                            }}
                            disabled={saving}
                        >
                            {saving ? 'Ingresando…' : 'Incluir a la orden compra'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
