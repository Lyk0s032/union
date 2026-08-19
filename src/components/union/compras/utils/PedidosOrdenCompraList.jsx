import React from 'react';
import { getNumeroPedidoFromRequisicion, getRequisicionesFromOrden } from './pedidosOrdenCompraUtils';

const styles = {
    wrap: {
        marginTop: 12,
        padding: '10px 12px',
        borderRadius: 8,
        background: '#f8fafc',
        border: '1px solid #e8edf2',
    },
    title: {
        display: 'block',
        fontSize: 12,
        fontWeight: 600,
        color: '#666',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
    },
    empty: {
        margin: 0,
        fontSize: 13,
        color: '#888',
    },
    list: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
    },
    item: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        color: '#333',
    },
    numero: {
        fontWeight: 700,
        color: '#1890ff',
    },
    nombre: {
        flex: '1 1 auto',
    },
    id: {
        fontSize: 11,
        color: '#888',
    },
};

export default function PedidosOrdenCompraList({ orden, requisiciones }) {
    const list = Array.isArray(requisiciones)
        ? requisiciones
        : getRequisicionesFromOrden(orden);

    if (!list.length) {
        return (
            <div style={styles.wrap}>
                <span style={styles.title}>Pedidos asociados</span>
                <p style={styles.empty}>Sin pedidos vinculados a esta orden.</p>
            </div>
        );
    }

    return (
        <div style={styles.wrap}>
            <span style={styles.title}>Pedidos asociados</span>
            <ul style={styles.list}>
                {list.map((req) => {
                    const proyectoId = req.id || req.requisicionId;
                    const nombre = req.nombre || req.name || `Proyecto ${proyectoId || '—'}`;
                    const numeroPedido = getNumeroPedidoFromRequisicion(req);
                    const key = proyectoId || numeroPedido || nombre;

                    return (
                        <li key={key} style={styles.item}>
                            {numeroPedido != null && (
                                <span style={styles.numero}>Pedido {numeroPedido}</span>
                            )}
                            <span style={styles.nombre}>{nombre}</span>
                            {proyectoId ? (
                                <span style={styles.id}>Proy. {proyectoId}</span>
                            ) : null}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
