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
    const cotizacions = useSelector(store => store.cotizacions);
    const { cotizaciones, loadingCotizaciones } = cotizacions;
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const [state, setState] = useState('completa');      
    const [word, setWord] = useState('');
    const [metodo, setMetodo] = useState(null); // METODO DE BUSQUEDA LINEA O CATEGORIA
    const [filter, setFilter] = useState(cotizaciones);
    const [cliente, setCliente] = useState([]);
    const [resultados, setResultados] = useState(null);
    const [searchCliente, setSearchCliente] = useState(null);
    const inputRef = useRef(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [create, setCreate] = useState(null);


    
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
                                    <h3>Condiciones en el sistema ({cotizaciones?.length ? cotizaciones.length : null})</h3>
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
                                        !cotizaciones || loadingCotizaciones ?
                                            <h1>Cargando</h1>
                                        : cotizaciones == 404 || cotizaciones == 'notrequest' ? null
                                        :
                                        cotizaciones?.length ?
                                            cotizaciones.filter(pro => {
                                                const searchTerm = word.toLowerCase();
                                                const busqueda = word ? pro.name.toLowerCase().includes(word.toLowerCase()) : true;
                                                const idVisible = String(21719 + Number(pro.id));
                                                const coincidePorId = idVisible.includes(searchTerm);
                                                const porCliente = cliente.length > 0 
                                                ? cliente.some(cliente => cliente.id === pro.clientId) 
                                                : true;
                                                return (busqueda || coincidePorId) && porCliente; 
                                            }).map((coti, i) => {
                                                return (
                                                    <CondicionesItem cotizacionn={coti} key={i+1} openMenuId={openMenuId} />
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