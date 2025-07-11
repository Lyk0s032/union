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

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null);

    const searchKitsAxios = async (searchTerm) => {
        if(!searchTerm || searchTerm == '') return setData(null);
        setLoading(true);
        setData(null);

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
        })
        .finally(e => setLoading(false))
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
                <div className="boxAllInOne">
                    <div className="containerBoxAll">
                        <div className="containerSearch">
                            <div className="searchInputDiv">
                                <div className="inputDiv">
                                    <input type="text" placeholder="Superficie..." onChange={(e) => {
                                        searchKitsAxios(e.target.value)
                                    }} />
                                </div>
                            </div>
                        </div>

                        <div className="typePrices">
                            <div className="chooseFilter">
                                <button className={dis ? 'distribuidor' : null} onClick={() => {
                                    setDis(!dis)
                                }}>
                                    <span>Distribuidor</span>
                                </button>
                                <button className={!dis ? 'final' : null} onClick={() => {
                                    setDis(false) 
                                }}>
                                    <span>Final</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="resultsToSelect">
                <div className="containerResults">
                    <div className="itemResults"><br /><br />
                        {       
                            loading ? <h1>Cargando</h1> :
                            !data ? null 

                            : data && data.length ?
                                data.map((m,i) => { 
                                    return (
                                          <ProductoTerminadoItem area={number} final={final} terminado={m} key={i+1} />
                                    )
                                }) 
                            :   
                                <h1>No hemos encontrado esto </h1>
                        }       
                    </div><br /><br /><br /><br />  
                </div> 
            </div>
        </div>
    )
}