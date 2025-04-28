import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import KitItem from "./kitItem";
import ModalNewKit from "./modal/newKit";
import * as actions from '../../store/action/action';
import { useDispatch, useSelector } from "react-redux";
import Loading from "../loading";

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
        <div className="provider">
            <div className="containerProviders">
                <div className="topSection">
                    <div className="title">
                        <h1>Kit's</h1>
                    </div>
                    <div className="optionsFast">
                        <nav>
                            <ul>
                                <li> 
                                    <button onClick={() => {
                                        params.set('w', 'newKit');
                                        setParams(params);
                                    }}>
                                        <span>Nuevo Kit</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <div className="listProviders">
                    <div className="containerListProviders">
                        <div className="topSearch">
                            <div className="containerTopSearch">
                                <input type="text" placeholder="Buscar Kit" onChange={(e) => {
                                    setWord(e.target.value)
                                }}/>
                            </div>
                        </div>
                        <div className="filters">
                            <div className="containerFilters">
                                <div className="divideFilter">
                                <div className="type">
                                    <label htmlFor="">Categorías</label><br />
                                    <select name="" id="" onChange={(e) => {
                                        return setCat(e.target.value)
                                    }}>
                                        <option value="">Seleccionar</option>
                                        {
                                            categorias && categorias.length ?
                                            categorias.map((c, i) => {
                                                return (
                                                    c.type == 'comercial' ? 
                                                        <option key={i+1} value={c.id}>{c.name}</option>
                                                    : null
                                                )
                                            })
                                            :null
                                        }

                                    </select>
                                </div>
                                    <div className="type">
                                        <label htmlFor="">Extensión</label><br />
                                        <select name="" id="" onChange={(e) => {
                                            return setEx(e.target.value)
                                        }}>
                                            <option value="">Seleccionar</option>
                                            {
                                                extensiones && extensiones.length ?
                                                extensiones.map((c, i) => {
                                                    return (
                                                        <option value={c.id}>{c.name}</option>
                                                    )
                                                })
                                                :null
                                            }

                                        </select>
                                    </div>
                                    <div className="options">
                                        <label htmlFor="">Lista</label><br />
                                        <select name="" id="" onChange={(e) => {
                                            return setLi(e.target.value)
                                        }}>
                                            <option value="">Seleccionar</option>
                                            {
                                                lineas && lineas.length ?
                                                lineas.map((c, i) => {
                                                    return (
                                                        c.type == 'comercial' ? 
                                                            <option key={i+1} value={c.id}>{c.name}</option>
                                                        : null
                                                    )
                                                })
                                                :null
                                            }

                                        </select>

                                    </div>
                                </div>

                                <div className="state">
                                    <nav>
                                        <ul>
                                            <li className={state == 'completa' ? 'Active' : null} onClick={() => {
                                                setState('completa')
                                            }}>
                                                <div>
                                                    <span>Completos</span>
                                                </div>
                                            </li>
                                            <li className={state == 'desarrollo' ? 'Active' : null} onClick={() => {
                                                setState('desarrollo')
                                            }}>
                                                <div>
                                                    <span>En desarrollo</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                        <div className="table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Nombre</th>
                                        <th>Categoría</th>
                                        <th>Línea</th>
                                        <th>Extensión</th>
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
                                                        const porLetra = word ? m.name.toLowerCase().includes(word.toLowerCase()) : true
                                                        const porLinea = li ? m.lineaId == li : true
                                                        const porCategoria = cat ? m.categoriumId == cat : true
                                                        const porExtension = ex ? m.extensionId == ex : true
                                                        return porLetra && porLinea && porCategoria && porExtension
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