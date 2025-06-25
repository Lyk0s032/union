import React, { useState } from 'react';
import { MdDeleteOutline, MdOutlineContentCopy } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from './../../store/action/action';
import axios from 'axios';

export default function ItemMP(props){
    const MP = props.pv;
    const [params, setParams] = useSearchParams();
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const [loading, setLoading] = useState(false);
    const [remove, setRemove] = useState(null);   
    const dispatch = useDispatch(); 
    const promedio = MP.prices && MP.prices.length ? MP.prices.reduce((acc, p) => Number(acc) + Number(p.valor), 0) : null
    
    const handleCloneProducto = async () => {
        try { 
          setLoading(true); // Inicia el loading
          const body = {
            MPID: MP.id,
            userId: user.user.id
          }
          const response = await axios.post(`/api/materia/materia/clone`, body)
          .then(res => {
            dispatch(actions.HandleAlerta('Clonado con éxito', 'positive'))
            dispatch(actions.axiosToGetPrimas(false));
            return res;
          })
          return response
        } catch (error) {
            dispatch(actions.HandleAlerta('No hemos logrado clonar este item', 'mistake'))
            console.error("Error al duplicar el item:", error);
        } finally {
          setLoading(false); // Finaliza el loading
        }
    };

        // Eliminar PRODUCTO
    const handleDeleteProducto = async () => {
        try {
            let body = {
                materiaId: MP.id,
                userId: user.user.id
            }
            setLoading(true); // Activa loading
            const send = await axios.delete(`/api/materia/materia/remove`, {data: body})
            .then((res) => {
                setRemove(false)
                dispatch(actions.HandleAlerta('Eliminado con éxito', 'positive'))
                dispatch(actions.axiosToGetPrimas(false))
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
    return (
        <tr >
            <td onClick={() => {
                params.set('prima', MP.id) 
                setParams(params);
            }}>{MP.id}</td>
            <td >{MP.description.toUpperCase()}</td>
            <td>{MP.medida}</td>
            <td style={{fontSize:11}}>{MP.unidad.toUpperCase()}</td> 
            <td>{promedio ? new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(promedio/MP.prices.length).toFixed(0)) : 'No hay precios aun'}</td> 
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