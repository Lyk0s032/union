import React, { useEffect, useState } from "react";
import ItemToSelect from "./itemToSelect";
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import SuperKitItem from "./itemSuperkit";
import ProductoTerminadoItem from "./itemProducto";

export default function SearchProductoTerminado({ number }){
    const dispatch = useDispatch();
    
    const kitStore = useSelector(store => store.kits);
    const {kits, kit, loadingKits} = kitStore;

    const cotizacions  = useSelector(store => store.cotizacions);
    const { cotizacion } = cotizacions;

    
    const [data, setData] = useState(null);

    const searchKitsAxios = async (searchTerm) => {
    
        const response = await axios.get('api/materia/producto/searching',{
        params: { // Aquí definimos los parámetros de consulta que irán en la URL (ej: ?query=...)
          q: searchTerm // El nombre del parámetro 'query' debe coincidir con req.query.query en tu backend
        },
            // Si tu backend requiere autenticación, añade headers aquí:
            // headers: { 'Authorization': `Bearer TU_TOKEN_DEL_USUARIO` }
        }) 
        .then((res) => {
            setData(res.data)
        }).catch(err => {
            console.log(err)
            setData(404)
        });
    
        return response
    }

    const [dis, setDis] = useState(false);
    const [final, setFinal] = useState(true);

    const change = () => {
        if(dis){
            setFinal(false)
        }else{
            setFinal(true)
        }
    }
    useEffect(() => {
        change()
    }, [dis])
    return (
        <div className="containerRightSelect">
            <div className="topSelect">
                <div className="titleSelect"><br />
                    <h3>Buscar producto terminado</h3>
                </div>
                <div className="searchInput">
                    <input type="text" placeholder='Buscar aquí' onChange={(e) => {
                        searchKitsAxios(e.target.value)
                    }}/>
                </div>
            </div>
            <div className="resultsToSelect">
                    <div className="priceFilter">
                        <label htmlFor="">Cliente distribuidor</label><br />
                        <input type="checkbox" onChange={(e) => {
                            setDis(!dis)
                        }} checked={dis}/><br />
                        <label htmlFor="">Cliente final</label><br />
                        <input type="checkbox" checked={final} onChange={(e) => {
                            setDis(false)
                        }}/>
                    </div>         
                <div className="containerResults">
                    <div className="itemResults">
                        {       
                            !data ? null 

                            : data && data.length ?
                                data.map((m,i) => { 
                                    return (
                                          <ProductoTerminadoItem area={number} terminado={m} key={i+1} />
                                    )
                                }) 
                            :   
                                <h1>No hemos encontrado esto </h1>
                        }       
                    </div>      
                </div> 
            </div>
        </div>
    )
}