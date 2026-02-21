import React, { useState } from 'react';
import * as actions from '../../../../store/action/action';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ModalIncrementarArea from './modalIncrementarArea';
import ModalIngresarListo from './modalIngresarListo';

export default function ItemProjectNecesidad({ item }){

    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const [loadingToAlmacen, setLoadingToAlmacen] = useState(false);
    const [loadingToAlmacenProject, setLoadingToAlmacenProject] = useState(false);
    const [loadingCorte, setLoadingCorte] = useState(false);
    const [loadingTuberia, setLoadingTuberia] = useState(false);
    const [modalAreaData, setModalAreaData] = useState(null);
    const [mostrarModalListo, setMostrarModalListo] = useState(false);

    const porcentaje = Number(Number(item.cantidadEntregada).toFixed(0) / Number(item.cantidadComprometida).toFixed(0)) * 100;
    console.log('ITEMS PARA OBTENER EL PROYECTO ID, ', item);

    const handleAbrirModalArea = (areaData) => {
        setModalAreaData(areaData);
    };

    const handleCerrarModal = () => {
        setModalAreaData(null);
    };

    const handleAbrirModalListo = () => {
        setMostrarModalListo(true);
    };

    const handleCerrarModalListo = () => {
        setMostrarModalListo(false);
    };

    const handleHabilitarArea = async (areaId) => {
        const isCorte = areaId === 2;
        const setLoading = isCorte ? setLoadingCorte : setLoadingTuberia;
        
        if ((isCorte && loadingCorte) || (!isCorte && loadingTuberia)) return;

        setLoading(true);

        try {
            const payload = {
                requisicionId: item.requisicionId,
                areaProductionId: areaId, // 2=Corte, 3=Tubería
                cantidad: parseFloat(item.cantidadComprometida),
                necesidadProyectoId: item.id
            };

            // Determinar si es kit o producto
            if (item.kitId) {
                payload.kitId = item.kitId;
            } else if (item.productoId) {
                payload.productoId = item.productoId;
            }

            // Incluir medida si existe
            if (item.medida) {
                payload.medida = item.medida;
            }

            console.log(`[HABILITAR_${isCorte ? 'CORTE' : 'TUBERIA'}] Payload:`, payload);

            const response = await axios.post('/api/production/post/item-area', payload);

            console.log(`[HABILITAR_${isCorte ? 'CORTE' : 'TUBERIA'}] Respuesta:`, response.data);

            // Recargar silenciosamente el item de producción
            dispatch(actions.axiosToGetItemProduction(false, item.requisicionId));
            dispatch(actions.HandleAlerta(`Habilitado en ${isCorte ? 'Corte' : 'Tubería'} exitosamente`, 'positive'));

        } catch (error) {
            console.error(`[HABILITAR_${isCorte ? 'CORTE' : 'TUBERIA'}] Error:`, error);
            dispatch(actions.HandleAlerta(`Error al habilitar en ${isCorte ? 'Corte' : 'Tubería'}`, 'mistake'));
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
        <tr> {console.log('item en producción, ', item)}
            <td className="longer"> 
                <div className="nameLonger">
                    <div className="letter">
                        <h3 style={{fontSize: '10px'}}>{item.kit ? item.kit.id : null} {item?.productoId}</h3>
                    </div> 
                    <div className="name">
                        {console.log('item en producción, ', item)}
                        <h3 style={{fontSize: '12px'}}>{item?.kit?.name} {item.kit ? ` - ${item.kit.extension?.name}` : null} {item?.producto?.item} {item?.medida ? ` - ${item.medida} ${item?.producto?.unidad}` : null}</h3>
                        <span>{item.kit ? 'KIT' : 'Producto terminado' }</span> <br /> 
                    </div> 
                </div>
            </td>
            <td>
                <div 
                    className=""
                    onClick={handleAbrirModalListo}
                    style={{ cursor: 'pointer' }}
                > 
                    <span style={{ 
                        color: '#2ecc71', 
                        textDecoration: 'underline',
                        fontWeight: '500'
                    }}>
                        {Number(item.cantidadEntregada).toFixed(0)} / {Number(item.cantidadComprometida).toFixed(0)}
                    </span>
                </div>
            </td> 
            <td>
                <div>
                    <span>{Number(porcentaje).toFixed(0)}%</span>
                </div>
            </td>
            <td>
                <div>
                    {
                        item.itemAreaProductions.length > 0 && item.itemAreaProductions.some(area => area.areaProductionId === 2) ? (
                            <div 
                                onClick={() => handleAbrirModalArea(item.itemAreaProductions.find(area => area.areaProductionId === 2))}
                                style={{ cursor: 'pointer' }}
                            >
                                <span style={{ 
                                    color: '#2f8bfd', 
                                    textDecoration: 'underline',
                                    fontWeight: '500'
                                }}>
                                    {Number(item.itemAreaProductions.find(area => area.areaProductionId === 2).cantidadProcesada).toFixed(0)} / {Number(item.itemAreaProductions.find(area => area.areaProductionId === 2).cantidad).toFixed(0)}
                                </span>
                            </div>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleHabilitarArea(2);
                                }}
                                disabled={loadingCorte}
                                style={{
                                    opacity: loadingCorte ? 0.6 : 1,
                                    cursor: loadingCorte ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <span>{loadingCorte ? 'Habilitando...' : 'Habilitar'}</span>
                            </button>
                        )
                    }
                    
                </div>
            </td>
            <td>
            <div>
                    {
                        item.itemAreaProductions.length > 0 && item.itemAreaProductions.some(area => area.areaProductionId === 3) ? (
                            <div
                                onClick={() => handleAbrirModalArea(item.itemAreaProductions.find(area => area.areaProductionId === 3))}
                                style={{ cursor: 'pointer' }}
                            >
                                <span style={{ 
                                    color: '#2f8bfd', 
                                    textDecoration: 'underline',
                                    fontWeight: '500'
                                }}>
                                    {Number(item.itemAreaProductions.find(area => area.areaProductionId === 3).cantidadProcesada).toFixed(0)} / {Number(item.itemAreaProductions.find(area => area.areaProductionId === 3).cantidad).toFixed(0)}
                                </span>
                            </div>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleHabilitarArea(3);
                                }}
                                disabled={loadingTuberia}
                                style={{
                                    opacity: loadingTuberia ? 0.6 : 1,
                                    cursor: loadingTuberia ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <span>{loadingTuberia ? 'Habilitando...' : 'Habilitar'}</span>
                            </button>
                        )
                    }
                    
                </div>
                
            </td>
        </tr>

        {modalAreaData && (
            <ModalIncrementarArea
                areaData={modalAreaData}
                onClose={handleCerrarModal}
                requisicionId={item.requisicionId}
            />
        )}

        {mostrarModalListo && (
            <ModalIngresarListo
                item={item}
                onClose={handleCerrarModalListo}
                requisicionId={item.requisicionId}
            />
        )}
        </>
    )
}