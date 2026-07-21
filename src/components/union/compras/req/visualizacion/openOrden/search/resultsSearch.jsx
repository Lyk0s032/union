import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

const DEBOUNCE_MS = 320;

function asIdSet(value) {
    if (!value) return new Set();
    if (value instanceof Set) return value;
    const arr = Array.isArray(value) ? value : [];
    return new Set(arr.map((x) => Number(x)).filter((n) => Number.isFinite(n)));
}

/**
 * Búsqueda de materia prima o producto terminado con precio activo para un proveedor.
 * APIs: /api/materia/searching/provider | /api/materia/producto/searching/provider
 */
export default function ResultsSearch({ proveedorId, onCloseSearch, excludeMateriaIds, excludeProductoIds }) {
    const sistema = useSelector((store) => store.system);
    const lineas = sistema?.lineas;

    const [tipo, setTipo] = useState('materia'); // materia | producto | consumible
    const [q, setQ] = useState('');
    const [lineaId, setLineaId] = useState('');
    // Categoría para consumibles — configurable vía localStorage, por defecto 15 ("Consumibles")
    const [catConsumibleId, setCatConsumibleId] = useState(() => {
        try { return localStorage.getItem('catConsumibleId') || '15'; } catch { return '15'; }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);

    const guardarLineaConsumible = (val) => {
        setLineaConsumibleId(val);
        try { localStorage.setItem('lineaConsumibleId', val); } catch {}
    };

    const debounceRef = useRef(null);

    const lineaIdNum = useMemo(() => {
        const n = parseInt(String(lineaId), 10);
        return Number.isFinite(n) && n > 0 ? n : null;
    }, [lineaId]);

    const excludeMat = useMemo(() => asIdSet(excludeMateriaIds), [excludeMateriaIds]);
    const excludeProd = useMemo(() => asIdSet(excludeProductoIds), [excludeProductoIds]);

    const rowsFiltered = useMemo(() => {
        const ex = tipo === 'producto' ? excludeProd : excludeMat;
        return rows.filter((r) => r?.id != null && !ex.has(Number(r.id)));
    }, [rows, tipo, excludeMat, excludeProd]);

    const allResultsEnListaPrincipal = rows.length > 0 && rowsFiltered.length === 0;

    const fetchData = useCallback(async () => {
        if (!proveedorId) {
            setRows([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const isConsumible = tipo === 'consumible';
            const base =
                tipo === 'producto'
                    ? '/api/materia/producto/searching/provider'
                    : '/api/materia/searching/provider';
            const params = { proveedorId };
            const trimmed = String(q).trim();
            if (trimmed) params.q = trimmed;
            if (tipo === 'producto' && lineaIdNum) params.lineaId = lineaIdNum;
            // Para consumibles: filtrar por categoriumId (id 15 = "Consumibles")
            if (isConsumible && catConsumibleId) params.categoriumId = Number(catConsumibleId);

            const res = await axios.get(base, { params });
            const raw = res.data;
            const list = Array.isArray(raw) ? raw : raw?.data ?? raw?.rows ?? [];
            setRows(Array.isArray(list) ? list : []);
        } catch (e) {
            console.log(e);
            setError('No se pudo cargar la búsqueda.');
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, [proveedorId, tipo, q, lineaIdNum, catConsumibleId]);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchData();
        }, DEBOUNCE_MS);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [fetchData]);

    const labelForRow = (r, tipoRow) => {
        if (!r) return '';
        // Consumibles muestran el nombre (item) primero, no la descripción
        if (tipoRow === 'consumible') {
            return r.item || r.description || r.name || r.nombre || (r.id != null ? `Ítem ${r.id}` : '');
        }
        return (
            r.description ||
            r.item ||
            r.name ||
            r.nombre ||
            (r.id != null ? `Ítem ${r.id}` : '')
        );
    };

    return (
        <div className="resultsSearchOrden" style={{ padding: '8px 10px', boxSizing: 'border-box' }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flexWrap: 'wrap',
                    marginBottom: 12,
                }}
            >
                {typeof onCloseSearch === 'function' && (
                    <button
                        type="button"
                        onClick={onCloseSearch}
                        style={{
                            border: '1px solid #ccc',
                            background: '#fff',
                            borderRadius: 6,
                            padding: '6px 10px',
                            cursor: 'pointer',
                        }}
                    >
                        ← Lista necesidad
                    </button>
                )}
            </div>

            <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 6 }}>
                    Tipo de ítem
                </span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="tipoBusquedaOrden"
                            checked={tipo === 'materia'}
                            onChange={() => setTipo('materia')}
                        />
                        Materia prima
                    </label>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="tipoBusquedaOrden"
                            checked={tipo === 'producto'}
                            onChange={() => setTipo('producto')}
                        />
                        Producto terminado
                    </label>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="tipoBusquedaOrden"
                            checked={tipo === 'consumible'}
                            onChange={() => setTipo('consumible')}
                        />
                        <span style={{ color: '#7c3aed', fontWeight: tipo === 'consumible' ? 600 : 400 }}>
                            Consumibles
                        </span>
                    </label>
                </div>
            </div>

            {tipo === 'producto' && (
                <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>
                        Línea (opcional)
                    </label>
                    <select
                        value={lineaId}
                        onChange={(e) => setLineaId(e.target.value)}
                        style={{
                            width: '100%',
                            maxWidth: 360,
                            padding: '8px 10px',
                            borderRadius: 6,
                            border: '1px solid #ccc',
                        }}
                    >
                        <option value="">Todas las líneas</option>
                        {Array.isArray(lineas) &&
                            lineas.map((ln) => (
                                <option key={ln.id} value={String(ln.id)}>
                                    {ln.name || ln.nombre || ln.id}
                                </option>
                            ))}
                    </select>
                </div>
            )}

            {/* Selector de línea para consumibles */}
            {tipo === 'consumible' && (
                <div style={{
                    marginBottom: 12,
                    padding: '8px 12px',
                    background: '#faf5ff',
                    border: '1px solid #e9d5ff',
                    borderRadius: 8,
                    fontSize: 12,
                    color: '#6b21a8',
                }}>
                    Filtrando por categoría <strong>Consumibles</strong> (id {catConsumibleId})
                </div>
            )}

            <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>
                    Buscar (texto o ID)
                </label>
                <input
                    type="search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={tipo === 'producto' ? 'Ej. lámina o número de producto' : 'Ej. acero o ID materia'}
                    style={{
                        width: '100%',
                        maxWidth: 420,
                        padding: '10px 12px',
                        borderRadius: 6,
                        border: '1px solid #ccc',
                        boxSizing: 'border-box',
                    }}
                />
            </div>

            {!proveedorId && (
                <p style={{ color: '#666', fontSize: 13 }}>No hay proveedor en la orden para buscar precios.</p>
            )}

            {proveedorId && loading && <p style={{ color: '#666' }}>Buscando…</p>}
            {error && <p style={{ color: '#c00' }}>{error}</p>}

            {proveedorId && !loading && !error && (
                <div className="bodyLeftData resultsSearchOrdenList">
                    {rows.length === 0 ? (
                        <p style={{ color: '#666', fontSize: 13 }}>Sin resultados.</p>
                    ) : allResultsEnListaPrincipal ? (
                        <p style={{ color: '#666', fontSize: 13 }}>
                            Los ítems encontrados ya están en la lista de necesidad; no se muestran aquí.
                        </p>
                    ) : (
                        rowsFiltered.map((r) => (
                            <ResultRow key={`${tipo}-${r.id}`} row={r} tipo={tipo} labelForRow={(row) => labelForRow(row, tipo)} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

function ResultRow({ row, tipo, labelForRow }) {
    const [params, setParams] = useSearchParams();

    const open = () => {
        if (row?.id == null) return;
        const next = new URLSearchParams(params);
        next.set('openSearchItem', String(row.id));
        // consumible se trata internamente como materia
        next.set('openSearchTipo', tipo === 'producto' ? 'producto' : 'materia');
        setParams(next);
    };

    const title = labelForRow(row);
    const secondary = tipo === 'consumible'
        ? (row?.description && row.description !== row.item ? row.description : null)
        : (row?.item && row?.description && row.item !== row.description ? row.item : null);
    const badgeLabel = tipo === 'producto' ? 'Producto terminado' : tipo === 'consumible' ? 'Consumible' : 'Materia prima';
    const badgeColor = tipo === 'consumible' ? '#7c3aed' : undefined;

    return (
        <div
            className="itemMPOrden"
            onClick={open}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    open();
                }
            }}
        >
                <div className="itemMPOrdenContent">
                <div className="itemMPOrdenHeader">
                    <div className="itemMPOrdenBadge">
                        <span className="badgeText" style={badgeColor ? { color: badgeColor } : undefined}>
                            {badgeLabel}
                        </span>
                    </div>
                    <div className="itemMPOrdenCodigo">
                        <span className="codigoLabel">Código</span>
                        <span className="codigoValue">{row.id}</span>
                    </div>
                </div>
                <div className="itemMPOrdenBody">
                    <h2 className="itemMPOrdenNombre">{title}</h2>
                    {secondary ? (
                        <div className="itemMPOrdenCantidad">
                            <span className="cantidadLabel">Referencia</span>
                            <span className="cantidadValue">{secondary}</span>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
