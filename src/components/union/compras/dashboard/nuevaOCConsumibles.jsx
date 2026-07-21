import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as actions from '../../../store/action/action';

export default function NuevaOCIndependiente({ onClose }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    const [proveedorQuery, setProveedorQuery] = useState('');
    const [proveedoresList, setProveedoresList] = useState([]);
    const [proveedor, setProveedor] = useState(null);
    const [loading, setLoading] = useState(false);

    const buscarProveedores = async (q) => {
        setProveedorQuery(q);
        setProveedor(null);
        if (!q || q.length < 2) return setProveedoresList([]);
        const res = await axios.get('/api/requisicion/get/filters/proveedor', { params: { q } })
            .then(r => r.data)
            .catch(() => []);
        setProveedoresList(Array.isArray(res) ? res : []);
    };

    const seleccionarProveedor = (pv) => {
        setProveedor(pv);
        setProveedorQuery(pv.nombre);
        setProveedoresList([]);
    };

    const puedeCrear = nombre.trim().length > 0 && proveedor !== null;

    const crearOC = async () => {
        if (!puedeCrear) return;
        setLoading(true);
        try {
            const res = await axios.post('/api/requisicion/post/generar/cotizacion/one', {
                name: nombre.trim(),
                proveedor: proveedor.id,
                // Sin proyectos — OC independiente
            });
            const ocId = res.data.id;

            dispatch(actions.HandleAlerta('Orden de compra creada', 'positive'));
            // Navegamos al editor de OC existente (sin IDs de requisición)
            dispatch(actions.getIDs([]));
            onClose();
            navigate(`/compras/req/?open=projects&view=ordenes&openOrden=${ocId}`);
        } catch (err) {
            console.error(err);
            dispatch(actions.HandleAlerta('Error al crear la orden de compra', 'mistake'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="modalOverlay"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="modalOCConsumibles">
                <div className="modalHeader">
                    <div>
                        <h3>Nueva orden de compra</h3>
                        <span>Independiente · sin pedido asociado</span>
                    </div>
                    <button className="btnClose" onClick={onClose}>✕</button>
                </div>

                <div className="modalBody">
                    {/* Nombre */}
                    <div className="stepSection">
                        <label>Nombre de la orden</label>
                        <input
                            type="text"
                            placeholder="Ej: Consumibles julio 2026"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && puedeCrear && crearOC()}
                            autoFocus
                        />
                    </div>

                    {/* Proveedor */}
                    <div className="stepSection">
                        <label>Proveedor</label>
                        <div className="searchRelative">
                            <input
                                type="text"
                                placeholder="Buscar proveedor..."
                                value={proveedorQuery}
                                onChange={e => buscarProveedores(e.target.value)}
                                autoComplete="off"
                            />
                            {proveedoresList.length > 0 && (
                                <div className="dropdownResults">
                                    {proveedoresList.map((p, i) => (
                                        <div
                                            key={i}
                                            className="dropdownItem"
                                            onClick={() => seleccionarProveedor(p)}
                                        >
                                            <strong>{p.nombre}</strong>
                                            <span>{p.nit}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {proveedor && (
                            <span className="hint selected">
                                ✓ {proveedor.nombre} seleccionado
                            </span>
                        )}
                    </div>

                    <p className="modalInfo">
                        Al crear la OC se abrirá el editor donde podrás agregar los items
                        que este proveedor suministra (materia prima, producto terminado o consumibles).
                    </p>
                </div>

                <div className="modalFooter">
                    <div className="footerBtns">
                        <button className="btnCancel" onClick={onClose} disabled={loading}>
                            Cancelar
                        </button>
                        <button
                            className="btnCreate"
                            onClick={crearOC}
                            disabled={!puedeCrear || loading}
                        >
                            {loading ? 'Creando...' : 'Crear y abrir editor'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
