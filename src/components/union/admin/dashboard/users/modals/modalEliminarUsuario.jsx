import React, { useState } from 'react';

export default function ModalEliminarUsuario({ usuario, onConfirmar, onCerrar }) {
    const [confirmText, setConfirmText] = useState('');
    const expected = usuario.nick || 'eliminar';
    const isValid = confirmText === expected;

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
                {/* Top danger bar */}
                <div style={{ height: '5px', background: '#ef4444' }} />

                <div style={{ padding: '32px 28px 28px' }}>
                    {/* Icono */}
                    <div
                        style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: '#fee2e2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            marginBottom: '20px',
                        }}
                    >
                        🗑️
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
                        Eliminar Usuario
                    </h2>

                    {/* Advertencia */}
                    <p
                        style={{
                            margin: '0 0 20px',
                            fontSize: '14px',
                            color: '#6b7280',
                            lineHeight: '1.6',
                        }}
                    >
                        Esta acción es{' '}
                        <strong style={{ color: '#ef4444' }}>permanente e irreversible</strong>.
                        El usuario{' '}
                        <strong style={{ color: '#111827' }}>
                            {usuario.name} {usuario.lastName}
                        </strong>{' '}
                        será eliminado del sistema.
                    </p>

                    {/* Info del usuario */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '14px 16px',
                            background: '#fff5f5',
                            borderRadius: '10px',
                            marginBottom: '20px',
                            border: '1px solid #fecaca',
                        }}
                    >
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: '#fee2e2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                                fontWeight: '700',
                                color: '#ef4444',
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
                    </div>

                    {/* Confirmación con texto */}
                    <div style={{ marginBottom: '24px' }}>
                        <label
                            style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '13px',
                                color: '#374151',
                            }}
                        >
                            Para confirmar, escribe el nick del usuario:{' '}
                            <strong style={{ color: '#ef4444' }}>{expected}</strong>
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder={expected}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                fontSize: '14px',
                                border: `1px solid ${isValid ? '#22c55e' : '#d1d5db'}`,
                                borderRadius: '8px',
                                boxSizing: 'border-box',
                                outline: 'none',
                                background: isValid ? '#f0fdf4' : '#fff',
                                color: '#111',
                                transition: 'border-color 0.2s, background 0.2s',
                            }}
                            autoFocus
                        />
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
                            disabled={!isValid}
                            style={{
                                padding: '10px 26px',
                                fontSize: '14px',
                                fontWeight: '600',
                                border: 'none',
                                borderRadius: '8px',
                                background: isValid ? '#ef4444' : '#fca5a5',
                                color: '#fff',
                                cursor: isValid ? 'pointer' : 'not-allowed',
                                boxShadow: isValid ? '0 2px 8px rgba(239,68,68,0.35)' : 'none',
                                transition: 'all 0.2s',
                            }}
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
