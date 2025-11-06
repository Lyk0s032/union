import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../store/action/action';
import { MdDeleteOutline, MdOutlineContentCopy } from 'react-icons/md';

export default function ItemProductoTerminado(props){
    const MP = props.pv;
    const [params, setParams] = useSearchParams()
    const [loading, setLoading] = useState(false);
    const [remove, setRemove] = useState(null);
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;

    const promedio = MP.productPrices && MP.productPrices.length ? MP.productPrices.reduce((acc, p) => Number(acc) + Number(p.valor), 0) : null
    
    const dispatch = useDispatch();
    // Eliminar PRODUCTO
    const handleDeleteProducto = async () => {
        try {
            let body = {
                productoId: MP.id,
                userId: user.user.id
            }
            setLoading(true); // Activa loading
            const send = await axios.delete(`/api/materia/producto/remove`, {data: body})
            .then((res) => {
                setRemove(false)
                dispatch(actions.HandleAlerta('Eliminado con éxito', 'positive'))
                dispatch(actions.axiosToGetProductos(false))
                return res
            })
            return send
        } catch (error) {
            dispatch(actions.HandleAlerta('No hemos logrado eliminar este producto', 'mistake'))
            return error;
        } finally {
            setLoading(false); // Finaliza loading, pase lo que pase
        }
        
    };
    // CLONAR PRODUCTO

    const handleCloneProducto = async () => {
        try { 
          setLoading(true); // Inicia el loading
          const response = await axios.get(`/api/materia/producto/clonar/${MP.id}/${user.user.id}`)
          .then(res => {
            dispatch(actions.HandleAlerta('Clonado con éxito', 'positive'))
            dispatch(actions.axiosToGetProductos(false));
            return res;
          })
          return response
        } catch (error) {
            dispatch(actions.HandleAlerta('No hemos logrado clonar este producto', 'mistake'))
            console.error("Error al duplicar el kit:", error);
        } finally {
          setLoading(false); // Finaliza el loading
        }
    };
    return (
        <tr > 
            <td onClick={() => {
                params.set('producto', MP.id) 
                setParams(params);
            }} className='coding'>
                <div className="code">
                    <h3>{MP.id}</h3>
                </div>
            </td>
            <td className="longer" onClick={() => {
                params.set('producto', MP.id) 
                setParams(params);
            }} >
                <div className="titleNameKitAndData">
                    <div className="extensionColor">
                        <div className="boxColor"></div>
                        <span>{MP.categorium ? MP.categorium.name.toUpperCase() : null}</span>
                        <span style={{marginLeft:10}}>| {MP.linea?.name}</span>

                    </div>
                    <div className="nameData">
                        <h3>{MP.item}</h3>
                        <span>{MP.description}</span>
                    </div>
                </div>
            </td>
            <td></td>
            <td></td>
            <td className="tdPrice" onClick={() => {
                params.set('producto', MP.id) 
                setParams(params);
            }}>
                <div className="similarPrice">
                    <h3>
                        {promedio ? new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(promedio/MP.productPrices.length).toFixed(0)) : 'No hay precios aun'}
                    </h3>
                </div>
            </td> 
            
            <td className="btnKits">
                {
                    loading ?
                    <div className="basic">
                        <span>Cargando...</span>
                    </div> 
                    :
                    remove ?
                        <div className="basic">
                            <button className="edit" onClick={() => setRemove(null)}>
                                <span>No</span>
                            </button>
                            <button id={MP.id} className="rem" onClick={() => handleDeleteProducto()}>
                                <span>Si</span>
                            </button>
                        </div>
                    :
                    <div className="basic">
                        <button className="edit" onClick={() => handleCloneProducto()}>
                            <MdOutlineContentCopy className="icon" />
                        </button>
                        <button id={MP.id} className="rem" onClick={() => {
                            setRemove(true)
                        }}>
                            <MdDeleteOutline className="icon" />
                        </button>
                    </div>
                }

            </td>
            {/* <td>
                <button onClick={() => {
                    params.set('w', 'updateProvider');
                    setParams(params);
                }}>
                    <span>Editar</span>
                </button>
            </td> */}
        </tr>
    )
}