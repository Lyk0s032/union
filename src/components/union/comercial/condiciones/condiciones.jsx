import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../../store/action/action';
import { AiOutlinePlus } from "react-icons/ai";
import axiosToGetCotizacion from "axios";
import CondicionesItem from "./itemCondiciones";
import NewCondicionesItem from "./newItemCondiciones";

export default function CondicionesPanel(){
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();
    const system = useSelector(store => store.system);
    const { condiciones, loadingCondiciones } = system;

    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const [word, setWord] = useState('');
    const [cliente, setCliente] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [create, setCreate] = useState(null);


    useEffect(() => { 
        dispatch(actions.axiosToGetCondiciones(true))
    }, [])
    return (
        <div className="provider">
            <div className="containerProviders Dashboard-grid"> 
                <div className="topSection">
                    <div className="title">
                        <h1>Condiciones comerciales</h1>
                    </div>
                    <div className="optionsFast">
                        {/* <nav>
                            <ul>
                                <li> 
                                    <button className={state == 'completa' ? 'Active' : null} onClick={() => {
                                       setState('completa')
                                    }}>
                                        <span>Pendientes</span>
                                    </button>
                                </li>
                                <li> 
                                    <button className={state == 'desarrollo' ? 'Active' : null} onClick={() => {
                                        setState('desarrollo')
                                    }}>
                                        <span>Aprobadas</span>
                                    </button>
                                </li>
                            </ul> 
                        </nav>*/}
                    </div>
                </div>
                <div className="listProviders">
                    <div className="containerListProviders">
                        <div className="topSearchData">
                            <div className="divideSearching">
                                <div className="data">
                                    <h3>Condiciones en el sistema ({condiciones?.length ? condiciones.length : null})</h3>
                                    <button onClick={() => {
                                        setCreate(true)
                                    }}>
                                        <AiOutlinePlus className="icon" />
                                    </button>
                                </div>
                                <div className="filterOptions">
                                    <div className="inputDivA">
                                        <div className="inputUX LargerUX">
                                            <input type="text" style={{width:'100%'}} placeholder="Buscar aquí..." onChange={(e) => {
                                                setWord(e.target.value)
                                            }} value={word} />
                                        </div>
                                        
                                        
                                    </div>
                                </div>
                            </div>
                        </div><br /><br />

                        <div className="table TableUX">
                            <table>
                                <tbody>
                                    {
                                        create ? 
                                        <NewCondicionesItem />
                                        :null
                                    }
                                    {
                                        
                                        !condiciones && loadingCondiciones ?
                                            <h1>Cargando</h1>
                                        :!condiciones ? <h1>Espera</h1>
                                        : condiciones == 404 || condiciones == 'notrequest' ?
                                            <div className="boxMessage">
                                                <h3>No hemos logrado cargar esto</h3>
                                            </div>
                                        :
                                        condiciones?.length ?
                                            condiciones.map((condi, i) => {
                                                return (
                                                    <CondicionesItem condicion={condi} key={i+1} openMenuId={openMenuId} />
                                                )
                                            })
                                        :null
                                    }
                                </tbody> 
                            </table>
                        </div>
                    </div>
                </div>
                {/* {
                    params.get('prima') ?
                        <ShowMateriaPrima />
                    : null
                } */}
            </div>
            {
                params.get('w') == 'newCotizacion' ?
                    <ModalNewCotizacion />
                // :params.get('w') == 'updateMp' ?
                //     <ModaUpdateMp />    
                : params.get('watch') == 'cotizacion' ?
                    <DocumentCotizacion />
                : null
            }
        </div>
    )
}