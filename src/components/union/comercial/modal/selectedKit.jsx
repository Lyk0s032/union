import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/action/action';
import axios from 'axios';
import UpdatePrice from './updatePrice/UpdateKit';

export default function SelectedKit({ kt, cotizacion, area }){
    const [active, setActive] = useState(false);
    const [descuento, setDescuento] = useState(kt.kitCotizacion.descuento ? kt.kitCotizacion.descuento : 0);
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;

    const dispatch = useDispatch();
    const [porcentaje, setPorcentaje] = useState(0);
    const [pri, setPri] = useState(null);
    // Convertir descuento
    const porcentForDescuento = (porcentaje) => {
        let  precio = kt.kitCotizacion.precio;
        const descuentico = Number(porcentaje / 100) * Number(precio)
        return setDescuento(descuentico.toFixed(0))    
    }

    // Dar descuento
    const giveDescuento = async () => {
        if(Number(porcentaje) > 9 && user.user.area == 'asesor') return dispatch(actions.HandleAlerta('Este descuento es muy alto', 'mistake'));
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
    const deleteItem = async (itemId) => {
        const body = {
            kitId: itemId,
            cotizacionId: area.id
        }

        const sendPetion = await axios.delete('api/cotizacion/remove/item', { data: body} )
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

    // Close pri
    const closePri = () => {
        setPri(null)
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
                    <td onDoubleClick={() => setActive(true)}>{kt.kitCotizacion.descuento ? new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(kt.kitCotizacion.descuento).toFixed(0)) : 0 } COP</td>
            }
            <td onDoubleClick={() => setPri(true)}>
                {  
                    !pri ?
                        new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(kt.kitCotizacion.precio).toFixed(0))
                    :
                        <UpdatePrice cotizacion={cotizacion} close={closePri} valor={kt.kitCotizacion.precio} idKit={kt.kitCotizacion.id} tipo={'kit'} />
                } COP</td>
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