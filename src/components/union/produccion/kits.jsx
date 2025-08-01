import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import KitItem from "./kitItem";
import ModalNewKit from "./modal/newKit";
import * as actions from '../../store/action/action';
import { useDispatch, useSelector } from "react-redux";
import Loading from "../loading";
import { AiOutlinePlus } from "react-icons/ai";

export default function KitsPanel(){
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();
    const kitsState = useSelector(store => store.kits);
    const { kits, loadingKits } = kitsState;

    const [cat, setCat] = useState(null);
    const [li, setLi] = useState(null);
    const [ex, setEx] = useState(null);

    const system = useSelector(store => store.system);
    const { categorias, lineas, extensiones } = system;

    const [state, setState] = useState('completa');       
    const [word, setWord] = useState(null);
    const [metodo, setMetodo] = useState(null); // METODO DE BUSQUEDA LINEA O CATEGORIA
    const [filter, setFilter] = useState(kits);
        

    useEffect(() => {
        dispatch(actions.axiosToGetKits(true))
    }, [])
    return (
        !kits || loadingKits ?
            <h1>Cargando</h1>
        :
        <div className="provider"> 
            <div className="containerProviders Dashboard-grid">
                <div className="topSection">
                    <div className="title">
                        <h1>Kit's </h1>
                    </div>
                    <div className="optionsFast">
                        <nav>
                            <ul>
                                <li> 
                                    <button className={state == 'completa' ? 'Active' : null} onClick={() => {
                                       setState('completa')
                                    }}>
                                        <span>Completos</span>
                                    </button>
                                </li>
                                <li> 
                                    <button className={state == 'desarrollo' ? 'Active' : null} onClick={() => {
                                        setState('desarrollo')
                                    }}>
                                        <span>Desarrollo</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <div className="listProviders">
                    <div className="containerListProviders">
                        <div className="topSearchData">
                            <div className="divideSearching">
                                <div className="data">
                                    <h3>Kits en el sistema ({kits?.length ? kits.length : null})</h3>
                                    <button onClick={() => {
                                        params.set('w', 'newKit');
                                        setParams(params);
                                    }}>
                                        <AiOutlinePlus className="icon" />
                                    </button>
                                </div>
                                <div className="filterOptions">
                                    <div className="inputDivA">
                                        <div className="inputUX">
                                            <input type="text" placeholder="Buscar aquí..." onChange={(e) => {
                                                setWord(e.target.value)
                                            }} />
                                        </div>
                                        <div className="filtersUX">
                                            <select name="" id="" onChange={(e) => {
                                                return setCat(e.target.value)
                                            }}>
                                                <option value="">Categoría</option>
                                                {
                                                    categorias && categorias.length ?
                                                    categorias.map((c, i) => {
                                                        return (
                                                            c.type == 'comercial' ? 
                                                                <option key={i+1} value={c.id}>{c.name.toUpperCase()}</option>
                                                            : null
                                                        )
                                                    })
                                                    :null
                                                }

                                            </select>
                                            <select name="" id="" onChange={(e) => {
                                                return setLi(e.target.value)
                                            }}>
                                                <option value="">Líneas</option>
                                                {
                                                    lineas && lineas.length ?
                                                    lineas.map((c, i) => {
                                                        return (
                                                            c.type == 'comercial' ? 
                                                                <option key={i+1} value={c.id}>{c.name.toUpperCase()}</option>
                                                            : null
                                                        )
                                                    })
                                                    :null
                                                }

                                            </select>

                                            <select name="" id="" onChange={(e) => {
                                                return setEx(e.target.value)
                                            }}>
                                                <option value="">Color</option>
                                                {
                                                    extensiones && extensiones.length ?
                                                    extensiones.map((c, i) => {
                                                        return (
                                                            <option value={c.id}>{c.name.toUpperCase()}</option>
                                                        )
                                                    })
                                                    :null
                                                }

                                        </select>
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
                                        <th>Línea</th>
                                        <th></th>
                                        <th>Precio promedio</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                {
                                    state == 'completa' ?
                                    <tbody>
                                    {
                                            !kits || loadingKits ?
                                                <Loading />
                                            : kits && kits.length ?
                                                    kits.filter(m => {
                                                        const porLinea = li ? m.lineaId == li : true
                                                        const porCategoria = cat ? m.categoriumId == cat : true
                                                        const porExtension = ex ? m.extensionId == ex : true
                                                    
                                                        let coincidePalabra = true; // Por defecto, la condición es verdadera

                                                        // Solo aplicamos el filtro si hay algo escrito en el buscador
                                                        if (word && word.trim() !== '') {
                                                            const searchTerm = word.toLowerCase();

                                                            // Revisa si el término de búsqueda es un número
                                                            if (!isNaN(searchTerm)) {
                                                                // SI ES NÚMERO: busca solo en el ID del producto.
                                                                coincidePalabra = String(m.id).includes(searchTerm);
                                                            } else {
                                                                // SI ES TEXTO: busca solo en el nombre del ítem.
                                                                coincidePalabra = m.name.toLowerCase().includes(searchTerm);
                                                            }
                                                        }
                                                        return porLinea && porCategoria && porExtension && coincidePalabra
                                                    
                                                    }
                                                        ).map((pv, i) => { 
                                                            return (
                                                                pv.state == 'completa' ? 
                                                                        <KitItem key={i+1} kit={pv} /> 
                                                                : null
                                                            )
                                                        })

                                            : <h1>No hay resultados</h1>
                                    }
                                        
                                    </tbody>
                                    : state == 'desarrollo' ?
                                    <tbody>
                                        {
                                            !kits || loadingKits ?
                                                <span>Cargando</span>
                                            : kits && kits.length ?
                                                word || ex || lineas || categorias ?
                                                    kits.filter(m => {
                                                            const porLetra = word ? m.name.toLowerCase().includes(word.toLowerCase()) : true
                                                            const porLinea = li ? m.lineaId == li : true
                                                            const porCategoria = cat ? m.categoriumId == cat : true
                                                            const porExtension = ex ? m.extensionId == ex : true
                                                            return porLetra && porLinea && porCategoria && porExtension
                                                        }
                                                        ).map((pv, i) => {
                                                            return (
                                                                pv.state == 'desarrollo' || !pv.state ? 
                                                                        <KitItem key={i+1} kit={pv} /> 
                                                                : null
                                                            )
                                                        })
                                                :
                                                kits.map((kt, i) => {
                                                    return (
                                                        kt.state == 'desarrollo' || !kt.state ? <KitItem kit={kt} key={i+1} /> : null
                                                    ) 
                                                })
                                            : <h1>No hay resultados</h1>
                                        }
                                    </tbody>
                                    :null
                                }
                                    
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
                params.get('w') == 'newKit' ?
                    <ModalNewKit />
                // :params.get('w') == 'updateMp' ?
                //     <ModaUpdateMp />    
                : null
            }
        </div>
    )
}