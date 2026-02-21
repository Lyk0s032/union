import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../../store/action/action';

interface NuevaOrdenCompraProps {
    open: boolean;
    onClose: () => void;
}

export default function NuevaOrdenCompra({ open, onClose }: NuevaOrdenCompraProps) {
    const dispatch = useDispatch();
    const ids = useSelector((state: any) => state.requisicion.requisicionesSeleccionadas || state.requisicion.ids || []);

    const [nombreOrden, setNombreOrden] = useState('');
    const [proveedorQuery, setProveedorQuery] = useState('');
    const [proveedores, setProveedores] = useState<any[] | null>(null);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState<any | null>(null);
    const [loadingProveedores, setLoadingProveedores] = useState(false);
    const [loadingGuardar, setLoadingGuardar] = useState(false);

    // Buscar proveedores en tiempo real usando la misma ruta que new.jsx
    const buscarProveedores = async (query: string) => {
        if (!query || query.trim() === '') {
            setProveedores(null);
            setProveedorSeleccionado(null);
            return;
        }

        try {
            setLoadingProveedores(true);
            const res = await axios.get('/api/proveedores/get/query', {
                params: { query },
            });
            setProveedores(res.data);
        } catch (err) {
            console.log(err);
            setProveedores(null);
        } finally {
            setLoadingProveedores(false);
        }
    };

    // Debounce de la búsqueda al escribir
    useEffect(() => {
        const id = setTimeout(() => {
            buscarProveedores(proveedorQuery);
        }, 300);
        return () => clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [proveedorQuery]);

    const handleGuardar = async () => {
        if (!nombreOrden || !proveedorSeleccionado || !ids || ids.length === 0) {
            // Reutilizamos el manejador de alertas global si existe
            (dispatch as any)(actions.HandleAlerta?.('Completa el nombre, proveedor y selecciona al menos un proyecto', 'mistake'));
            return;
        }

        try {
            setLoadingGuardar(true);
            const body = {
                name: nombreOrden,
                proyectos: ids,
                proveedor: proveedorSeleccionado.id
            };

            const res = await axios.post('/api/requisicion/post/generar/cotizacion/one', body);

            if (res.status === 200) {
                // Mismo comportamiento que new.jsx cuando hay nombre duplicado
                (dispatch as any)(actions.HandleAlerta?.('Ya existe una orden de compra con este nombre', 'mistake'));
            } else {
                // Refrescar discretamente la información de las requisiciones
                // Refrescar datos de requisiciones y órdenes de compra
                if (ids && ids.length > 0) {
                    if (typeof actions.axiosToGetRealProyectosRequisicion === 'function') {
                        (dispatch as any)(actions.axiosToGetRealProyectosRequisicion(ids));
                    }
                    // Refrescar órdenes de compra
                    if (typeof actions.axiosToGetCotizacionesCompras === 'function') {
                        (dispatch as any)(actions.axiosToGetCotizacionesCompras(ids));
                    }
                }
                // Cerrar panel después de crear
                onClose();
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingGuardar(false);
        }
    };

    return (
        <div className={`nuevaOrdenPanel ${open ? 'abierta' : ''}`}>
            <div className="nuevaOrdenContent">
                <div className="nuevaOrdenHeader">
                    <h2>Nueva orden de compra</h2>
                    <button
                        className="btnCerrar"
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        ×
                    </button>
                </div>

                <div className="nuevaOrdenBody">
                    <div className="campoFormulario">
                        <label>Nombre de la orden de compra</label>
                        <input
                            type="text"
                            value={nombreOrden}
                            onChange={(e) => setNombreOrden(e.target.value)}
                            placeholder="Ej: Orden OC-001 Proveedor X"
                        />
                    </div>

                    <div className="campoFormulario">
                        <label>Proveedor</label>
                        <input
                            type="text"
                            value={proveedorQuery}
                            onChange={(e) => {
                                setProveedorQuery(e.target.value);
                                // Al escribir manualmente, se "des-selecciona" el proveedor previo
                                setProveedorSeleccionado(null);
                            }}
                            placeholder="Escribe para buscar y seleccionar un proveedor"
                        />
                        <span className="ayudaCampo">
                            Escribe al menos 1 carácter para buscar proveedores y haz clic para seleccionarlo.
                        </span>

                        {/* Lista de resultados de proveedores */}
                        {loadingProveedores && (
                            <div className="listaProveedores">
                                <div className="itemProveedor disabled">Buscando proveedores...</div>
                            </div>
                        )}
                        {!loadingProveedores && proveedores && proveedores.length > 0 && (
                            <div className="listaProveedores">
                                {proveedores.map((prov) => (
                                    <div
                                        key={prov.id}
                                        className={`itemProveedor ${proveedorSeleccionado?.id === prov.id ? 'seleccionado' : ''}`}
                                        onClick={() => {
                                            setProveedorSeleccionado(prov);
                                            setProveedorQuery(prov.nombre || prov.name || '');
                                        }}
                                    >
                                        <div className="inicialProveedor">
                                            {(prov.nombre || prov.name || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="infoProveedor">
                                            <div className="nombreProveedor">
                                                {prov.nombre || prov.name}
                                            </div>
                                            {prov.nit && (
                                                <div className="nitProveedor">
                                                    NIT: {prov.nit}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="nuevaOrdenFooter">
                    <button className="btnSecundario" onClick={onClose}>
                        Cancelar
                    </button>
                    <button
                        className="btnPrimario"
                        type="button"
                        disabled={loadingGuardar || !nombreOrden || !proveedorSeleccionado}
                        onClick={handleGuardar}
                    >
                        {loadingGuardar ? 'Creando orden...' : 'Guardar borrador'}
                    </button>
                </div>
            </div>
        </div>
    );
}