import React, { useState } from 'react';

const INPUT_STYLE = {
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    boxSizing: 'border-box',
    outline: 'none',
    background: '#fff',
    color: '#111',
};

const LABEL_STYLE = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
};

export default function ModalEditarUsuario({ usuario, onGuardar, onCerrar }) {
    const [form, setForm] = useState({
        name: usuario.name || '',
        lastName: usuario.lastName || '',
        nick: usuario.nick || '',
        phone: usuario.phone || '',
        email: usuario.email || '',
        rango: usuario.rango || 'asesor',
        edad: usuario.edad ? String(usuario.edad) : '',
    });
    const [errors, setErrors] = useState({});

    const set = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Requerido';
        if (!form.lastName.trim()) errs.lastName = 'Requerido';
        if (!form.nick.trim()) errs.nick = 'Requerido';
        if (!form.phone.trim()) errs.phone = 'Requerido';
        if (!form.email.trim()) errs.email = 'Requerido';
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Correo inválido';
        if (!form.edad || isNaN(Number(form.edad)) || Number(form.edad) < 1)
            errs.edad = 'Edad inválida';
        return errs;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }
        onGuardar({ ...form, edad: Number(form.edad) });
    };

    const inputStyle = (field) => ({
        ...INPUT_STYLE,
        borderColor: errors[field] ? '#ef4444' : '#d1d5db',
    });

    return (
        <div className="modal" style={{ zIndex: 20 }}>
            <div className="hiddenModal" onClick={onCerrar} />
            <div
                className="containerModal"
                style={{
                    maxWidth: '580px',
                    width: '100%',
                    padding: '0',
                    borderRadius: '14px',
                    maxHeight: '92vh',
                    overflowY: 'auto',
                    background: '#fff',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: '24px 28px',
                        borderBottom: '1px solid #f3f4f6',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div>
                        <h2
                            style={{
                                margin: 0,
                                fontSize: '18px',
                                fontWeight: '700',
                                color: '#111827',
                            }}
                        >
                            Editar Usuario
                        </h2>
                        <p
                            style={{
                                margin: '4px 0 0',
                                fontSize: '13px',
                                color: '#9ca3af',
                            }}
                        >
                            {usuario.name} {usuario.lastName} — @{usuario.nick}
                        </p>
                    </div>
                    <button
                        onClick={onCerrar}
                        style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            background: '#fff',
                            cursor: 'pointer',
                            fontSize: '16px',
                            color: '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
                    {/* Nombre y Apellido */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '16px',
                            marginBottom: '16px',
                        }}
                    >
                        <div>
                            <label style={LABEL_STYLE}>
                                Nombre <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={set('name')}
                                placeholder="Carlos"
                                style={inputStyle('name')}
                            />
                            {errors.name && (
                                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#ef4444' }}>
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div>
                            <label style={LABEL_STYLE}>
                                Apellido <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={form.lastName}
                                onChange={set('lastName')}
                                placeholder="Gómez"
                                style={inputStyle('lastName')}
                            />
                            {errors.lastName && (
                                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#ef4444' }}>
                                    {errors.lastName}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Nick y Teléfono */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '16px',
                            marginBottom: '16px',
                        }}
                    >
                        <div>
                            <label style={LABEL_STYLE}>
                                Nick / Usuario <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={form.nick}
                                onChange={set('nick')}
                                placeholder="cgomez"
                                style={inputStyle('nick')}
                            />
                            {errors.nick && (
                                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#ef4444' }}>
                                    {errors.nick}
                                </p>
                            )}
                        </div>
                        <div>
                            <label style={LABEL_STYLE}>
                                Teléfono <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={set('phone')}
                                placeholder="3001234567"
                                style={inputStyle('phone')}
                            />
                            {errors.phone && (
                                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#ef4444' }}>
                                    {errors.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={LABEL_STYLE}>
                            Correo electrónico <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={set('email')}
                            placeholder="carlos@empresa.com"
                            style={inputStyle('email')}
                        />
                        {errors.email && (
                            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#ef4444' }}>
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Rango y Edad */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '16px',
                            marginBottom: '28px',
                        }}
                    >
                        <div>
                            <label style={LABEL_STYLE}>
                                Rango <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <select
                                value={form.rango}
                                onChange={set('rango')}
                                style={{
                                    ...INPUT_STYLE,
                                    appearance: 'none',
                                    backgroundImage:
                                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 14px center',
                                    paddingRight: '38px',
                                    cursor: 'pointer',
                                }}
                            >
                                <option value="asesor">Asesor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label style={LABEL_STYLE}>
                                Edad <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="number"
                                value={form.edad}
                                onChange={set('edad')}
                                placeholder="25"
                                min="1"
                                max="100"
                                style={inputStyle('edad')}
                            />
                            {errors.edad && (
                                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#ef4444' }}>
                                    {errors.edad}
                                </p>
                            )}
                        </div>
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
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
