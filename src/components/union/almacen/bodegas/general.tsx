import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/action/action';
import ItemModal from './item/itemModal';

type ProductItem = {
  id: number;
  sku: string;
  ean: string;
  name: string;
  maker: string;
  trademark: string | null;
  estado: 'Activo' | 'Inactivo';
  unidad?: string;
  medida?: string;
  bodega: 'MP' | 'PT';
};

// NOTE: removed hard-coded/mock product generation to rely exclusively on backend data.

export default function GeneralAlmacen() {
  function formatearFechaEspañol(fecha) {
    try {
      if (!fecha) return '';
      const d = new Date(fecha);
      return d.toLocaleString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return String(fecha);
    }
  }
  const [selectedBodega, setSelectedBodega] = useState<'MP' | 'PT'>('MP');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 50; // when API is connected it will return 50 per page
  // redux
  const dispatch = useDispatch();
  const almacen = useSelector((s: any) => s.almacen || {});
  const productosBodega = almacen.productosBodega || null;
  const loadingProductosBodega = almacen.loadingProductosBodega || false;

  // track initial load per bodega to show skeleton only first time
  const [firstLoadDone, setFirstLoadDone] = useState<{ MP?: boolean; PT?: boolean }>({});
  const [initialLoading, setInitialLoading] = useState(true);

  // local deleted ids (optimistic client-side removal)
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  // derive source data solely from backend reducer (no client-side mock)
  const sourceData = (productosBodega && productosBodega.data)
    ? productosBodega.data.filter((r: any) => !deletedIds.includes(r.itemId))
    : [];

  // track first load per bodega to show skeleton first time
  useEffect(() => {
    if (productosBodega && productosBodega.data && productosBodega.data.length > 0) {
      setFirstLoadDone(prev => ({ ...prev, [selectedBodega]: true }));
    }
  }, [productosBodega, selectedBodega]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sourceData;
    return sourceData.filter(p =>
      String(p.id).includes(q) ||
      (p.sku || '').toString().toLowerCase().includes(q) ||
      (p.nombre || p.name || '').toString().toLowerCase().includes(q) ||
      (p.maker || '').toLowerCase().includes(q)
    );
  }, [sourceData, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // menu & modal state
  // openMenuKey is a string key that uniquely identifies a row menu.
  // For Producto Terminado we include medida when present to differentiate items with same id.
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProductItem | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  // Item Modal state
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<any>(null);

  function openMenuFor(item: any) {
    const base = String(item?.itemId ?? item?.id ?? '');
    const medidaPart = (selectedBodega === 'PT' && item?.medida) ? `::${String(item.medida)}` : '';
    const key = `${base}${medidaPart}`;
    setOpenMenuId(prev => (prev === key ? null : key));
  }

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      // if click is inside a menu or on a menu-button, ignore
      if (target.closest('.row-menu') || target.closest('.menu-button')) return;
      setOpenMenuId(null);
    };

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenuId(null);
    };

    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  function handleOpenItem(item: ProductItem) {
    // Abrir modal con información del item
    // Log para depuración (ver en consola del navegador)
    try {
      console.log('[GENERAL] handleOpenItem:', { item });
    } catch (e) {}
    setSelectedItemForModal(item);
    setShowItemModal(true);
    setOpenMenuId(null);
  }

  function handleCloseItemModal() {
    setShowItemModal(false);
    setSelectedItemForModal(null);
  }

  // Función para recargar silenciosamente la tabla después de operaciones
  const recargarTablaSilencioso = () => {
    const ubicacionId = selectedBodega === 'MP' ? 1 : 4;
    const tipo = selectedBodega === 'MP' ? 'MP' : 'PR';
    const fn: any = actions.axiosToGetStockBodega;
    // Pasar false para que no muestre loading (recarga en segundo plano)
    (dispatch as any)(fn(false, ubicacionId, page, pageSize, tipo));
    console.log('[GENERAL] Recargando tabla silenciosamente después de operación');
  };

  function handleDownload(item: ProductItem) {
    const content = `ID: ${item.id}\nSKU: ${item.sku}\nNombre: ${item.name}\nMaker: ${item.maker}\nEstado: ${item.estado}`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `item-${item.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setOpenMenuId(null);
  }

  function confirmDelete(item: ProductItem) {
    setDeleteTarget(item);
    setDeleteConfirmText('');
    setShowDeleteModal(true);
    setOpenMenuId(null);
  }

  function performDelete() {
    if (!deleteTarget) return;
    // require exact match of the table-visible string (use name)
    if (deleteConfirmText !== deleteTarget.name) {
      alert('Texto no coincide exactamente. Escribe el nombre tal como aparece en la tabla para confirmar.');
      return;
    }
    setDeletedIds(prev => [...prev, deleteTarget.id]);
    // adjust counts display if present (MP -> 1, PT -> 4)
    setCountsByBodega(prev => {
      const bId = deleteTarget.bodega === 'MP' ? 1 : 4;
      const current = prev[bId] || 0;
      return { ...prev, [bId]: Math.max(0, current - 1) };
    });
    setShowDeleteModal(false);
    setDeleteTarget(null);
  }

  function handleSelectBodega(b: 'MP' | 'PT') {
    setSelectedBodega(b);
    setPage(1);
    setQuery('');
  }

  // fetch from backend via action -> reducer
  useEffect(() => {
    const ubicacionId = selectedBodega === 'MP' ? 1 : 2;
    const tipo = selectedBodega === 'MP' ? 'MP' : 'PR';
    const fn: any = actions.axiosToGetStockBodega;
    (dispatch as any)(fn(true, ubicacionId, page, pageSize, tipo));
  }, [selectedBodega, page, dispatch]);

  // fetch counts for both bodegas to show in header (page=1, limit=1 returns total)
  const [countsByBodega, setCountsByBodega] = useState<{ [k:number]: number }>({});
  useEffect(() => {
    let cancelled = false;
    async function fetchCounts() {
      try {
        const res1 = await axios.get('/api/stock/bodega/1', { params: { page: 1, limit: 1, tipo: 'MP' }});
        const res2 = await axios.get('/api/stock/bodega/2', { params: { page: 1, limit: 1, tipo: 'PR' }});
        if (cancelled) return;
        const c1 = res1.data?.total ?? 0;
        const c2 = res2.data?.total ?? 0;
        setCountsByBodega({ 1: c1, 2: c2 });
      } catch (err) {
        console.error('Error fetching bodega counts:', err);
        if (!cancelled) setCountsByBodega({ 1: 0, 2: 0 });
      }
    }
    fetchCounts();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="general-almacen" style={{ padding: 28 }}>
      <style>{`
        .general-almacen .section-gap { margin-bottom: 24px; }
        .general-almacen table { font-family: inherit; font-size: 14px; }
        .general-almacen thead th { padding: 14px 12px !important; text-transform: uppercase; font-size: 12px; color: #666; }
        .product-row td { padding: 14px 12px; vertical-align: middle; }
        .product-row:hover { background: #fbfcfe; }
        .general-almacen .controls { gap: 12px; display: flex; align-items: center; }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }} className="section-gap">
        <h2 style={{ margin: 0 }}>Productos</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => handleSelectBodega('MP')}
            aria-pressed={selectedBodega === 'MP'}
            style={{
              padding: '8px 12px',
              background: selectedBodega === 'MP' ? '#2f8bfd' : 'transparent',
              color: selectedBodega === 'MP' ? '#fff' : '#2f8bfd',
              border: '1px solid #2f8bfd',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            Bodega Materia Prima ({countsByBodega[1] ?? 0})
          </button>
          <button
            onClick={() => handleSelectBodega('PT')}
            aria-pressed={selectedBodega === 'PT'}
            style={{
              padding: '8px 12px',
              background: selectedBodega === 'PT' ? '#2f8bfd' : 'transparent',
              color: selectedBodega === 'PT' ? '#fff' : '#2f8bfd',
              border: '1px solid #2f8bfd',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            Bodega Producto Terminado ({countsByBodega[2] ?? 0})
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }} className="section-gap">
        <input
          placeholder={`Buscar ${total} registros...`}
          value={query}
          onChange={e => { setQuery(e.target.value); setPage(1); }}
          style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #e0e0e0', width: 300 }}
        />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }} className="controls">
          <button style={{ padding: '8px 12px', borderRadius: 6, background: '#2f8bfd', color: '#fff', border: 'none' }}>
            Descargar Plantilla
          </button>
          <button style={{ padding: '8px 12px', borderRadius: 6, background: '#2f8bfd', color: '#fff', border: 'none' }}>
            Exportar
          </button>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #eef1f6', borderRadius: 6, overflow: 'visible', padding: 6 }} className="section-gap">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#fafafa' }}>
            <tr>
              <th style={{ padding: 12, textAlign: 'left' }}>Código</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Item</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Cantidad</th>
                 <th style={{ padding: 12, textAlign: 'left' }}>Últ.
                     actualización</th>
                 <th style={{ padding: 12, textAlign: 'left' }}>ESTADO</th>
              <th style={{ padding: 12, textAlign: 'left' }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(p => {
              const rowMenuKey = `${String(p?.itemId ?? p?.id ?? '')}${(selectedBodega === 'PT' && p?.medida) ? `::${String(p.medida)}` : ''}`;
              return (
              <tr key={p.id} className="product-row" style={{ borderTop: '1px solid #f1f3f6' }}>
                <td style={{ padding: 12, fontSize: 12 }}>{p?.itemId}</td>
                <td style={{ padding: 12, fontSize: 11, color: '#666'}}>
                    {p.nombre} <span style={{ fontSize: 12, color: '#666' }}>{p.isMt2 ? `| ${p.medida} mt2` : ''}</span> <br />
                    <span style={{ fontSize: 12, color: '#666' }}>{p?.tipo == 'MP' ? 'Materia' : 'Producto'}</span>
                </td>
                <td style={{ padding: 12, fontSize: 12 }}>{p.cantidad}</td>
                 <td style={{ padding: 12, fontSize: 12, color: '#666' }}>{formatearFechaEspañol(p?.updatedAt)}</td>
                <td style={{ padding: 12, fontSize: 12 }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    background: p.estado === 'Activo' ? '#e6fff0' : '#fff3f3',
                    color: p?.cantidad || p?.cantidad > 0 ? '#2b8a4b' : '#c23b3b',
                    borderRadius: 12,
                    fontSize: 12
                  }}>{!p?.cantidad || p?.cantidad < 0 ? 'Agotado' : 'Disponible'}</span>
                </td>
                <td style={{ padding: 12, position: 'relative' }}>
                  <button
                    onClick={() => openMenuFor(p)}
                    aria-haspopup="true"
                    aria-expanded={openMenuId === rowMenuKey}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '6px 8px',
                      borderRadius: 6
                    }}
                    className="menu-button"
                  >
                    ⋯
                  </button>
                  {openMenuId === rowMenuKey && (
                    <div className="row-menu" style={{
                      position: 'absolute',
                      right: 12,
                      top: 36,
                      background: '#fff',
                      border: '1px solid #e6e9ef',
                      boxShadow: '0 6px 18px rgba(28,45,102,0.06)',
                      borderRadius: 6,
                      zIndex: 3000,
                      minWidth: 160
                    }}>
                      <button onClick={() => handleOpenItem(p)} style={{ display: 'block', width: '100%', padding: 10, background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Abrir item</button>
                      <button onClick={() => handleDownload(p)} style={{ display: 'block', width: '100%', padding: 10, background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Descargar</button>
                      <button onClick={() => confirmDelete(p)} style={{ display: 'block', width: '100%', padding: 10, background: 'transparent', border: 'none', textAlign: 'left', color: '#e25555', cursor: 'pointer' }}>Eliminar item</button>
                    </div>
                  )}
                </td>
              </tr>
            );
            })}
            {paged.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#666' }}>
                  No hay movimientos registrados para esta bodega
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <div style={{ fontSize: 13, color: '#666' }}>
          Mostrando {Math.min((page - 1) * pageSize + 1, total)} - {Math.min(page * pageSize, total)} de {total} movimientos
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} style={{ padding: '6px 10px', borderRadius: 6 }}>
            Anterior
          </button>
          <div style={{ padding: '6px 10px', alignSelf: 'center' }}>
            Página {page} / {totalPages}
          </div>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ padding: '6px 10px', borderRadius: 6 }}>
            Siguiente
          </button>
        </div>
      </div>
      {/* Delete confirmation modal */}
      {showDeleteModal && deleteTarget && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(10,20,40,0.4)', zIndex: 2000
        }}>
          <div style={{ width: 520, background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 10px 30px rgba(11,22,60,0.12)' }}>
            <h3>Confirmar eliminación</h3>
            <p>Para confirmar la eliminación escribe exactamente el nombre del item en la tabla:</p>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>{deleteTarget.name}</div>
            <input value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)} style={{ width: '100%', padding: '8px 10px', marginBottom: 12, borderRadius: 6, border: '1px solid #e6e9ef' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }} style={{ padding: '8px 12px', borderRadius: 6 }}>Cancelar</button>
              <button onClick={performDelete} disabled={deleteConfirmText !== deleteTarget.name} style={{ padding: '8px 12px', borderRadius: 6, background: deleteConfirmText === deleteTarget.name ? '#e25555' : '#f5bcbc', color: '#fff', border: 'none' }}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item Modal */}
      {showItemModal && selectedItemForModal && (
        <ItemModal
          item={selectedItemForModal}
          bodegaId={selectedBodega === 'MP' ? 1 : 4}
          onClose={handleCloseItemModal}
          onOperacionExitosa={recargarTablaSilencioso}
        />
      )}
    </div>
  );
}