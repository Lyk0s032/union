import React, { useEffect, useState } from "react";
import ModalNewProvider from "./modal/provider";
import { useSearchParams } from "react-router-dom";
import ModalUpdateProvider from "./modal/updateProvider";
import ShowProveedor from "./proveedor/showProveedor";
import { useDispatch, useSelector } from "react-redux";
import * as actions from './../../store/action/action';
import ItemProvider from "./itemProveedor";
import Loading from "../loading";

export default function Providers(){
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();
    const prov = useSelector(store => store.provider);
    const { providers, loadingProviders } = prov;


    const [word, setWord] = useState(null);


    useEffect(() => {
        dispatch(actions.axiosToGetProviders(true))
    }, [])

    return (
        <div className="provider">
            <div className="containerProviders">
                <div className="topSection">
                    <div className="title">
                        <h1>Proveedores</h1>
                    </div>
                    <div className="optionsFast">
                        <nav>
                            <ul>
                                <li> 
                                    <button onClick={() => {
                                        params.set('w', 'newProvider');
                                        setParams(params);
                                    }}>
                                        <span>Nuevo proveedor</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <div className="listProviders">
                    {
                        !providers || loadingProviders ?
                            <Loading />
                        :
                        <div className="containerListProviders">
                        <div className="topSearch">
                            <div className="containerTopSearch">
                                <input type="text" placeholder="Buscar proveedor" onChange={(e) => {
                                    setWord(e.target.value)
                                }} value={word}/>
                            </div>
                        </div>
                        <div className="table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Nit</th>
                                        <th>Tipo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        providers && providers.length ?
                                            providers.filter(pro => {
                                                const busqueda = word ? pro.nombre.toLowerCase().includes(word.toLowerCase()) : true;
                                                return busqueda;
                                            }).map((pv, i) => {
                                                        return (
                                                            <ItemProvider key={i+1} pv={pv} />
                                                        )
                                                    })
                                        : <h1>No hay resultados</h1>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    }
                </div>
                {
                    params.get('provider') ?
                        <ShowProveedor />
                    : null
                }
            </div>
            {
                params.get('w') == 'newProvider' ?
                    <ModalNewProvider />
                :params.get('w') == 'updateProvider' ?
                    <ModalUpdateProvider />    
                : null
            }
        </div>
    )
}