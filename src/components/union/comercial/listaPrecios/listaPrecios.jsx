import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../../store/action/action';
import { AiOutlinePlus } from "react-icons/ai";
import axiosToGetCotizacion from "axios";
import ItemKitLista from "./itemKit";
import axios from "axios";
import ItemProductoLista from "./itemProducto";

export default function ListaDePreciosPanel(){
    const [params, setParams] = useSearchParams();


    const usuario = useSelector(store => store.usuario);
    
    const { user } = usuario;
    const [type, setType] = useState('kits')

    const [kitSearch, setSearchKit] = useState();
    const [loading, setLoading] = useState(false);

    const searchKitsWithFunction = async (query) => {
        if(type == 'kits'){
            if(!query || query == '') return setSearchKit(null);
            setLoading(true);
            setSearchKit(null);

            const search = await axios.get('/api/kit/get/cotizar/search', {
                params: { query: query },
            })
            .then((res) => {
                setSearchKit(res.data)
            })
            .catch(err => {
                console.log(err);
                setSearchKit(null)
                return null
            })
            .finally(e => {
                setLoading(false)
                return e;
            })
            return search
        }else{
            if(!query || query == '') return kitSearch(null);
            setLoading(true);
            setSearchKit(null);

            const response = await axios.get('api/materia/producto/searching',{
            params: { // Aquí definimos los parámetros de consulta que irán en la URL (ej: ?query=...)
            q: query // El nombre del parámetro 'query' debe coincidir con req.query.query en tu backend
            },
                // Si tu backend requiere autenticación, añade headers aquí:
                // headers: { 'Authorization': `Bearer TU_TOKEN_DEL_USUARIO` }
            }) 
            .then((res) => {
                console.log('aqui')
                setSearchKit(res.data)
            }).catch(err => {
                console.log(err)
                setSearchKit(404)
            })
            .finally(e => {
                setLoading(false)
                return e;
            })
            return response
        }
        
    }
    return (
        <div className="provider">
            <div className="containerProviders Dashboard-grid"> 
                <div className="topSection">
                    <div className="title">
                        <h1>Lista de precios</h1>
                    </div>
                </div>
                <div className="listProviders">
                    <div className="containerListProviders">
                        <div className="topSearchData">
                            <div className="divideSearching">
                                <div className="data">
                                    <h3>Resultados de {type == 'kits' ? 'Kits' : 'Productos'} {kitSearch?.length ? kitSearch.length : null}</h3>
                                </div>
                                <div className="filterOptions">
                                    <div className="inputDivA">
                                        <div className="inputUX LargerUX">
                                            <input type="text" placeholder="Buscar aquí..." onChange={(e) => {
                                                    searchKitsWithFunction(e.target.value)
                                            }}  />
                                        </div>
                                        <div className="filtersUX" style={{width:'50%'}}>
                                            <div className="choose">
                                                <button className={type == 'kits' ? 'Active' : null}
                                                onClick={() => {
                                                    setSearchKit(null)
                                                    setType('kits')
                                                }}>
                                                    <span>Kit's</span>
                                                </button>
                                                <button className={type == 'productos' ? 'Active' : null}
                                                onClick={() => {
                                                    setSearchKit(null)
                                                    setType('productos')

                                                }}>
                                                    <span>Productos</span>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        
                                    </div>
                                </div>
                            </div>
                        </div><br /><br />
                        {
                            type == 'kits' ?
                            <div className="table TableUX">
                                <table>
                                    <tbody>
                                        {
                                            !kitSearch && loading ?
                                                <h1>Cargando</h1>
                                            : !kitSearch ?
                                                <div className="boxMess">
                                                    <h3>¡Hola {user.user.name}! ¿Qué {type == 'kits' ? 'Kits' : 'Productos'} deseas buscar?</h3>
                                                </div>
                                            : kitSearch == 404 || kitSearch == 'notrequest' ? null
                                            :
                                            kitSearch && kitSearch.length ?
                                                kitSearch.map((pv, i) => {
                                                    return (
                                                        <ItemKitLista kit={pv} key={i+1}  />
                                                    )
                                                })
                                            : <div className="boxMessage">
                                                <h3>Hemos encontrado resultados</h3>
                                            </div>
                                        }
                                    </tbody>
                                </table>
                            </div>
                            : type == 'productos' ?
                                <div className="table TableUX">
                                    <table>
                                        <tbody>
                                            {
                                                !kitSearch && loading ?
                                                    <h1>Cargando</h1>
                                                : !kitSearch ?
                                                    <div className="boxMess">
                                                        <h3>¡Hola {user.user.name}! ¿Qué {type == 'kits' ? 'Kits' : 'Productos'} deseas buscar?</h3>
                                                    </div>
                                                : kitSearch == 404 || kitSearch == 'notrequest' ? null
                                                :
                                                kitSearch && kitSearch.length ?
                                                    kitSearch.map((pv, i) => {
                                                        return (
                                                            <ItemProductoLista  terminado={pv} key={i+1}/>
                                                        )
                                                    })
                                                : <div className="boxMessage">
                                                    <h3>Hemos encontrado resultados</h3>
                                                </div>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            :null
                        }
                        
                    </div>
                </div>
            </div>

        </div>
    )
}


