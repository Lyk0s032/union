import React, { useEffect, useState } from 'react';
import NewChooseMp from './newChooseMp';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../../../store/action/action';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

export default function NewOrden(){
    const [moment, setMoment] = useState(null);
    const [title, setTitle] = useState('Cotización con Apex');
    const [provider, setProvider] = useState(null)
    const [editName, setEditName] = useState(null);
    const changeMomento = (momento) => {
        setMoment(momento)
    }
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();
    const req = useSelector(store => store.requisicion);
    const { ids } = req;

    const [loading, setLoading] = useState(false);

    const newOrden = async (providerId) => {
        if(!title || !provider) return dispatch(actions.HandleAlerta('No puedes dejar campos vacios', 'mistake'));
        // Caso contrario, avanzamos
        setLoading(true)
        let body = {
            name: title,
            proyectos: ids,
            proveedor: providerId
        }
        console.log(body)
        const send = await axios.post('/api/requisicion/post/generar/cotizacion/one', body)
        .then((res) => {
            if(res.status == 200){
                dispatch(actions.HandleAlerta('Ya existe una orden de compra con este nombre', 'mistake'))
            }else{
                params.set('orden', res.data.id)
                setParams(params);
            }
            console.log(res);
            
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => {
            setLoading(false)
        })
        return send;
    }

    const searchQuery = async (query) => {
        if(!query || query == '') return setProvider(null);

        const search = await axios.get('/api/proveedores/get/query', {
            params: { query: query },
        })
        .then((res) => {
            setProvider(res.data)
        })
        .catch(err => {
            console.log(err);
            setProvider(null)
            return null
        }); 
        return search
        
       
    }

    useEffect(() => {  
        if(params.get('orden') != 'new'){
            dispatch(actions.axiosToGetOrdenComprasAdmin(true, params.get('orden')))
        }
    }, [params.get('orden')]) 
    return (
        <div className="newOrden">
            {
                params.get('orden') == 'new' ?
                <div className="containerNewOrden">
                    {/* Ingresar nombre de orden de compras */}
                    {
                    !moment && (
                        <div className="">
                            <div className="titleNew">
                                <h1>
                                    Comencemos a crear una nueva orden de compras
                                </h1>
                                <h3>Selecciona, reparte y hazle seguimiento a todas tus compras</h3>
                            </div>
                            <div className="inputForm">
                                <input type="text" placeholder='Nombre de tu orden de compra'
                                onChange={(e) => {
                                    setTitle(e.target.value)
                                }}
                                value={title}
                                onKeyDown={(e) => {
                                    if(e.code == 'Enter'){
                                        if(title && title != ''){
                                            changeMomento('provider')
                                        }
                                    }
                                }} />
                            </div>
                        </div>
                    )
                    }
                    {/* Seleccionar proveedor para orden de compras */}
                    { 
                    moment == 'provider' && (
                        <div className="">
                            <div className="titleNew Left">
                                <span>Nombre orden de compras</span><br />
                                {
                                    !editName ?
                                        <h1 className="NameTitle" onClick={() => {
                                            setEditName(true)
                                        }}>
                                            {title}
                                        </h1>
                                    : 
                                    <input type="text" placeholder='Nombre de orden de compra' 
                                    onChange={(e) => setTitle(e.target.value)}
                                    value={title} onBlur={() => setEditName(null)}/>

                                }
                            </div>

                            <div className="SearchProvider">
                                <label htmlFor="">Busca y selecciona un proveedor</label><br />
                                <input type="text" placeholder='Por ejemplo: Apex...' 
                                    onChange={(e) => {
                                        searchQuery(e.target.value)
                                    }} 
                                    onKeyDown={(e) => {
                                        if(e.code == 'Enter'){
                                            setMoment('choose')
                                        }
                                }} />
                            </div>
                            <div className="resultados">
                                {
                                    console.log(provider)
                                }

                                {
                                    provider && provider.length ?
                                        provider?.map((p, i) => {
                                            return (
                                            <div key={i+1} className="providerQuery" 
                                                onClick={() => newOrden(p.id)}>
                                                    <span>{p.nit}</span>
                                                    <h3>{p.nombre}</h3>
                                            </div>
                                            ) 
                                        })
                                    : null
                                }
                            </div>
                        </div>
                    )
                    }
                    {/* {
                        moment == 'choose' && (
                            
                        ) 
                    } */}
                </div>
                :
                <div className="containerNewOrden">
                    <div className="resultChoose">
                        <NewChooseMp provider={provider} title={title} />
                    </div>
                </div>
            }
        </div>
    )
}