import React, { useMemo } from 'react';

export default function MovimientosItem({ movimientos, page, limit, onPageChange }) {
    
    const formatearFechaEspañol = (fecha) => {
        try {
            if (!fecha) return '';
            const d = new Date(fecha);
            return d.toLocaleString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return String(fecha);
        }
    };

    const obtenerTipoMovimiento = (mov) => {
        if (mov.tipoMovimiento === 'ENTRADA') return 'Entrada';
        if (mov.tipoMovimiento === 'SALIDA') return 'Salida';
        if (mov.tipoMovimiento === 'TRANSFERENCIA') return 'Transferencia';
        return mov.tipoMovimiento || 'N/A';
    };

    const obtenerReferencia = (mov) => {
        if (mov.refDoc) return mov.refDoc;
        if (mov.cotizacionId) return `Proyecto #${mov.cotizacionId}`;
        return 'Manual';
    };

    // Paginación local
    const paginacionLocal = useMemo(() => {
        const total = movimientos.length;
        const totalPages = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const end = start + limit;
        const movimientosPaginados = movimientos.slice(start, end);

        return {
            total,
            totalPages,
            movimientosPaginados,
            start: start + 1,
            end: Math.min(end, total)
        };
    }, [movimientos, page, limit]);

    const { movimientosPaginados, total, totalPages, start, end } = paginacionLocal;

    return (
        <div className="item-section">
            <div className="item-section-header">
                <h3>Movimientos</h3>
                <span className="badge-count">{total} registros</span>
            </div>
            
            <div className="movimientos-table-container">
                <table className="movimientos-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Cantidad</th>
                            <th>Tipo</th>
                            <th>Referencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movimientosPaginados.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                                    No hay movimientos registrados
                                </td>
                            </tr>
                        ) : (
                            movimientosPaginados.map((mov, idx) => (
                                <tr key={mov.id || idx}>
                                    <td className="fecha-col">{formatearFechaEspañol(mov.createdAt)}</td>
                                    <td className="cantidad-col">{(mov.cantidad == null || Number(mov.cantidad) === 0) ? '—' : Number(mov.cantidad).toLocaleString('es-ES')}</td>
                                    <td className="tipo-col">
                                        <span className={`badge-tipo badge-${mov.tipoMovimiento?.toLowerCase() || 'default'}`}>
                                            {obtenerTipoMovimiento(mov)}
                                        </span>
                                    </td>
                                    <td className="ref-col">{obtenerReferencia(mov)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="pagination-controls">
                    <div className="pagination-info">
                        Mostrando {start} - {end} de {total} movimientos
                    </div>
                    <div className="pagination-buttons">
                        <button
                            onClick={() => onPageChange(page - 1)}
                            disabled={page <= 1}
                            className="btn-pagination"
                        >
                            Anterior
                        </button>
                        <span className="pagination-text">
                            Página {page} de {totalPages}
                        </span>
                        <button
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages}
                            className="btn-pagination"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
