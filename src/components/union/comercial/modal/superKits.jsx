import React, { useEffect, useState } from "react";
import ItemToSelect from "./itemToSelect";
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import SuperKitItem from "./itemSuperkit";

export default function SearchSuperKitsComercial({ number }){
    const dispatch = useDispatch();
    
    const [dis, setDis] = useState(false);
    const kitStore = useSelector(store => store.kits);
    const {kits, kit, loadingKits} = kitStore;

    const cotizacions  = useSelector(store => store.cotizacions);
    const { cotizacion } = cotizacions;

    
    const [data, setData] = useState(null);

    const searchKitsAxios = async (searchTerm) => {
     
        const response = await axios.get('/api/superkit/get/s/search/',{
        params: { // Aquí definimos los parámetros de consulta que irán en la URL (ej: ?query=...)
          query: searchTerm // El nombre del parámetro 'query' debe coincidir con req.query.query en tu backend
        },
            // Si tu backend requiere autenticación, añade headers aquí:
            // headers: { 'Authorization': `Bearer TU_TOKEN_DEL_USUARIO` }
        })
        .then((res) => {
            setData(res.data)
        }).catch(err => {
            setData(404)
        });
    
        return response
    }

    useEffect(() => {
        dispatch(actions.axiosToGetKitsCompleted(false))
    }, [])
    return (
        <div className="containerRightSelect">
            <div className="topSelect">
                <div className="titleSelect">
                    <h3>Buscar Superkit's</h3>
                </div>
                <div className="searchInput">
                    <input type="text" placeholder='Buscar aquí' onChange={(e) => {
                        searchKitsAxios(e.target.value)
                    }}/>
                </div>
            </div>
            <div className="resultsToSelect">
                <div className="priceFilter">
                    <label htmlFor="">Para distribuidor</label><br />
                    <input type="checkbox" onChange={(e) => {
                        setDis(!dis)
                    }}/>
                </div>
                <div className="containerResults">
                    <div className="itemResults">
                        {
                            data == 404 ?
                                null
                            : data && data.length ?
                                data.map((m,i) => { 
                                    return (
                                        <SuperKitItem key={i+1} dis={dis} number={number} cotizacion={cotizacion} superkit={m} />
                                    )
                                })
                            : null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}