import axios from 'axios';
import React, { useState } from 'react';

export default function RequisicionFiltro({ onSelect }){
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const searchKitsAxios = async (searchTerm) => {
        if(!searchTerm || searchTerm == '') return setData(null);
        setLoading(true);
        setData(null); 

        const response = await axios.get('/api/requisicion/get/filters/requisicion',{
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
            <input type="text" placeholder='Buscar requisición' onChange={(e) => {
                searchKitsAxios(e.target.value)
            }}/>

            <div className="downFilterResults">
                <div className="dataItems">
                    {
                        data?.length?
                            data.map((r, i) => {
                                return (
                                    <div className="itemResult" key={i+1} onClick={() => {
                                        let a = { tipo: 'requisicion', nombre: r.nombre, id: r.id}
                                        onSelect(a)
                                    }}>
                                       <div className="divideItemResult">
                                            <div className="nameData">
                                                <div className="letter">
                                                    <h3>{r.id}</h3>
                                                </div>
                                                <div className="data">
                                                    <h3>{r.nombre}</h3>
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