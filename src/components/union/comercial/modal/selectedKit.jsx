import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as actions from '../../../store/action/action';
import axios from 'axios';

export default function SelectedKit({ kt, cotizacion, area }){
    const [active, setActive] = useState(false);
    const [descuento, setDescuento] = useState(kt.kitCotizacion.descuento ? kt.kitCotizacion.descuento : 0);
    const dispatch = useDispatch();


    const giveDescuento = async () => {
        if(!descuento) return dispatch(actions.HandleAlerta('Debes dar un descuento', 'mistake'))
        if(descuento == kt.kitCotizacion.descuento) return dispatch(actions.HandleAlerta('Debes dar un descuento diferente', 'mistake'))
            // Caso contrario, avanzamos
        let body = {
            kitCotizacionId: kt.kitCotizacion.id,
            descuento
        } 
        const sendPeticion = await axios.put('/api/cotizacion/kit/descuento', body)
        .then((res) => { 
            dispatch(actions.HandleAlerta('Descuento asignado', 'positive'));
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            dispatch(actions.axiosToGetCotizaciones(false))
            setActive(null)
        }).catch(err => {
            console.log(err) 
            dispatch(actions.HandleAlerta('No hemos podido dar este descuento', 'mistake'));
        })
        return sendPeticion;
    }

    const deleteItem = async (itemId) => {
        const body = {
            kitId: itemId,
            cotizacionId: area.id
        }

        const sendPetion = await axios.delete('api/cotizacion/remove/item', { data: body} )
        .then((res) => {
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            dispatch(actions.HandleAlerta('Kit removido', 'positive'))
 
        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta('No hemos logrado remover este kit', 'mistake'))
        })
        return sendPetion; 
    }

    
    return (
        <tr >
            <td>
                <div>
                    <span>{kt.name}</span>
                </div>
            </td>
            <td>{kt.kitCotizacion.cantidad }</td>
            {
                active ?
                    <td> 
                        <input type="text" onKeyDown={(e) => {
                            if(e.key === 'Escape') setActive(false)
                            if(e.key === 'Enter')  giveDescuento();
                        }} onChange={(e) => { 
                            setDescuento(e.target.value)
                        }} value={descuento} />
                    </td>
                :
                    <td onDoubleClick={() => setActive(true)}>{kt.kitCotizacion.descuento ? new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(kt.kitCotizacion.descuento).toFixed(0)) : 0 } COP</td>
            }
            <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(kt.kitCotizacion.precio).toFixed(0))} COP</td>
            <td>

            </td>
            <td>
                {/* <strong>{<ValorSelected mt={materia} />}</strong> */}
            </td> 
            <td>
                <button onClick={() => {
                    if(kt.kitCotizacion){
                        deleteItem(kt.id)
                    }
                } }>
                    x
                </button>
            </td>
        </tr>
    )
}