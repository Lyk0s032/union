import React, { useState } from 'react';

export default function ModalCambiarPassword({ usuario, onGuardar, onCerrar }) {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const errs = {};
        if (!password.trim()) errs.password = 'Requerido';
        else if (password.length < 6) errs.password = 'Mínimo 6 caracteres';
        if (!confirm.trim()) errs.confirm = 'Requerido';
        else if (password !== confirm) errs.confirm = 'Las contraseñas no coinciden';
        return errs;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }
        onGuardar(password);
    };

    const inputBase = {
        width: '100%',
        padding: '10px 44px 10px 14px',
        fontSize: '14px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        boxSizing: 'border-box',
        outline: 'none',
        background: '#fff',
        color: '#111',
    };

    const eyeBtn = {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        color: '#9ca3af',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
    };

    const strengthLevel = () => {
        if (password.length === 0) return null;
        if (password.length < 6) return { label: 'Débil', color: '#ef4444', width: '25%' };
        if (password.length < 10) return { label: 'Media', color: '#f59e0b', width: '55%' };
        return { label: 'Fuerte', color: '#22c55e', width: '100%' };
    };
    const strength = strengthLevel();

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
                {/* Top bar */}
                <div style={{ height: '5px', background: '#2f8bfd' }} />

                <div style={{ padding: '32px 28px 28px' }}>
                    {/* Icono */}
                    <div
                        style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: '#eff6ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            marginBottom: '20px',
                        }}
                    >
                        🔑
                    </div>

                    {/* Título */}
                    <h2
                        style={{
                            margin: '0 0 6px',
                            fontSize: '20px',
                            fontWeight: '700',
                            color: '#111827',
                        }}
                    >
                        Cambiar Contraseña
                    </h2>
                    <p
                        style={{
                            margin: '0 0 24px',
                            fontSize: '13px',
                            color: '#9ca3af',
                        }}
                    >
                        {usuario.name} {usuario.lastName} — @{usuario.nick}
                    </p>

                    <form onSubmit={handleSubmit}>
                        {/* Nueva contraseña */}
                        <div style={{ marginBottom: '16px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#374151',
                                }}
                            >
                                Nueva contraseña <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPwd ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setErrors((p) => ({ ...p, password: undefined }));
                                    }}
                                    placeholder="Mínimo 6 caracteres"
                                    autoFocus
                                    style={{
                                        ...inputBase,
                                        borderColor: errors.password ? '#ef4444' : '#d1d5db',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd((v) => !v)}
                                    style={eyeBtn}
                                    title={showPwd ? 'Ocultar' : 'Mostrar'}
                                >
                                    {showPwd ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {errors.password && (
                                <p
                                    style={{
                                        margin: '4px 0 0',
                                        fontSize: '12px',
                                        color: '#ef4444',
                                    }}
                                >
                                    {errors.password}
                                </p>
                            )}

                            {/* Barra de fortaleza */}
                            {strength && (
                                <div style={{ marginTop: '8px' }}>
                                    <div
                                        style={{
                                            height: '4px',
                                            background: '#f3f4f6',
                                            borderRadius: '4px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: '100%',
                                                width: strength.width,
                                                background: strength.color,
                                                borderRadius: '4px',
                                                transition: 'width 0.3s, background 0.3s',
                                            }}
                                        />
                                    </div>
                                    <p
                                        style={{
                                            margin: '4px 0 0',
                                            fontSize: '12px',
                                            color: strength.color,
                                            fontWeight: '500',
                                        }}
                                    >
                                        {strength.label}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirmar contraseña */}
                        <div style={{ marginBottom: '28px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    marginBottom: '6px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#374151',
                                }}
                            >
                                Confirmar contraseña <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirm}
                                    onChange={(e) => {
                                        setConfirm(e.target.value);
                                        setErrors((p) => ({ ...p, confirm: undefined }));
                                    }}
                                    placeholder="Repite la contraseña"
                                    style={{
                                        ...inputBase,
                                        borderColor: errors.confirm
                                            ? '#ef4444'
                                            : confirm && confirm === password
                                            ? '#22c55e'
                                            : '#d1d5db',
                                        background:
                                            confirm && confirm === password
                                                ? '#f0fdf4'
                                                : '#fff',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm((v) => !v)}
                                    style={eyeBtn}
                                    title={showConfirm ? 'Ocultar' : 'Mostrar'}
                                >
                                    {showConfirm ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {errors.confirm && (
                                <p
                                    style={{
                                        margin: '4px 0 0',
                                        fontSize: '12px',
                                        color: '#ef4444',
                                    }}
                                >
                                    {errors.confirm}
                                </p>
                            )}
                            {confirm && confirm === password && !errors.confirm && (
                                <p
                                    style={{
                                        margin: '4px 0 0',
                                        fontSize: '12px',
                                        color: '#22c55e',
                                        fontWeight: '500',
                                    }}
                                >
                                    ✓ Las contraseñas coinciden
                                </p>
                            )}
                        </div>

                        {/* Acciones */}
                        <div
                            style={{
                                display: 'flex',
                                gap: '12px',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <button
                                type="button"
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
                                type="submit"
                                style={{
                                    padding: '10px 26px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    border: 'none',
                                    borderRadius: '8px',
                                    background: '#2f8bfd',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(47,139,253,0.3)',
                                }}
                            >
                                Cambiar Contraseña
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
