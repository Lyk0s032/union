import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { IoClose } from 'react-icons/io5';
import * as actions from '../../../store/action/action';
import SelectItems from '../../produccion/modal/selectItems';

export default function CotizacionSimulaciones() {
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const kits = useSelector(store => store.kits);
    const { kit, loadingKit } = kits;
    
    const [cotizacion, setCotizacion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [municipio, setMunicipio] = useState(null);
    const [editMode, setEditMode] = useState(false);
    
    const cotizacionId = params.get('simulationsCotizacion');
    const isOpen = !!cotizacionId;

    useEffect(() => {
        if (cotizacionId) {
            cargarCotizacion();
        }
    }, [cotizacionId]);

    const cargarCotizacion = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/cotizacion/get/${cotizacionId}`);
            setCotizacion(response.data);
            
            if (response.data.client?.ciudad) {
                obtenerMunicipio(response.data.client.ciudad);
            }
        } catch (error) {
            console.error('Error al cargar cotización:', error);
        } finally {
            setLoading(false);
        }
    };

    const obtenerMunicipio = async (codigoConPunto) => {
        try {
            const codigoLimpio = String(codigoConPunto).replace('.', '');
            const url = `https://www.datos.gov.co/resource/xdk5-pm3f.json?c_digo_dane_del_municipio=${codigoLimpio}`;
            const respuesta = await axios.get(url);
            
            if (respuesta.data.length > 0) {
                setMunicipio(respuesta.data[0]);
            } else {
                setMunicipio({ municipio: "No encontrado" });
            }
        } catch (error) {
            console.error("Error consultando municipio:", error);
            setMunicipio({ municipio: "Error" });
        }
    };

    const cerrar = () => {
        params.delete('simulationsCotizacion');
        setParams(params);
        setCotizacion(null);
        setMunicipio(null);
    };

    const handleOpenKit = (kitId) => {
        if (kitId) {
            dispatch(actions.axiosToGetKit(true, kitId));
            setEditMode(true);
        }
    };

    const closeEditKit = () => {
        setEditMode(false);
        dispatch(actions.getKit(null));
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div 
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 999,
                    transition: 'opacity 0.3s ease',
                }}
                onClick={cerrar}
            />
            
            {/* Drawer */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '40%',
                    height: '100vh',
                    backgroundColor: '#fff',
                    zIndex: 1000,
                    boxShadow: '4px 0 12px rgba(0, 0, 0, 0.15)',
                    animation: 'slideInLeft 0.3s ease-out',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: '20px 24px',
                        borderBottom: '1px solid #e5e7eb',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#f9fafb',
                    }}
                >
                    <div>
                        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#111827' }}>
                            Cotización con Simulaciones
                        </h2>
                        {cotizacion && (
                            <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#6b7280' }}>
                                MDC-CV-{Number(21719) + Number(cotizacion.id)}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={cerrar}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '6px',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        <IoClose size={24} color="#6b7280" />
                    </button>
                </div>

                {/* Content */}
                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '24px',
                    }}
                >
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <p style={{ color: '#6b7280' }}>Cargando cotización...</p>
                        </div>
                    ) : !cotizacion ? (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <p style={{ color: '#ef4444' }}>No se pudo cargar la cotización</p>
                        </div>
                    ) : (
                        <div>
                            {/* Información del Cliente */}
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
                                    Información del Cliente
                                </h3>
                                <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                                    <InfoItem label="Cliente" value={cotizacion.client?.nombre?.toUpperCase()} />
                                    <InfoItem label="NIT" value={cotizacion.client?.nit} />
                                    <InfoItem label="Teléfono" value={cotizacion.client?.fijos?.join(', ')} />
                                </div>
                            </div>

                            {/* Información de la Cotización */}
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
                                    Detalles de la Cotización
                                </h3>
                                <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                                    <InfoItem label="Nombre" value={cotizacion.name} />
                                    <InfoItem label="Fecha" value={cotizacion.time?.split('T')[0]} />
                                    <InfoItem label="Asesor" value={`${cotizacion.user?.name} ${cotizacion.user?.lastName}`} />
                                    <InfoItem label="Validez" value={`${cotizacion.validez} días`} />
                                </div>
                            </div>

                            {/* Items por Área */}
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
                                    Items de la Cotización
                                </h3>
                                
                                {cotizacion.areaCotizacions?.length > 0 ? (
                                    cotizacion.areaCotizacions.map((area, areaIndex) => (
                                        <div key={areaIndex} style={{ marginBottom: '20px' }}>
                                            <h4 style={{ 
                                                fontSize: '14px', 
                                                fontWeight: '600', 
                                                color: '#374151',
                                                marginBottom: '12px',
                                                padding: '8px 12px',
                                                backgroundColor: '#e5e7eb',
                                                borderRadius: '6px'
                                            }}>
                                                {area.name?.toUpperCase()}
                                            </h4>
                                            
                                            <div style={{ overflowX: 'auto' }}>
                                                <table style={{ 
                                                    width: '100%', 
                                                    borderCollapse: 'collapse',
                                                    fontSize: '13px'
                                                }}>
                                                    <thead>
                                                        <tr style={{ backgroundColor: '#f9fafb' }}>
                                                            <th style={tableHeaderStyle}>Ref</th>
                                                            <th style={{ ...tableHeaderStyle, textAlign: 'left' }}>Descripción</th>
                                                            <th style={tableHeaderStyle}>Cant.</th>
                                                            <th style={tableHeaderStyle}>V. Unit.</th>
                                                            <th style={tableHeaderStyle}>Subtotal</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {[
                                                            ...(area.productoCotizacions || []),
                                                            ...(area.serviciosCotizados || []),
                                                            ...(area.kits || []),
                                                            ...(area.armados || [])
                                                        ].map((item, itemIndex) => {
                                                            const isSimulacion = item.state === 'simulacion';
                                                            const isKit = item.kitCotizacion || item.armadoCotizacion;
                                                            const rowStyle = isSimulacion ? { color: '#dc2626', fontWeight: '600' } : {};
                                                            const clickableStyle = isKit ? { cursor: 'pointer' } : {};
                                                            const hoverStyle = isKit ? ':hover { backgroundColor: "#f9fafb" }' : '';
                                                            
                                                            return (
                                                                <tr 
                                                                    key={itemIndex} 
                                                                    style={{ 
                                                                        borderBottom: '1px solid #e5e7eb',
                                                                        ...clickableStyle,
                                                                        transition: 'background-color 0.2s'
                                                                    }}
                                                                    onClick={() => {
                                                                        if (isKit && item.id) {
                                                                            handleOpenKit(item.id);
                                                                        }
                                                                    }}
                                                                    onMouseEnter={(e) => {
                                                                        if (isKit) {
                                                                            e.currentTarget.style.backgroundColor = '#f9fafb';
                                                                        }
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        if (isKit) {
                                                                            e.currentTarget.style.backgroundColor = 'transparent';
                                                                        }
                                                                    }}
                                                                >
                                                                    <td style={{ ...tableCellStyle, ...rowStyle }}>
                                                                        {item.kitCotizacion ? item.id :
                                                                         item.cantidad && item.service ? `SV${item.service.id}` :
                                                                         item.cantidad && item.producto ? `PT${item.producto.id}` :
                                                                         `SP${item.id}`}
                                                                    </td>
                                                                    <td style={{ ...tableCellStyle, textAlign: 'left', ...rowStyle }}>
                                                                        {item.cantidad && item.producto ? 
                                                                            `${item.producto.item.toUpperCase()} ${item.medida ? `| ${item.medida}` : ''}` :
                                                                         item.cantidad && item.service ?
                                                                            `${item.service.name.toUpperCase()} - ${item.service.description.toUpperCase()}` :
                                                                         item.armadoCotizacion ?
                                                                            item.name.toUpperCase() :
                                                                            `${item.name.toUpperCase()} ${item.extension?.name ? `- ${item.extension.name.toUpperCase()}` : ''}`}
                                                                        {isSimulacion && (
                                                                            <span style={{ 
                                                                                marginLeft: '8px', 
                                                                                padding: '2px 6px', 
                                                                                backgroundColor: '#fee2e2',
                                                                                color: '#dc2626',
                                                                                borderRadius: '4px',
                                                                                fontSize: '11px',
                                                                                fontWeight: '700'
                                                                            }}>
                                                                                SIMULACIÓN
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                    <td style={{ ...tableCellStyle, ...rowStyle }}>
                                                                        {item.kitCotizacion ? item.kitCotizacion.cantidad :
                                                                         item.cantidad ? item.cantidad :
                                                                         item.armadoCotizacion?.cantidad}
                                                                    </td>
                                                                    <td style={{ ...tableCellStyle, ...rowStyle }}>
                                                                        {new Intl.NumberFormat('es-CO', { currency: 'COP' }).format(
                                                                            item.kitCotizacion ? (item.kitCotizacion.precio / item.kitCotizacion.cantidad) :
                                                                            item.cantidad ? (item.precio / item.cantidad) :
                                                                            (item.armadoCotizacion?.precio / item.armadoCotizacion?.cantidad)
                                                                        )}
                                                                    </td>
                                                                    <td style={{ ...tableCellStyle, ...rowStyle }}>
                                                                        {new Intl.NumberFormat('es-CO', { currency: 'COP' }).format(
                                                                            item.kitCotizacion ? item.kitCotizacion.precio :
                                                                            item.cantidad ? item.precio :
                                                                            item.armadoCotizacion?.precio
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>
                                        No hay items en esta cotización
                                    </p>
                                )}
                            </div>

                            {/* Advertencia */}
                            <div style={{
                                padding: '16px',
                                backgroundColor: '#fef3c7',
                                border: '1px solid #fbbf24',
                                borderRadius: '8px',
                                marginTop: '24px'
                            }}>
                                <p style={{ 
                                    margin: 0, 
                                    fontSize: '14px', 
                                    color: '#92400e',
                                    fontWeight: '600'
                                }}>
                                    ⚠️ Esta cotización contiene items marcados como simulación. 
                                    Deben convertirse en items definitivos antes de aprobar.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>
                {`
                    @keyframes slideInLeft {
                        from {
                            transform: translateX(-100%);
                        }
                        to {
                            transform: translateX(0);
                        }
                    }
                    
                    @keyframes pulse {
                        0%, 100% {
                            transform: scale(1);
                            opacity: 1;
                        }
                        50% {
                            transform: scale(1.02);
                            opacity: 0.95;
                        }
                    }
                `}
            </style>

            {/* Modal para editar/ver kit */}
            {editMode && kit && kit !== 'notrequest' && kit !== 404 && (
                <div className="modal" style={{ zIndex: 1100 }}>
                    <div className="containerModal Complete">
                        <div className="topBigModal" style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            gap: '12px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                <h3 style={{ margin: 0 }}>Ver Kit - {kit.name}</h3>
                                {kit.state === 'simulacion' && (
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '6px 12px',
                                        backgroundColor: '#fef3c7',
                                        border: '2px solid #fbbf24',
                                        borderRadius: '20px',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        color: '#92400e',
                                        boxShadow: '0 2px 4px rgba(251, 191, 36, 0.2)',
                                        animation: 'pulse 2s infinite'
                                    }}>
                                        <span style={{ fontSize: '16px' }}>⚠️</span>
                                        <span>SIMULACIÓN</span>
                                    </div>
                                )}
                            </div>
                            <button onClick={closeEditKit}>X</button>
                        </div>
                        <div className="bodyModalBig">
                            <div className="page">
                                {loadingKit ? (
                                    <div className="loading">
                                        <div className="spinner"></div>
                                        <p>Cargando kit...</p>
                                    </div>
                                ) : (
                                    <SelectItems kit={kit} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// Componente auxiliar para mostrar información
function InfoItem({ label, value }) {
    if (!value) return null;
    
    return (
        <div style={{ marginBottom: '8px' }}>
            <span style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                color: '#6b7280',
                display: 'inline-block',
                minWidth: '120px'
            }}>
                {label}:
            </span>
            <span style={{ fontSize: '13px', color: '#111827', marginLeft: '8px' }}>
                {value}
            </span>
        </div>
    );
}

// Estilos para la tabla
const tableHeaderStyle = {
    padding: '8px',
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151',
    borderBottom: '2px solid #e5e7eb'
};

const tableCellStyle = {
    padding: '8px',
    textAlign: 'center',
    fontSize: '13px',
    color: '#111827'
};
