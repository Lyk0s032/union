import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as actions from '../../../store/action/action';
import axios from 'axios';

export default function SelectedProducto({ kt, cotizacion, area }){
    const [active, setActive] = useState(false);
    const [descuento, setDescuento] = useState(kt.productoCotizacion.descuento ? kt.productoCotizacion.descuento : 0);
    const dispatch = useDispatch();

    const giveDescuento = async () => {
        if(!descuento) return dispatch(actions.HandleAlerta('Debes dar un descuento', 'mistake'))
        if(descuento == kt.armadoCotizacion.descuento) return dispatch(actions.HandleAlerta('Debes dar un descuento diferente', 'mistake'))
            // Caso contrario, avanzamos
        let body = {
            superKitId: kt.armadoCotizacion.id,
            descuento
        }
        const sendPeticion = await axios.put('/api/cotizacion/superkit/descuento', body)
        .then((res) => {
            dispatch(actions.HandleAlerta('Descuento asignado', 'positive'));
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            dispatch(actions.axiosToGetCotizaciones(false))
            setActive(null)
            return res
        }).catch(err => {
            dispatch(actions.HandleAlerta('No hemos podido dar este descuento', 'mistake'));
            return err
        })
        return sendPeticion;
    }

    const deleteSuperKitItem = async (itemId) => {
        const body = {
            superKidId: itemId, 
            cotizacionId: area.id
        }

        const sendPetion = await axios.delete('api/cotizacion/remove/superKit', { data: body} )
        .then((res) => {
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            dispatch(actions.HandleAlerta('Kit removido', 'positive'))
            return res
        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta('No hemos logrado remover este Superkit', 'mistake'))
        })
        return sendPetion; 
    }

    return ( 
        <tr>
            <td>
                <div>
                    <strong style={{fontSize:12}}>Producto</strong><br />
                    <span>{kt.item}</span>
                </div>
            </td>
            <td>{kt.productoCotizacion.cantidad}</td>
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
                <td onDoubleClick={() => setActive(true)}>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(kt.productoCotizacion.descuento).toFixed(0))} COP</td>
            }
            <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(kt.productoCotizacion.precio).toFixed(0))} COP</td>
            <td>

            </td>
            <td>
                {/* <strong>{<ValorSelected mt={materia} />}</strong> */}
            </td> 
            <td>
                <button onClick={() => {
                        deleteSuperKitItem(kt.id)
                }}>
                    x
                </button>
            </td>
        </tr>
    )
}