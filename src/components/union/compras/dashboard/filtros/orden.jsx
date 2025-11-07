import axios from 'axios';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function OrdenFiltro(){
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [params, setParams] = useSearchParams();

    const searchKitsAxios = async (searchTerm) => {
        if(!searchTerm || searchTerm == '') return setData(null);
        setLoading(true);
        setData(null); 

        const response = await axios.get('/api/requisicion/get/filters/orden',{
        params: { // Aquí definimos los parámetros de consulta que irán en la URL (ej: ?query=...)
            q: searchTerm, // El nombre del parámetro 'query' debe coincidir con req.query.query en tu backend
        },
            // Si tu backend requiere autenticación, añade headers aquí:
            // headers: { 'Authorization': `Bearer TU_TOKEN_DEL_USUARIO` }
        })  
        .then((res) => {
            setData(res.data)
        }).catch(err => {
            console.log(err)
            setData(404)
        })
        .finally(() => setLoading(false))
        return response
    }
    return (
        <div className="divideSearch">
            <input type="text" placeholder='Buscar orden' onChange={(e) => {
                searchKitsAxios(e.target.value)
            }}/>

            <div className="downFilterResults">
                <div className="dataItems">
                    {
                        data?.length?
                            data.map((r, i) => {
                                return (
                                    <div className="itemResult" key={i+1} onClick={() => {
                                        params.set('orden', r.id)
                                        setParams(params);
                                        setData(null)
                                    }}>
                                       <div className="divideItemResult">
                                            <div className="nameData">
                                                <div className="letter">
                                                    <h3>{r.id}</h3>
                                                </div>
                                                <div className="data">
                                                    <h3>{r.name}</h3>
                                                    <strong>{r.estadoPago}</strong><br />
                                                    <span>{r.createdAt.split('T')[0]}</span>
                                                </div>
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
    )
}