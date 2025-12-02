import axios from 'axios';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as actions from './../../../../store/action/action';
import { useDispatch } from 'react-redux';

export default function Transferir({ item }){
    const [loading, setLoading] = useState(false);
    const [params, setParams] = useSearchParams();
    const cantidadActual = item.cantidadEntregada;

    const dispatch = useDispatch();
    const [cantidad, setCantidad] = useState(1);
    const handleAdd = async () => {
        let url = `/api/inventario/remove/kit/materiaBodega/?requisicionId=${item.requisicionId}&${item.kit ? `kitId=${item.kitId}` : `productId=${item.productoId}`}&cantidad=${cantidad}`
        setLoading(true)
        const send = await axios.get(url)
        .then((res) => {
            dispatch(actions.axiosToGetItemElemento(false, item.requisicionId, item.kit ? item.kit.id : null, item.kit ? null: item.producto.id))
            dispatch(actions.axiosToGetItemProduction(true, params.get('project')))
        
        })
        .catch(err => {
            console.log(err) 
            dispatch(actions.HandleAlerta('No hay stock suficiente en proceso para esto', 'mistake'))
        })
        .finally(() => {
            setLoading(false)
        })

        return send;
    }
    
    return(
        <div className="containerGive">
            <div className="inputDiv">
                {
                    loading ? 
                    <label htmlFor="">Transfiriendo</label>
                    :
                    <label htmlFor="">Cantidad a transferir {cantidad}</label>
                }
                <br />
                <input type="Number" placeholder='Ingresar cantidad aquí' onChange={(e) => {
                    setCantidad(e.target.value)
                    
                }} onKeyDown={(e) => { 
                    if(e.key == 'Enter'){
                        if(Number(Number(e.target.value) + Number(cantidadActual)).toFixed(0) > Number(item.cantidadComprometida).toFixed(0)){
                            console.log('Aca se queda')
                            dispatch(actions.HandleAlerta('Esas cantidad es superior', 'mistake'))
                        }else if(cantidad == 0 || !cantidad){
                            console.log('nulll')
                            return null
                        }else{
                            if(!loading){
                                handleAdd()
                            }
                        }
                    }else{
                        console.log('no es')
                        console.log(e.code)
                    }
                }} value={cantidad} />
            </div>
        </div>
    )
}