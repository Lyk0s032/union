import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/action/action';

const FORM_VACÍO = {
    item: '',
    description: '',
    unidad: 'unidad',
    medida: '',
    lineaId: null,
    categoriumId: null,
    peso: null,
    calibre: null,
    criticidad: null,
    procedencia: 'nacional',
    volumen: null,
};

export default function NuevoConsumibleModal({ onClose, onCreado }) {
    const dispatch = useDispatch();
    const sistema = useSelector(store => store.system);
    const { categorias, lineas, loadingFiltros } = sistema;

    const [step, setStep] = useState('crear'); // 'crear' | 'precio'
    const [itemCreado, setItemCreado] = useState(null); // { id, item }

    const [form, setForm] = useState(FORM_VACÍO);
    const [loading, setLoading] = useState(false);

    // Paso 2 — proveedor + precio
    const [pvQuery, setPvQuery] = useState('');
    const [pvList, setPvList] = useState([]);
    const [pvSeleccionado, setPvSeleccionado] = useState(null);
    const [precio, setPrecio] = useState('');
    const [iva, setIva] = useState('19');
    const [loadingPrecio, setLoadingPrecio] = useState(false);

    useEffect(() => {
        if (!categorias && !loadingFiltros) {
            dispatch(actions.axiosToGetFiltros(true));
        }
    }, []);

    const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const puedeCrear =
        form.item.trim().length > 0 &&
        form.description.trim().length > 0 &&
        form.medida.trim().length > 0 &&
        form.lineaId !== null &&
        form.categoriumId !== null;

    const crear = async () => {
        if (!puedeCrear) return;
        setLoading(true);
        try {
            const res = await axios.post('/api/materia/new', {
                ...form,
                item: form.item.trim(),
                description: form.description.trim(),
                medida: form.medida.trim(),
            });
            setItemCreado({ id: res.data.id, item: res.data.item || form.item.trim() });
            dispatch(actions.HandleAlerta('Consumible creado exitosamente', 'positive'));
            setStep('precio');
        } catch (err) {
            console.error(err);
            dispatch(actions.HandleAlerta('Error al crear el consumible', 'mistake'));
        } finally {
            setLoading(false);
        }
    };

    const buscarProveedores = async (q) => {
        setPvQuery(q);
        setPvSeleccionado(null);
        if (!q || q.length < 2) return setPvList([]);
        const res = await axios.get('/api/requisicion/get/filters/proveedor', { params: { q } })
            .then(r => r.data).catch(() => []);
        setPvList(Array.isArray(res) ? res : []);
    };

    const seleccionarPv = (pv) => {
        setPvSeleccionado(pv);
        setPvQuery(pv.nombre);
        setPvList([]);
    };

    const asignarPrecio = async () => {
        if (!pvSeleccionado || !precio || !itemCreado) return;
        setLoadingPrecio(true);
        try {
            await axios.post('/api/mt/price/give', {
                mtId: itemCreado.id,
                pvId: pvSeleccionado.id,
                price: parseFloat(precio),
                iva: parseFloat(iva) || 0,
                descuentos: 0,
            });
            dispatch(actions.HandleAlerta('Proveedor y precio asignados correctamente', 'positive'));
            if (onCreado) onCreado();
            onClose();
        } catch (err) {
            console.error(err);
            dispatch(actions.HandleAlerta('Error al asignar precio al proveedor', 'mistake'));
        } finally {
            setLoadingPrecio(false);
        }
    };

    const saltarPrecio = () => {
        if (onCreado) onCreado();
        onClose();
    };

    return (
        <div
            style={{
                position: 'fixed', inset: 0,
                background: 'rgba(10,20,40,0.45)',
                zIndex: 4000,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div style={{
                background: '#fff', borderRadius: 10,
                width: 520, maxWidth: '95vw',
                boxShadow: '0 12px 36px rgba(11,22,60,0.14)',
                display: 'flex', flexDirection: 'column',
            }}>
                {/* Header */}
                <div style={{
                    padding: '18px 24px 14px',
                    borderBottom: '1px solid #eef1f6',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                            {step === 'crear' ? 'Nuevo consumible' : `Asignar proveedor — ${itemCreado?.item}`}
                        </h3>
                        <span style={{ fontSize: 12, color: '#888' }}>
                            {step === 'crear'
                                ? 'Se registrará en el catálogo de ítems'
                                : 'Opcional · necesario para encontrarlo en una OC'}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888', lineHeight: 1 }}
                    >✕</button>
                </div>

                {/* ── PASO 1: Crear ── */}
                {step === 'crear' && (
                    <>
                        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div>
                                <label style={labelStyle}>Nombre <span style={{ color: '#e25' }}>*</span></label>
                                <input autoFocus type="text" placeholder="Ej: Papel higiénico, Bolsas plásticas..."
                                    value={form.item} onChange={e => set('item', e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Descripción <span style={{ color: '#e25' }}>*</span></label>
                                <input type="text" placeholder="Descripción del consumible"
                                    value={form.description} onChange={e => set('description', e.target.value)} style={inputStyle} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label style={labelStyle}>Unidad</label>
                                    <select value={form.unidad} onChange={e => set('unidad', e.target.value)} style={inputStyle}>
                                        <option value="unidad">Unidad</option>
                                        <option value="kg">Kg</option>
                                        <option value="mt">Mt</option>
                                        <option value="mt2">Mt2</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Medida <span style={{ color: '#e25' }}>*</span></label>
                                    <input type="text" placeholder="Ej: Rollo x48, Caja x100, 80g"
                                        value={form.medida} onChange={e => set('medida', e.target.value)} style={inputStyle} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label style={labelStyle}>Categoría <span style={{ color: '#e25' }}>*</span></label>
                                    <select value={form.categoriumId ?? ''} disabled={loadingFiltros}
                                        onChange={e => set('categoriumId', e.target.value ? parseInt(e.target.value) : null)} style={inputStyle}>
                                        <option value="">Seleccionar...</option>
                                        {categorias?.map((cat, i) => <option key={i} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Línea <span style={{ color: '#e25' }}>*</span></label>
                                    <select value={form.lineaId ?? ''} disabled={loadingFiltros}
                                        onChange={e => set('lineaId', e.target.value ? parseInt(e.target.value) : null)} style={inputStyle}>
                                        <option value="">Seleccionar...</option>
                                        {lineas?.map((linea, i) => <option key={i} value={linea.id}>{linea.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div style={footerStyle}>
                            <button onClick={onClose} disabled={loading} style={btnCancelStyle}>Cancelar</button>
                            <button onClick={crear} disabled={!puedeCrear || loading}
                                style={{ ...btnPrimaryStyle, background: puedeCrear && !loading ? '#7c3aed' : '#c4b5fd', cursor: puedeCrear && !loading ? 'pointer' : 'not-allowed' }}>
                                {loading ? 'Creando...' : 'Crear consumible →'}
                            </button>
                        </div>
                    </>
                )}

                {/* ── PASO 2: Precio / Proveedor ── */}
                {step === 'precio' && (
                    <>
                        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{
                                background: '#f0fdf4', border: '1px solid #86efac',
                                borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#166534',
                            }}>
                                ✓ Consumible creado. Para que aparezca al buscar ítems en una OC,
                                asigna al menos un proveedor con precio.
                            </div>

                            {/* Proveedor */}
                            <div>
                                <label style={labelStyle}>Proveedor</label>
                                <div style={{ position: 'relative' }}>
                                    <input type="text" placeholder="Buscar proveedor..."
                                        value={pvQuery} onChange={e => buscarProveedores(e.target.value)}
                                        autoComplete="off" style={inputStyle} />
                                    {pvList.length > 0 && (
                                        <div style={{
                                            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 5000,
                                            background: '#fff', border: '1px solid #dde1eb', borderRadius: 6,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: 180, overflowY: 'auto',
                                        }}>
                                            {pvList.map((p, i) => (
                                                <div key={i} onClick={() => seleccionarPv(p)}
                                                    style={{ padding: '9px 12px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', fontSize: 13 }}
                                                    onMouseEnter={e => e.currentTarget.style.background = '#f9f9ff'}
                                                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                                                    <strong>{p.nombre}</strong>
                                                    <span style={{ marginLeft: 8, color: '#888', fontSize: 11 }}>{p.nit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {pvSeleccionado && (
                                    <span style={{ fontSize: 12, color: '#7c3aed', marginTop: 4, display: 'block' }}>
                                        ✓ {pvSeleccionado.nombre} seleccionado
                                    </span>
                                )}
                            </div>

                            {/* Precio e IVA */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label style={labelStyle}>Precio unitario ($)</label>
                                    <input type="number" placeholder="0" min="0"
                                        value={precio} onChange={e => setPrecio(e.target.value)} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>IVA (%)</label>
                                    <select value={iva} onChange={e => setIva(e.target.value)} style={inputStyle}>
                                        <option value="0">0%</option>
                                        <option value="5">5%</option>
                                        <option value="19">19%</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div style={footerStyle}>
                            <button onClick={saltarPrecio} style={btnCancelStyle}>Saltar este paso</button>
                            <button onClick={asignarPrecio}
                                disabled={!pvSeleccionado || !precio || loadingPrecio}
                                style={{
                                    ...btnPrimaryStyle,
                                    background: pvSeleccionado && precio && !loadingPrecio ? '#7c3aed' : '#c4b5fd',
                                    cursor: pvSeleccionado && precio && !loadingPrecio ? 'pointer' : 'not-allowed',
                                }}>
                                {loadingPrecio ? 'Guardando...' : 'Guardar y cerrar'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const labelStyle = { fontSize: 12, fontWeight: 600, color: '#444', display: 'block', marginBottom: 4 };
const inputStyle = { width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #dde1eb', fontSize: 13, boxSizing: 'border-box', outline: 'none' };
const footerStyle = { padding: '14px 24px 18px', borderTop: '1px solid #eef1f6', display: 'flex', justifyContent: 'flex-end', gap: 10 };
const btnCancelStyle = { padding: '9px 18px', borderRadius: 6, border: '1px solid #dde1eb', background: '#fff', color: '#444', cursor: 'pointer', fontSize: 13 };
const btnPrimaryStyle = { padding: '9px 18px', borderRadius: 6, border: 'none', color: '#fff', fontSize: 13, fontWeight: 600 };
