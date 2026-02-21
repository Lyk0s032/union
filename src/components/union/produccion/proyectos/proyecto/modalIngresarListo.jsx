import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import * as actions from '../../../../store/action/action';

export default function ModalIngresarListo({ item, onClose, requisicionId }) {
    const dispatch = useDispatch();
    const [cantidad, setCantidad] = useState('');
    const [notas, setNotas] = useState('');
    const [loading, setLoading] = useState(false);

    const cantidadComprometida = Number(item.cantidadComprometida);
    const cantidadEntregada = Number(item.cantidadEntregada);
    const cantidadFaltante = cantidadComprometida - cantidadEntregada;

    // Verificar si es producto terminado con mt2 y tiene medida
    const esProductoMt2 = item.productoId && item.producto?.unidad === 'mt2';
    const medidaItem = item.medida || null;

    console.log('ITEM PARA INGRESAR LISTO:', item);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!cantidad || parseFloat(cantidad) <= 0) {
            dispatch(actions.HandleAlerta('Debes ingresar una cantidad válida', 'mistake'));
            return;
        }

        if (parseFloat(cantidad) > cantidadFaltante) {
            dispatch(actions.HandleAlerta(`No puedes ingresar más de ${cantidadFaltante.toFixed(2)} unidades`, 'mistake'));
            return;
        }

        setLoading(true);

        try {
            const payload = {
                necesidadProyectoId: item.id,
                cantidad: parseFloat(cantidad),
                notas: notas.trim() || undefined
            };

            // Solo agregar medida si es producto mt2 y tiene medida
            if (esProductoMt2 && medidaItem) {
                payload.medida = medidaItem;
            }

            console.log('[INGRESAR_LISTO] Payload:', payload);

            const response = await axios.post('/api/remision/post/ingresar-listo', payload);

            console.log('[INGRESAR_LISTO] Respuesta:', response.data);

            // Recargar silenciosamente el proyecto
            dispatch(actions.axiosToGetItemProduction(false, requisicionId));
            dispatch(actions.HandleAlerta(
                `Cantidad ingresada exitosamente. ${response.data.remision?.numeroRemision ? `Remisión: ${response.data.remision.numeroRemision}` : ''}`,
                'positive'
            ));

            onClose();

        } catch (error) {
            console.error('[INGRESAR_LISTO] Error:', error);
            dispatch(actions.HandleAlerta(
                error?.response?.data?.msg || error?.response?.data?.message || 'Error al ingresar la cantidad',
                'mistake'
            ));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal" style={{ zIndex: 10 }}>
            <div className="hiddenModal" onClick={onClose}></div>
            <div className="containerModal" style={{ 
                maxWidth: '550px', 
                padding: '30px',
                borderRadius: '12px',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <div style={{ marginBottom: '20px' }}>
                    <h2 style={{ marginBottom: '10px', fontSize: '24px' }}>
                        Ingresar cantidad lista
                    </h2>
                    <button 
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            right: '20px',
                            top: '20px',
                            background: 'transparent',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#666'
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Información del item */}
                <div style={{ 
                    background: '#f0f7ff', 
                    padding: '15px', 
                    borderRadius: '8px',
                    marginBottom: '20px',
                    borderLeft: '4px solid #2f8bfd'
                }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                        {item.kit ? 'KIT' : 'Producto terminado'}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                        {item.kit?.name} 
                        {item.kit?.extension?.name ? ` - ${item.kit.extension.name}` : ''}
                        {item.producto?.item}
                        {item.medida ? ` - ${item.medida} ${item.producto?.unidad}` : ''}
                    </div>
                </div>

                {/* Resumen de cantidades */}
                <div style={{ 
                    background: '#f8f9fa', 
                    padding: '20px', 
                    borderRadius: '8px',
                    marginBottom: '20px'
                }}>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>Cantidad comprometida</span>
                        <h3 style={{ fontSize: '20px', margin: '5px 0', color: '#2f8bfd' }}>
                            {cantidadComprometida.toFixed(2)}
                        </h3>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>Cantidad ya entregada</span>
                        <h3 style={{ fontSize: '20px', margin: '5px 0', color: '#2ecc71' }}>
                            {cantidadEntregada.toFixed(2)}
                        </h3>
                    </div>

                    <div>
                        <span style={{ fontSize: '14px', color: '#666' }}>Cantidad faltante</span>
                        <h3 style={{ fontSize: '20px', margin: '5px 0', color: '#e74c3c' }}>
                            {cantidadFaltante.toFixed(2)}
                        </h3>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            Cantidad a ingresar *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            max={cantidadFaltante}
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                            placeholder="Ej: 10.50"
                            style={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '16px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                boxSizing: 'border-box'
                            }}
                            disabled={loading}
                            autoFocus
                        />
                        <span style={{ fontSize: '12px', color: '#666', marginTop: '5px', display: 'block' }}>
                            Máximo: {cantidadFaltante.toFixed(2)}
                        </span>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            Notas (opcional)
                        </label>
                        <textarea
                            value={notas}
                            onChange={(e) => setNotas(e.target.value)}
                            placeholder="Ej: Primera entrega"
                            rows="3"
                            style={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '14px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                boxSizing: 'border-box',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                            disabled={loading}
                        />
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        justifyContent: 'flex-end' 
                    }}>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            style={{
                                padding: '12px 24px',
                                fontSize: '14px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                background: '#fff',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.6 : 1
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '12px 24px',
                                fontSize: '14px',
                                border: 'none',
                                borderRadius: '6px',
                                background: '#2ecc71',
                                color: '#fff',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.6 : 1
                            }}
                        >
                            {loading ? 'Ingresando...' : 'Ingresar cantidad'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
