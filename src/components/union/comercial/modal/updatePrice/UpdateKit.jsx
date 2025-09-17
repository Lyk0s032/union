import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../store/action/action';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

export default function UpdatePrice({ kit, cotizacion, close, tipo, idKit, valor}){
    const [params, setParams] = useSearchParams();
    const [newVal, setNew] = useState(valor)
    const [porcentaje, setPorcentaje] = useState(0);
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;

    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const updatePorcentaje = () => {
        let basico = Number(valor);

        // const respectivo = Number(porcentaje) * Number(newVal);
        let total = Number(basico + (valor * Number(porcentaje) / 100)).toFixed(0);
        setNew(String(total))
    }

    // Dar descuento
    const givePrice = async () => {
        if(kit.state != 'simulacion' && Number(porcentaje) > 100 ) return dispatch(actions.HandleAlerta('Este porcentaje es muy alto', 'mistake'));
        if(!porcentaje) return dispatch(actions.HandleAlerta('Debes dar un porcentaje', 'mistake'))
        if(valor == newVal) return dispatch(actions.HandleAlerta('Debes dar un precio diferente', 'mistake'))
        // Caso contrario, avanzamos
        setLoading(true)
        let body = {
            kitCotizacionId: idKit,
            precio: kit.state == 'simulacion' ? porcentaje : newVal
        } 
        console.log(idKit)
        let url = tipo == 'kit' ? '/api/cotizacion/admin/update/cotizacion/kit' : '/api/cotizacion/admin/update/cotizacion/producto';
 
        const sendPeticion = await axios.put(url, body)
        .then((res) => { 
            dispatch(actions.HandleAlerta('Descuento asignado', 'positive'));
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            dispatch(actions.axiosToGetCotizaciones(false, user.user.id))
            close();
            return res;
        }).catch(err => {
            console.log(err) 
            dispatch(actions.HandleAlerta('No hemos podido dar este descuento', 'mistake'));
        })
        .finally(() => setLoading(false))
        return sendPeticion;
    }

    useEffect(() => {
        updatePorcentaje()
    }, [porcentaje])
    return (
        <>
            <label htmlFor="" style={{fontSize:12, color: '#666'}}>{!loading ? `Anterior: ${ new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(valor).toFixed(0))}` : 'Actualizando...'}</label><br />
            <label htmlFor=""  style={{fontSize:12, color: '#666'}}>Nuevo: {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(kit.state == 'simulacion' ? porcentaje : newVal)}</label><br />

            <input type="text" onChange={(e) => {
                if(!loading){
                    setPorcentaje(e.target.value)
                }
            }} onKeyDown={(e) => {
                if(e.code == 'Escape'){
                    close()
                }
                if(e.code == 'Enter' && !loading){
                    givePrice()
                }
            }} value={porcentaje} />
        </>
    )
}