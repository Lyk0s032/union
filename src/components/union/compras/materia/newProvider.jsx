import React, { useState } from 'react';
import * as actions from '../../../store/action/action';
import { useDispatch } from 'react-redux';
import axios from 'axios';

export default function NewProviderPrice(props){
    const prima = props.prima;
    const [choose, setChoose] = useState(null);
    const [valor, setValor] = useState(null);
    const [provider, setProvier] = useState(null);

    const dispatch = useDispatch();

    const addPrice = async () => {
        if(!valor) return dispatch(actions.HandleAlerta("Debes ingresar un valor", 'mistake'))
        if(!choose) return dispatch(actions.HandleAlerta("Debes seleccionar un cliente", 'mistake'))

        // Caso contrario, enviamos consulta
        let iva = valor * 0.19;
        let total = Number(Number(valor) + Number(iva)).toFixed(0); 
        const body = {
            mtId: prima.id,
            pvId: choose.id,
            price: total,
            iva,
            descuentos: valor
        }
        console.log(body)
        const sendPetion = await axios.post('/api/mt/price/give', body)
        .then((res) => {
            dispatch(actions.axiosToGetPrima(false, prima.id))
            dispatch(actions.HandleAlerta("Valor ingresado con exito", 'positive'))
            setValor(0)
            setChoose(null)
            dispatch(actions.axiosToGetPrimas(false))
            
        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta("No hemos logrado ingresar esto", 'mistake'))
        })
        return sendPetion;
    }

    // QUERY SEARCH
    const searchQuery = async (query) => {
        if(!query || query == '') return setProvier(null);

        const search = await axios.get('/api/proveedores/get/query', {
            params: { query: query },
        })
        .then((res) => {
            setProvier(res.data)
        })
        .catch(err => {
            console.log(err);
            setProvier(null)
            return null
        }); 
        return search
        
       
    }
    return (
        <div className="newPriceOnProvider">
            <div className="containerProvider">
                {
                    choose ?
                    <div className="searchInput">
                        <div className='titles'>
                            <span>{choose.nit}</span> 
                            <h3>{choose.nombre}</h3>
                        </div>
                        <div className="inputValor">
                            <label htmlFor="">Precio materia prima</label><br />
                            <input type="text" placeholder='Escribe aquí, sin puntos.' onChange={(e) => {
                                setValor(e.target.value)
                            }} value={valor}/>
                            <br /><br />
                            <button className='cambiar' onClick={() => addPrice()}>
                                <span>Agregar precio</span>
                            </button>
                            <button className="back" onClick={() => setChoose(null)}>
                                <span>Regresar</span>
                            </button><br />
                        </div>

                    </div>
                    :
                    <div className="searchInput">
                        <h3>Buscar proveedor</h3>
                        <div className="inputDiv">  
                            <input type="text" placeholder='Escribe aquí' onChange={(e) => {
                                searchQuery(e.target.value) 
                            }} />
                        </div>
                        <div className="results">
                        {
                        provider && provider.length ?
                            provider.map((cl, i) => {
                                return (
                                    <div className="itemChoose" onClick={() => setChoose(cl)}>
                                        <span>{cl.nit}</span><br />
                                        <span><strong>{cl.nombre}</strong></span>
                                    </div>
                            )})
                        : null
                        }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}