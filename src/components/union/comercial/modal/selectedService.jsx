import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/action/action';
import axios from 'axios';

export default function SelectedServices({ kt, cotizacion, area }){
    const [active, setActive] = useState(false);
    const [descuento, setDescuento] = useState(kt.descuento ? kt.descuento : 0);
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;

    const dispatch = useDispatch();
    const [porcentaje, setPorcentaje] = useState(0);

    // Convertir descuento
    const porcentForDescuento = (porcentaje) => {
        let  precio = kt.precio;
        const descuentico = Number(porcentaje / 100) * Number(precio)
        return setDescuento(descuentico.toFixed(0))    
    }

    // Dar descuento
    const giveDescuento = async () => {
        if(!descuento) return dispatch(actions.HandleAlerta('Debes dar un descuento', 'mistake'))
        if(descuento == kt.descuento) return dispatch(actions.HandleAlerta('Debes dar un descuento diferente', 'mistake'))
            // Caso contrario, avanzamos
        let body = {
            serviceCotizacionId: kt.id,
            descuento
        } 
        const sendPeticion = await axios.put('/api/cotizacion/service/descuento', body)
        .then((res) => { 
            dispatch(actions.HandleAlerta('Descuento asignado', 'positive'));
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            dispatch(actions.axiosToGetCotizaciones(false, user.user.id))
            setActive(null)
            return res;
        }).catch(err => {
            console.log(err) 
            dispatch(actions.HandleAlerta('No hemos podido dar este descuento', 'mistake'));
        })
        return sendPeticion;
    }
    // Eliminar item
    const deleteItem = async () => {
        const body = {
            serviceCotizacionId: kt.id
        }

        const sendPetion = await axios.delete('api/cotizacion/remove/service', { data: body} )
        .then((res) => {
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            dispatch(actions.HandleAlerta('Kit removido', 'positive'))
            return res;
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
                    <span><strong>Servicio</strong> | {kt.service.name}</span>
                </div>
            </td>
            <td>{kt.cantidad }</td>
            {
                active ?
                    <td> 
                        <label htmlFor="">{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(descuento)} COP</label><br />
                        <input type="text" inputMode="numeric"
                        pattern="[0-9]*" onKeyDown={(e) => {
                            if(e.key === 'Escape') setActive(false)
                            if(e.key === 'Enter')  giveDescuento();
                            }} onChange={(e) => { 
                                const text = e.target.value
                                if (/^\d*\.?\d*$/.test(text)) { // Solo números positivos sin decimales
                                    setPorcentaje(e.target.value)
                                    porcentForDescuento(e.target.value)
                                } 
                                
                            }}  value={porcentaje}/>
                    </td>
                :
                    <td onDoubleClick={() => setActive(true)}>{kt.descuento ? new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(kt.descuento).toFixed(0)) : 0 } COP</td>
            }
            <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(kt.precio).toFixed(0))} COP</td>
            <td>

            </td>
            <td>
                {/* <strong>{<ValorSelected mt={materia} />}</strong> */}
            </td> 
            <td>
                <button onClick={() => {
                    if(kt.id){
                        deleteItem()
                    }
                } }>
                    x
                </button>
            </td>
        </tr>
    )
}