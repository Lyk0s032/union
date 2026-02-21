import React from 'react';

export default function DetallesItem({ itemData }) {
    if (!itemData || !itemData.meta) {
        return (
            <div className="item-section">
                <h3>Detalles del producto</h3>
                <p style={{ color: '#999' }}>No hay información disponible</p>
            </div>
        );
    }

    const { meta } = itemData;

    return (
        <div className="item-section">
            <div className="item-section-header">
                <h3>Detalles del producto</h3>
            </div>

            {/* Row grande: Nombre | Descripción */}
            <div className="big-info-row" style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <div className="big-box" style={{ flex: 1, padding: 16, borderRadius: 8, background: '#f9fafb', border: '1px solid #e6e9ef' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Nombre</div>
                    <div style={{ fontSize: 12, color: '#666', wordBreak: 'break-word' }}>{meta.item || meta.description || 'N/A'}</div>
                </div>
                <div className="big-box" style={{ flex: 1, padding: 16, borderRadius: 8, background: '#f9fafb', border: '1px solid #e6e9ef' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Descripción</div>
                    <div style={{ fontSize: 12, color: '#666', wordBreak: 'break-word' }}>{meta.description || 'N/A'}</div>
                </div>
            </div>

            {/* Row pequeño: Medida | Unidad */}
            <div className="small-info-row" style={{ display: 'flex', gap: 12 }}>
                <div className="small-box" style={{ flex: 1, padding: 12, borderRadius: 8, background: '#fff', border: '1px solid #e6e9ef' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>Medida</div>
                    <div style={{ fontSize: 14, color: '#6b7280' }}>{meta.medida || '—'}</div>
                </div>
                <div className="small-box" style={{ flex: 1, padding: 12, borderRadius: 8, background: '#fff', border: '1px solid #e6e9ef' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>Unidad</div>
                    <div style={{ fontSize: 14, color: '#6b7280' }}>{meta.unidad || '—'}</div>
                </div>
            </div>
        </div>
    );
}
