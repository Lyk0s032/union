import React, { useState, useRef, useEffect } from 'react';
import ModalEditarUsuario from './modals/modalEditarUsuario';
import ModalCambiarEstado from './modals/modalCambiarEstado';
import ModalEliminarUsuario from './modals/modalEliminarUsuario';
import ModalCambiarPassword from './modals/modalCambiarPassword';

const DEFAULT_AVATAR =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='40' fill='%23e5e7eb'/%3E%3Ccircle cx='40' cy='30' r='14' fill='%239ca3af'/%3E%3Cellipse cx='40' cy='68' rx='22' ry='18' fill='%239ca3af'/%3E%3C/svg%3E";

const RANGO_COLORS = {
    admin: { bg: '#ede9fe', color: '#6d28d9', label: 'Admin' },
    asesor: { bg: '#dcfce7', color: '#15803d', label: 'Asesor' },
};

const ESTADO_COLORS = {
    activo: { bg: '#dcfce7', color: '#15803d' },
    inactivo: { bg: '#fee2e2', color: '#b91c1c' },
};

export default function UserItem({
    usuario,
    isLast,
    onEditar,
    onCambiarEstado,
    onEliminar,
    onCambiarPassword,
}) {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [menuPos, setMenuPos] = useState({ top: null, bottom: null, right: 0 });
    const [modal, setModal] = useState(null); // 'editar' | 'estado' | 'eliminar' | 'password'
    const menuRef = useRef(null);
    const btnRef = useRef(null);

    const rangoInfo = RANGO_COLORS[usuario.rango] || {
        bg: '#f3f4f6',
        color: '#374151',
        label: usuario.rango,
    };
    const estadoInfo = ESTADO_COLORS[usuario.estado] || {
        bg: '#f3f4f6',
        color: '#374151',
    };

    // Abrir menú y calcular posición del botón (inteligente: abre hacia arriba si no hay espacio abajo)
    const MENU_HEIGHT = 180; // altura estimada del menú en px
    const MARGEN = 8;        // separación con el botón

    const toggleMenu = () => {
        if (!menuAbierto && btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            const espacioAbajo = window.innerHeight - rect.bottom;
            const abreArriba = espacioAbajo < MENU_HEIGHT + MARGEN;

            setMenuPos({
                top: abreArriba ? null : rect.bottom + MARGEN,
                bottom: abreArriba ? window.innerHeight - rect.top + MARGEN : null,
                right: window.innerWidth - rect.right,
            });
        }
        setMenuAbierto((v) => !v);
    };

    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        const handler = (e) => {
            if (
                menuRef.current && !menuRef.current.contains(e.target) &&
                btnRef.current && !btnRef.current.contains(e.target)
            ) {
                setMenuAbierto(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const abrirModal = (tipo) => {
        setMenuAbierto(false);
        setModal(tipo);
    };

    const cerrarModal = () => setModal(null);

    const handleEditar = (datos) => {
        onEditar(datos);
        cerrarModal();
    };

    const handleCambiarEstado = () => {
        onCambiarEstado();
        cerrarModal();
    };

    const handleEliminar = () => {
        onEliminar();
        cerrarModal();
    };

    const handleCambiarPassword = (pwd) => {
        onCambiarPassword(pwd);
        cerrarModal();
    };

    return (
        <>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '56px 1fr 150px 220px 100px 48px',
                    gap: '0 12px',
                    alignItems: 'center',
                    padding: '14px 20px',
                    borderBottom: isLast ? 'none' : '1px solid #f3f4f6',
                    transition: 'background 0.15s',
                    cursor: 'default',
                }}
                onMouseOver={(e) =>
                    (e.currentTarget.style.background = '#fafafa')
                }
                onMouseOut={(e) =>
                    (e.currentTarget.style.background = 'transparent')
                }
            >
                {/* ── Fotografía ─────────────────────────────────────────── */}
                <div style={{ position: 'relative' }}>
                    <img
                        src={usuario.photo || DEFAULT_AVATAR}
                        alt={`${usuario.name} ${usuario.lastName}`}
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid #e5e7eb',
                        }}
                        onError={(e) => {
                            e.currentTarget.src = DEFAULT_AVATAR;
                        }}
                    />
                    {/* Indicador de estado */}
                    <span
                        style={{
                            position: 'absolute',
                            bottom: '1px',
                            right: '1px',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background:
                                usuario.estado === 'activo' ? '#22c55e' : '#ef4444',
                            border: '2px solid #fff',
                        }}
                    />
                </div>

                {/* ── Nombre y apellido ──────────────────────────────────── */}
                <div>
                    <div
                        style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#1f2937',
                        }}
                    >
                        {usuario.name} {usuario.lastName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                        @{usuario.nick}
                    </div>
                </div>

                {/* ── Teléfono ───────────────────────────────────────────── */}
                <div style={{ fontSize: '13px', color: '#4b5563' }}>
                    {usuario.phone}
                </div>

                {/* ── Correo electrónico ─────────────────────────────────── */}
                <div
                    style={{
                        fontSize: '13px',
                        color: '#4b5563',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                    title={usuario.email}
                >
                    {usuario.email}
                </div>

                {/* ── Rango ──────────────────────────────────────────────── */}
                <div>
                    <span
                        style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: rangoInfo.bg,
                            color: rangoInfo.color,
                        }}
                    >
                        {rangoInfo.label}
                    </span>
                </div>

                {/* ── Menú de tres puntos ────────────────────────────────── */}
                <div>
                    <button
                        ref={btnRef}
                        onClick={toggleMenu}
                        style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            background: menuAbierto ? '#f3f4f6' : '#fff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            color: '#6b7280',
                            transition: 'all 0.15s',
                        }}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.background = '#f3f4f6')
                        }
                        onMouseOut={(e) =>
                            !menuAbierto &&
                            (e.currentTarget.style.background = '#fff')
                        }
                        title="Opciones"
                    >
                        ⋮
                    </button>

                    {menuAbierto && (
                        <div
                            ref={menuRef}
                            style={{
                                position: 'fixed',
                                ...(menuPos.top !== null ? { top: menuPos.top } : {}),
                                ...(menuPos.bottom !== null ? { bottom: menuPos.bottom } : {}),
                                right: menuPos.right,
                                zIndex: 9999,
                                background: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '10px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                minWidth: '200px',
                                overflow: 'hidden',
                            }}
                        >
                            <MenuItem
                                icon="✏️"
                                label="Editar"
                                onClick={() => abrirModal('editar')}
                            />
                            <MenuItem
                                icon={usuario.estado === 'activo' ? '🔴' : '🟢'}
                                label={
                                    usuario.estado === 'activo'
                                        ? 'Desactivar usuario'
                                        : 'Activar usuario'
                                }
                                onClick={() => abrirModal('estado')}
                            />
                            <MenuItem
                                icon="🔑"
                                label="Cambiar contraseña"
                                onClick={() => abrirModal('password')}
                            />
                            <div
                                style={{
                                    height: '1px',
                                    background: '#f3f4f6',
                                    margin: '4px 0',
                                }}
                            />
                            <MenuItem
                                icon="🗑️"
                                label="Eliminar usuario"
                                onClick={() => abrirModal('eliminar')}
                                danger
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* ── Modales ────────────────────────────────────────────────── */}
            {modal === 'editar' && (
                <ModalEditarUsuario
                    usuario={usuario}
                    onGuardar={handleEditar}
                    onCerrar={cerrarModal}
                />
            )}
            {modal === 'estado' && (
                <ModalCambiarEstado
                    usuario={usuario}
                    onConfirmar={handleCambiarEstado}
                    onCerrar={cerrarModal}
                />
            )}
            {modal === 'eliminar' && (
                <ModalEliminarUsuario
                    usuario={usuario}
                    onConfirmar={handleEliminar}
                    onCerrar={cerrarModal}
                />
            )}
            {modal === 'password' && (
                <ModalCambiarPassword
                    usuario={usuario}
                    onGuardar={handleCambiarPassword}
                    onCerrar={cerrarModal}
                />
            )}
        </>
    );
}

// ── Elemento del menú desplegable ─────────────────────────────────────────────
function MenuItem({ icon, label, onClick, danger }) {
    const [hover, setHover] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '10px 16px',
                border: 'none',
                background: hover
                    ? danger
                        ? '#fff1f2'
                        : '#f8f9fc'
                    : 'transparent',
                color: danger ? '#ef4444' : '#374151',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.12s',
            }}
        >
            <span style={{ fontSize: '15px' }}>{icon}</span>
            {label}
        </button>
    );
}
