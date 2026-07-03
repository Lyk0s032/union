import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../store/action/action';
import axios from 'axios';
import { MdAddBox, MdOutlineExtension, MdDescription } from 'react-icons/md';
import { isProductoTipo } from '../utils/requerimientoProgress';

export default function NewChildReq({ parentId, parentTipo = 'kit', onCreated, onCancel }) {
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const sistema = useSelector(store => store.system);
    const { extensiones } = sistema;
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        nombre: '',
        description: '',
        extensionId: '',
    });

    const esProducto = isProductoTipo(parentTipo);

    useEffect(() => {
        if (!esProducto && (!extensiones || extensiones.length === 0)) {
            dispatch(actions.axiosToGetFiltros(false));
        }
    }, [dispatch, esProducto, extensiones]);

    const createChild = async () => {
        if (!form.nombre || !form.description) {
            return dispatch(actions.HandleAlerta('Debes completar nombre y descripción', 'mistake'));
        }
        if (!esProducto && !form.extensionId) {
            return dispatch(actions.HandleAlerta('Debes seleccionar la extensión (color)', 'mistake'));
        }

        setLoading(true);
        try {
            const body = {
                parentRequerimientoId: parentId,
                nombre: form.nombre,
                description: form.description,
                userId: user.user.id,
            };
            if (!esProducto) {
                body.extensionId = parseInt(form.extensionId);
            }

            const res = await axios.post('/api/kit/requerimientos/post/add/child', body);

            dispatch(actions.HandleAlerta('Requerimiento agregado con éxito', 'positive'));
            dispatch(actions.axiosToGetRequerimiento(false, parentId));
            dispatch(actions.axiosToGetRequerimientos(false, 'comercial'));

            if (onCreated) onCreated(res.data);
            setForm({ nombre: '', description: '', extensionId: '' });
        } catch (err) {
            console.error(err);
            dispatch(actions.HandleAlerta('No hemos logrado crear el requerimiento', 'mistake'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="solicitud-inline-form">
            <div className="form-header">
                <div className="form-header-icon">
                    <MdAddBox />
                </div>
                <h4>{esProducto ? 'Agregar producto al grupo' : 'Agregar kit al grupo'}</h4>
                <p>
                    {esProducto
                        ? 'Describe el producto. Compras asignará línea y categoría al registrarlo.'
                        : 'Indica el kit y su extensión (color). Producción completará el resto.'}
                </p>
            </div>

            <div className="form-body">
                <div className="form-field">
                    <label>{esProducto ? 'Nombre del producto' : 'Nombre del kit'}</label>
                    <input
                        type="text"
                        placeholder={esProducto ? 'Ej. Perfil aluminio 3m' : 'Ej. Kit pedestal 2x1'}
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    />
                </div>

                {!esProducto && (
                    <div className="form-field">
                        <label><MdOutlineExtension style={{ verticalAlign: 'middle', marginRight: 4 }} />Extensión (color)</label>
                        <select
                            value={form.extensionId}
                            onChange={(e) => setForm({ ...form, extensionId: e.target.value })}
                        >
                            <option value="">Selecciona una extensión</option>
                            {extensiones?.map((ext, i) => (
                                <option key={i} value={ext.id}>{ext.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="form-field">
                    <label><MdDescription style={{ verticalAlign: 'middle', marginRight: 4 }} />Descripción</label>
                    <textarea
                        placeholder="Detalles, medidas, especificaciones..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </div>
            </div>

            <div className="form-actions">
                <button className="btn-primary" onClick={createChild} disabled={loading}>
                    <MdAddBox />
                    <span>{loading ? 'Agregando...' : 'Agregar requerimiento'}</span>
                </button>
                {onCancel && (
                    <button className="btn-secondary" onClick={onCancel} disabled={loading}>
                        <span>Cancelar</span>
                    </button>
                )}
            </div>
        </div>
    );
}
