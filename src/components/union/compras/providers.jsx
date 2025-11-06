import React, { useEffect, useState } from "react";
import ModalNewProvider from "./modal/provider";
import { useSearchParams } from "react-router-dom";
import ModalUpdateProvider from "./modal/updateProvider";
import ShowProveedor from "./proveedor/showProveedor";
import { useDispatch, useSelector } from "react-redux";
import * as actions from './../../store/action/action';
import ItemProvider from "./itemProveedor";
import Loading from "../loading";
import { AiOutlinePlus } from "react-icons/ai";

export default function Providers(){
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();
    const prov = useSelector(store => store.provider);
    const { providers, loadingProviders } = prov;


    const [word, setWord] = useState(null);


    useEffect(() => {
        if(providers){
            dispatch(actions.axiosToGetProviders(false))
        }else{
            dispatch(actions.axiosToGetProviders(true))
        }
    }, [])

    return (
        <div className="provider">
            <div className="containerProviders  Dashboard-grid">
                <div className="topSection">
                    <div className="title">
                        <h1>Proveedores </h1>
                    </div>
                    <div className="optionsFast">
                        <nav>
                            <ul>
                                <li style={{marginRight:5}}>
                                    <button >
                                        <span>Descargar</span>
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
                        <div className="topSearchData">
                            <div className="divideSearching">
                                <div className="data">
                                    <h3>Cantidad en el sistema { providers?.length && (`(${providers.length})`)}</h3>
                                    <button onClick={() => {
                                        params.set('w', 'newProvider');
                                        setParams(params);
                                    }}>
                                        <AiOutlinePlus className="icon" />
                                    </button>
                                </div>
                                <div className="filterOptions" style={{borderRadius:20}}>
                                    <div className="inputDivA">
                                        <div className="inputUX" style={{width:'100%'}}>
                                            <input type="text" placeholder="Buscar proveedor aquí..." onChange={(e) => {
                                                setWord(e.target.value)
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div><br />
                        
                        <div className="table TableUX">
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th></th>
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