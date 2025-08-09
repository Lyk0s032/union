import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/action/action';
import axios from 'axios';
import UpdatePrice from './updatePrice/UpdateKit';

export default function SelectedProducto({ kt, cotizacion, area }){
    const [active, setActive] = useState(false);
    const [descuento, setDescuento] = useState(kt.descuento ? kt.descuento : 0);
    const { user } = useSelector(store => store.usuario);
    const dispatch = useDispatch();
    const [porcentaje, setPorcentaje] = useState(0);
    const [pri, setPri] = useState(null)
    const porcentForDescuento = (porcentaje) => {
        let  precio = kt.precio;
        const descuentico = Number(porcentaje / 100) * Number(precio)
        return setDescuento(descuentico.toFixed(0))    
    }
    const giveDescuento = async () => {
        if(Number(porcentaje) > 9 && user.user.area == 'asesor') return dispatch(actions.HandleAlerta('Este descuento es muy alto', 'mistake'));
        if(!descuento) return dispatch(actions.HandleAlerta('Debes dar un descuento', 'mistake'))
        if(descuento == kt.descuento) return dispatch(actions.HandleAlerta('Debes dar un descuento diferente', 'mistake'))
            // Caso contrario, avanzamos
        let body = {
            productoCotizacionId: kt.id,
            descuento
        }
        const sendPeticion = await axios.put('/api/cotizacion/producto/descuento', body)
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
            productoId: itemId, 
            cotizacionId: area.id,
            productoCotizacionId: kt.id
        }

        const sendPetion = await axios.delete('api/cotizacion/remove/producto', { data: body} )
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
        // Close pri
    const closePri = () => {
        setPri(null)
    }

    return ( 
        <tr>
            <td>
                <div>
                    <strong style={{fontSize:12}}>Producto</strong><br />
                    <span>{kt.producto.item} {kt.medida && (`| ${kt.medida}`)}</span>
                </div>
            </td>
            <td>{kt.cantidad}</td>
            {
                active ?
                <td>
                    {/* <input type="text" onKeyDown={(e) => {
                        if(e.key === 'Escape') setActive(false)
                        if(e.key === 'Enter')  giveDescuento();
                    }} onChange={(e) => { 
                        setDescuento(e.target.value)
                    }} value={descuento} /> */}
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
                <td onDoubleClick={() => setActive(true)}>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(kt.descuento).toFixed(0))} COP</td>
            }
            
                {
                !pri ?
                    <td onDoubleClick={() => setPri(true)}>
                        {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(kt.precio).toFixed(0))}
                    </td>
                :
                    <UpdatePrice cotizacion={cotizacion} close={closePri} valor={kt.precio} idKit={kt.id} tipo={'producto'} />
                }
            <td></td>
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