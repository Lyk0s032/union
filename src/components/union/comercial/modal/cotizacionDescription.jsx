import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import * as actions from '../../../store/action/action';
import { useDispatch } from 'react-redux';

export default function CotizacionDescription(){
    const [client, setClient] = useState(null); 
    const [choose, setChoose] = useState(null);
    const dispatch = useDispatch(); 


    const [form, setForm] = useState({
        clientId: choose ? choose.id : null,
        name: null,
        description: null,
        time: '03-20-2025',
    });
    
    // Crear cotización
    const createCotizacion = async () => { 
        if(!form.name) return dispatch(actions.HandleAlerta('Debes llenar nombre de la cotización', 'mistake'))
        if(!choose) return dispatch(actions.HandleAlerta('Debes seleccionar un cliente', 'mistake'))

        const body = form;
        const sendPeticion = await axios.post('/api/cotizacion/new', body)
        .then((res) => {
            console.log(res)
            return dispatch(actions.getCotizacion(res.data)) 
        })
        .catch(err => {
            dispatch(actions.HandleAlerta('No hemos logrado crear esta cotización', 'mistake'))
            return err;
        })
        return sendPeticion;
    }

    const searchQuery = async (query) => {
        if(!query || query == '') return setClient(null);

        const search = await axios.get('/api/cotizacion/search', {
            params: { query: query },
        })
        .then((res) => {
            setClient(res.data)
        })
        .catch(err => {
            console.log(err);
            setClient(null)
            return null
        });
        return search
        
       
    }

    return (
        <div className="kitDescription">
            <div className="containerKitDescription">
                <div className="form">
                    <div className="containerForm">
                        <div className="inputDiv">
                            <h3>Nombre de la cotización</h3>
                            <input type="text" placeholder='Escribe aquí' onChange={(e) => {
                                setForm({
                                    ...form,
                                    name: e.target.value
                                })
                            }} value={form.name} />
                        </div>
                        {
                            !choose ?
                            <div className="inputDiv">
                                <h3>Buscar cliente</h3>
                                <div className="search">
                                    <input type="text" placeholder='Buscar cliente' onChange={(e) => {
                                        searchQuery(e.target.value) 
                                    }} />
                                    <div className="results">
                                        {
                                            client && client.length ?
                                                client.map((cl, i) => {
                                                    return (
                                                        <div key={i+1} className='searchClient' onClick={() => {
                                                            setForm({
                                                                ...form,
                                                                clientId: cl.id
                                                            })
                                                            return setChoose(cl);
                                                        }}>
                                                            <div className="divideData">
                                                                <div className="client">
                                                                    <span>{cl.id}</span><br />
                                                                    <span>{cl.nit}</span><br />
                                                                    <span><strong>{cl.nombre}</strong></span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            : null
                                        }
                                    </div>
                                </div>
                            </div>
                            : 
                            <div className="inputDiv Choosed">
                                <h3>Cliente seleccionado</h3>
                                <div className="divideData">
                                    <div className="client">
                                       <span>{choose.nit}</span><br />
                                       <span>{choose.nombre}</span>
                                   </div>
                                   <button onClick={() => setChoose(null)}>
                                        <AiOutlineClose />
                                   </button>
                               </div>
                            </div>
                        }
                    
                    </div>
                </div>
                <div className="bottom">
                    <button onClick={() => {
                        createCotizacion()
                    }}>
                        <span>Siguiente</span>
                    </button>
                </div>
            </div>
        </div>
    )
}