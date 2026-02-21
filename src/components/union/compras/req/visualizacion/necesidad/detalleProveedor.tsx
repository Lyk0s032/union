import React, { useState } from 'react';

interface ProveedorDetalle {
    id: number;
    nombre: string;
    inicial: string;
    nit: string;
    telefono: string;
    email: string;
    precioActual: number;
    fechaPrecio: string;
    totalCotizaciones: number;
    ordenesCompra: number;
    tiempoEntrega: string;
}

interface DetalleProveedorProps {
    proveedor: ProveedorDetalle | null;
    onClose: () => void;
}

// ============================================
// 🔄 AQUÍ DEBES REEMPLAZAR CON DATOS DE LA API
// ============================================
// Ejemplo: const proveedorData = await axios.get(`/api/proveedores/${proveedorId}`);

export default function DetalleProveedor({ proveedor, onClose }: DetalleProveedorProps) {
    const [valor, setValor] = useState('');

    if (!proveedor) return null;

    // Formatear fecha
    const formatearFecha = (fecha: string) => {
        const date = new Date(fecha);
        const opciones: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        return date.toLocaleDateString('es-CO', opciones);
    };

    return (
        <div className={`detalleProveedorPanel ${proveedor ? 'abierto' : ''}`}>
            <div className="detalleProveedorContent">
                {/* Header con botón cerrar */}
                <div className="detalleProveedorHeader">
                    <button className="btnCerrar" onClick={onClose} aria-label="Cerrar">
                        <span>×</span>
                    </button>
                </div>

                {/* Información del proveedor */}
                <div className="proveedorInfoHeader">
                    <div className="proveedorAvatar">
                        <span>{proveedor.inicial}</span>
                    </div>
                    <h2 className="proveedorNombre">{proveedor.nombre}</h2>
                </div>

                {/* Datos de contacto */}
                <div className="proveedorContacto">
                    <div className="contactoItem">
                        <span className="label">NIT:</span>
                        <span className="valor">{proveedor.nit}</span>
                    </div>
                    <div className="contactoItem">
                        <span className="label">Teléfono:</span>
                        <span className="valor">{proveedor.telefono}</span>
                    </div>
                    <div className="contactoItem">
                        <span className="label">Email:</span>
                        <span className="valor">{proveedor.email}</span>
                    </div>
                </div>

                {/* Sección de Precio y Valor */}
                <div className="seccionPrecioValor">
                    <div className="precioActual">
                        <span className="label">Precio actual</span>
                        <h3 className="precio">$ {new Intl.NumberFormat('es-CO').format(proveedor.precioActual)}</h3>
                        <span className="fecha">{formatearFecha(proveedor.fechaPrecio)}</span>
                    </div>
                    <div className="valorInput">
                        <span className="label">Valor</span>
                        <input
                            type="text"
                            placeholder="Ej. 250000"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            className="inputValor"
                        />
                    </div>
                </div>

                {/* Análisis rápido */}
                <div className="seccionAnalisis">
                    <h3>Análisis rápido</h3>
                    <div className="indicadoresAnalisis">
                        <div className="indicador">
                            <div className="indicadorCirculo">
                                <span>{proveedor.totalCotizaciones}</span>
                            </div>
                            <span className="indicadorLabel">Total cotizaciones</span>
                        </div>
                        <div className="indicador">
                            <div className="indicadorCirculo">
                                <span>{proveedor.ordenesCompra}</span>
                            </div>
                            <span className="indicadorLabel">Ordenes de compra</span>
                        </div>
                        <div className="indicador">
                            <div className="indicadorCirculo">
                                <span>{proveedor.tiempoEntrega}</span>
                            </div>
                            <span className="indicadorLabel">Tiempo de entrega Aprox.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
