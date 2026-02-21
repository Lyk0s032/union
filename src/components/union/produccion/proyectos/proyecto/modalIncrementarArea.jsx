import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import * as actions from '../../../../store/action/action';

export default function ModalIncrementarArea({ areaData, onClose, requisicionId }) {
    const dispatch = useDispatch();
    const [cantidadProcesada, setCantidadProcesada] = useState('');
    const [notas, setNotas] = useState('');
    const [loading, setLoading] = useState(false);

    const areaName = areaData.areaProductionId === 2 ? 'Corte' : 'Tubería';
    const cantidadTotal = Number(areaData.cantidad);
    const cantidadYaProcesada = Number(areaData.cantidadProcesada);
    const cantidadFaltante = cantidadTotal - cantidadYaProcesada;

    console.log('AREA DATA, ', areaData);
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!cantidadProcesada || parseFloat(cantidadProcesada) <= 0) {
            dispatch(actions.HandleAlerta('Debes ingresar una cantidad válida', 'mistake'));
            return;
        }

        if (parseFloat(cantidadProcesada) > cantidadFaltante) {
            dispatch(actions.HandleAlerta(`No puedes procesar más de ${cantidadFaltante.toFixed(2)} unidades`, 'mistake'));
            return;
        }

        setLoading(true);

        try {
            const payload = {
                cantidadProcesada: parseFloat(cantidadProcesada),
                notas: notas.trim() || undefined
            };

            console.log(`[INCREMENTAR_${areaName.toUpperCase()}] Payload:`, payload);

            const response = await axios.put(
                `/api/production/put/item-area/${areaData.id}/incrementar`,
                payload
            );

            console.log(`[INCREMENTAR_${areaName.toUpperCase()}] Respuesta:`, response.data);

            // Recargar silenciosamente el proyecto
            dispatch(actions.axiosToGetItemProduction(false, requisicionId));
            dispatch(actions.HandleAlerta(`Cantidad procesada en ${areaName} registrada exitosamente`, 'positive'));

            onClose();

        } catch (error) {
            console.error(`[INCREMENTAR_${areaName.toUpperCase()}] Error:`, error);
            dispatch(actions.HandleAlerta(
                error?.response?.data?.message || `Error al registrar cantidad en ${areaName}`,
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
                maxWidth: '500px', 
                padding: '30px',
                borderRadius: '12px',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <div style={{ marginBottom: '20px' }}>
                    <h2 style={{ marginBottom: '10px', fontSize: '24px' }}>
                        Registrar proceso en {areaName}
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

                <div style={{ 
                    background: '#f8f9fa', 
                    padding: '20px', 
                    borderRadius: '8px',
                    marginBottom: '20px'
                }}>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>Cantidad total comprometida</span>
                        <h3 style={{ fontSize: '20px', margin: '5px 0', color: '#2f8bfd' }}>
                            {cantidadTotal.toFixed(2)}
                        </h3>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>Cantidad ya procesada</span>
                        <h3 style={{ fontSize: '20px', margin: '5px 0', color: '#2ecc71' }}>
                            {cantidadYaProcesada.toFixed(2)}
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
                            Cantidad a procesar *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            max={cantidadFaltante}
                            value={cantidadProcesada}
                            onChange={(e) => setCantidadProcesada(e.target.value)}
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
                            placeholder="Ej: Lote matutino procesado"
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
                                background: '#2f8bfd',
                                color: '#fff',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.6 : 1
                            }}
                        >
                            {loading ? 'Registrando...' : 'Registrar proceso'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
