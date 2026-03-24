import React from 'react';

export default function ModalCambiarEstado({ usuario, onConfirmar, onCerrar }) {
    const esActivo = usuario.estado === 'activo';
    const accion = esActivo ? 'desactivar' : 'activar';
    const nuevoEstado = esActivo ? 'Inactivo' : 'Activo';

    const iconColor = esActivo ? '#ef4444' : '#22c55e';
    const btnBg = esActivo ? '#ef4444' : '#22c55e';
    const iconEmoji = esActivo ? '🔴' : '🟢';

    return (
        <div className="modal" style={{ zIndex: 20 }}>
            <div className="hiddenModal" onClick={onCerrar} />
            <div
                className="containerModal"
                style={{
                    maxWidth: '440px',
                    width: '100%',
                    padding: '0',
                    borderRadius: '14px',
                    background: '#fff',
                    overflow: 'hidden',
                }}
            >
                {/* Top color bar */}
                <div
                    style={{
                        height: '5px',
                        background: btnBg,
                    }}
                />

                <div style={{ padding: '32px 28px 28px' }}>
                    {/* Icono */}
                    <div
                        style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: esActivo ? '#fee2e2' : '#dcfce7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            marginBottom: '20px',
                        }}
                    >
                        {iconEmoji}
                    </div>

                    {/* Título */}
                    <h2
                        style={{
                            margin: '0 0 8px',
                            fontSize: '20px',
                            fontWeight: '700',
                            color: '#111827',
                        }}
                    >
                        {esActivo ? 'Desactivar Usuario' : 'Activar Usuario'}
                    </h2>

                    {/* Descripción */}
                    <p
                        style={{
                            margin: '0 0 24px',
                            fontSize: '14px',
                            color: '#6b7280',
                            lineHeight: '1.6',
                        }}
                    >
                        ¿Estás seguro que deseas{' '}
                        <strong style={{ color: iconColor }}>{accion}</strong> al usuario{' '}
                        <strong style={{ color: '#111827' }}>
                            {usuario.name} {usuario.lastName}
                        </strong>
                        ? Su estado pasará a{' '}
                        <strong style={{ color: iconColor }}>{nuevoEstado}</strong>.
                    </p>

                    {/* Info del usuario */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '14px 16px',
                            background: '#f9fafb',
                            borderRadius: '10px',
                            marginBottom: '24px',
                            border: '1px solid #f3f4f6',
                        }}
                    >
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: '#e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                                fontWeight: '700',
                                color: '#374151',
                                flexShrink: 0,
                            }}
                        >
                            {usuario.name?.charAt(0)?.toUpperCase()}
                            {usuario.lastName?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                            <div
                                style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#111827',
                                }}
                            >
                                {usuario.name} {usuario.lastName}
                            </div>
                            <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                @{usuario.nick} · {usuario.email}
                            </div>
                        </div>
                        <span
                            style={{
                                marginLeft: 'auto',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '600',
                                background: esActivo ? '#dcfce7' : '#fee2e2',
                                color: esActivo ? '#15803d' : '#b91c1c',
                            }}
                        >
                            {esActivo ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>

                    {/* Acciones */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button
                            onClick={onCerrar}
                            style={{
                                padding: '10px 22px',
                                fontSize: '14px',
                                fontWeight: '500',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                background: '#fff',
                                color: '#374151',
                                cursor: 'pointer',
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirmar}
                            style={{
                                padding: '10px 26px',
                                fontSize: '14px',
                                fontWeight: '600',
                                border: 'none',
                                borderRadius: '8px',
                                background: btnBg,
                                color: '#fff',
                                cursor: 'pointer',
                                boxShadow: `0 2px 8px ${btnBg}55`,
                            }}
                        >
                            Sí, {accion}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
