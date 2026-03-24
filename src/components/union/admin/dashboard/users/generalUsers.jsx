import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../store/action/action';
import UserItem from './userItem';
import ModalCrearUsuario from './modals/modalCrearUsuario';

export default function GeneralUsers() {
    const dispatch = useDispatch();

    // ── Redux state ──────────────────────────────────────────────────────────
    const { users, loadingUsers } = useSelector((store) => store.users);

    const [busqueda, setBusqueda] = useState('');
    const [modalCrear, setModalCrear] = useState(false);
    const [cargaInicial, setCargaInicial] = useState(false);

    // ── Carga inicial (muestra spinner la primera vez) ───────────────────────
    useEffect(() => {
        if (!cargaInicial) {
            dispatch(actions.axiosToGetUsers(true));
            setCargaInicial(true);
        }
    }, [cargaInicial, dispatch]);

    // ── Filtrado por nombre completo o teléfono ──────────────────────────────
    const usuariosFiltrados = Array.isArray(users)
        ? users.filter((u) => {
              if (!busqueda.trim()) return true;
              const q = busqueda.toLowerCase();
              const nombreCompleto = `${u.name} ${u.lastName}`.toLowerCase();
              return nombreCompleto.includes(q) || (u.phone || '').includes(q);
          })
        : [];

    // ── Handlers (llaman a Redux thunks que actualizan el estado) ────────────
    const handleCrearUsuario = (datos) => {
        // El backend espera `age` (no `edad`) → mapeamos
        const payload = {
            ...datos,
            age: datos.edad,
        };
        delete payload.edad;
        dispatch(actions.axiosToCreateUser(payload, () => setModalCrear(false)));
    };

    const handleEditarUsuario = (id, datos) => {
        const payload = { ...datos, age: datos.edad };
        delete payload.edad;
        dispatch(actions.axiosToUpdateUser(id, payload));
    };

    const handleCambiarEstado = (id) => {
        dispatch(actions.axiosToChangeUserState(id));
    };

    const handleEliminarUsuario = (id) => {
        dispatch(actions.axiosToDeleteUser(id));
    };

    const handleCambiarPassword = (id, nuevaPassword) => {
        dispatch(actions.axiosToChangePassword(id, nuevaPassword));
    };

    // ── Estado de carga inicial (spinner visible) ────────────────────────────
    if (loadingUsers && !users) {
        return (
            <div style={{ padding: '28px' }}>
                <HeaderPanel
                    total={0}
                    onNuevoUsuario={() => setModalCrear(true)}
                />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '80px',
                        gap: '16px',
                        color: '#9ca3af',
                    }}
                >
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            border: '4px solid #f3f4f6',
                            borderTopColor: '#2f8bfd',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                        }}
                    />
                    <span style={{ fontSize: '14px' }}>Cargando usuarios...</span>
                </div>
            </div>
        );
    }

    // ── Estado de error ──────────────────────────────────────────────────────
    if (users === 'notrequest' || users === 404) {
        return (
            <div style={{ padding: '28px' }}>
                <HeaderPanel
                    total={0}
                    onNuevoUsuario={() => setModalCrear(true)}
                />
                <div
                    style={{
                        padding: '40px',
                        textAlign: 'center',
                        background: '#fff3cd',
                        borderRadius: '10px',
                        border: '1px solid #ffc107',
                        color: '#856404',
                    }}
                >
                    <div style={{ fontSize: '18px', marginBottom: '12px' }}>
                        ⚠️ Error al cargar los usuarios
                    </div>
                    <button
                        onClick={() => dispatch(actions.axiosToGetUsers(true))}
                        style={{
                            padding: '10px 22px',
                            background: '#2f8bfd',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                        }}
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '28px 28px 60px 28px' }}>
            {/* ── HEADER ──────────────────────────────────────────────────── */}
            <HeaderPanel
                total={Array.isArray(users) ? users.length : 0}
                onNuevoUsuario={() => setModalCrear(true)}
            />

            {/* ── BUSCADOR ────────────────────────────────────────────────── */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '24px',
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    padding: '0 16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
            >
                <span style={{ fontSize: '18px', color: '#aaa' }}>🔍</span>
                <input
                    type="text"
                    placeholder="Buscar por nombre o teléfono..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '13px 0',
                        fontSize: '14px',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        color: '#333',
                    }}
                />
                {busqueda && (
                    <button
                        onClick={() => setBusqueda('')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px',
                            color: '#aaa',
                            padding: '4px',
                        }}
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* ── ENCABEZADO DE COLUMNAS ──────────────────────────────────── */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '56px 1fr 150px 220px 100px 48px',
                    gap: '0 12px',
                    padding: '10px 20px',
                    background: '#f8f9fc',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px 10px 0 0',
                    borderBottom: 'none',
                }}
            >
                {['', 'Nombre', 'Teléfono', 'Correo', 'Rango', ''].map((col, i) => (
                    <span
                        key={i}
                        style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                        }}
                    >
                        {col}
                    </span>
                ))}
            </div>

            {/* ── LISTA DE USUARIOS ────────────────────────────────────────── */}
            <div
                style={{
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0 0 10px 10px',
                    // Indicador sutil de recarga silenciosa
                    opacity: loadingUsers ? 0.7 : 1,
                    transition: 'opacity 0.2s',
                    position: 'relative', // establece contexto de apilamiento
                }}
            >
                {usuariosFiltrados.length === 0 ? (
                    <div
                        style={{
                            padding: '60px',
                            textAlign: 'center',
                            color: '#888',
                            fontSize: '15px',
                        }}
                    >
                        {busqueda
                            ? `No se encontraron usuarios con "${busqueda}"`
                            : 'No hay usuarios registrados'}
                    </div>
                ) : (
                    usuariosFiltrados.map((usuario, index) => (
                        <UserItem
                            key={usuario.id}
                            usuario={normalizar(usuario)}
                            isLast={index === usuariosFiltrados.length - 1}
                            onEditar={(datos) => handleEditarUsuario(usuario.id, datos)}
                            onCambiarEstado={() => handleCambiarEstado(usuario.id)}
                            onEliminar={() => handleEliminarUsuario(usuario.id)}
                            onCambiarPassword={(pwd) =>
                                handleCambiarPassword(usuario.id, pwd)
                            }
                        />
                    ))
                )}
            </div>

            {/* ── MODAL CREAR USUARIO ──────────────────────────────────────── */}
            {modalCrear && (
                <ModalCrearUsuario
                    onGuardar={handleCrearUsuario}
                    onCerrar={() => setModalCrear(false)}
                />
            )}
        </div>
    );
}

// ── Adapta el modelo de la API al modelo del componente ───────────────────────
// La API usa: age, state | El componente usa: edad, estado
function normalizar(u) {
    return {
        ...u,
        edad: u.age,
        estado: u.state === 'active' ? 'activo' : 'inactivo',
    };
}

// ── Subcomponente de cabecera ─────────────────────────────────────────────────
function HeaderPanel({ total, onNuevoUsuario }) {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '28px',
            }}
        >
            <div>
                <h1
                    style={{
                        margin: 0,
                        fontSize: '26px',
                        fontWeight: '700',
                        color: '#1a1a2e',
                    }}
                >
                    Gestión de Usuarios
                </h1>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#888' }}>
                    {total} usuario{total !== 1 ? 's' : ''} registrado
                    {total !== 1 ? 's' : ''}
                </p>
            </div>

            <button
                onClick={onNuevoUsuario}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 22px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '10px',
                    background: '#2f8bfd',
                    color: '#fff',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(47,139,253,0.35)',
                    transition: 'background 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#1a6fd4')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#2f8bfd')}
            >
                <span style={{ fontSize: '18px', lineHeight: 1 }}>＋</span>
                Nuevo Usuario
            </button>
        </div>
    );
}
