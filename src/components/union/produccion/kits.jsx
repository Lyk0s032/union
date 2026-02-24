import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import KitItem from "./kitItem";
import ModalNewKit from "./modal/newKit";
import * as actions from '../../store/action/action';
import { useDispatch, useSelector } from "react-redux";
import Loading from "../loading";
import { AiOutlinePlus } from "react-icons/ai";
import axios from "axios";

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
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState('completa');       
    const [word, setWord] = useState(null);
    const [metodo, setMetodo] = useState(null); // METODO DE BUSQUEDA LINEA O CATEGORIA
    const [filter, setFilter] = useState(kits);
        
    const [loadingFilter, setLoadingFilter] = useState(false);
    const [kitsFiltrados, setKitsFiltrados] = useState(null);

    const hayFiltros =
        word ||
        cat ||
        li ||
        ex;




    const getKitsFiltrados = async () => {
        try {
            setLoadingFilter(true);

            const { data } = await axios.get('/api/kit/get/filter/querys/kits', {
            params: {
                name: word || undefined,
                categoriaId: cat || undefined, 
                lineaId: li || undefined,
                extensionId: ex || undefined,
                state: state || undefined
            }
            });

            setKitsFiltrados(data);
        } catch (err) {
            console.error(err);
            setKitsFiltrados([]);
        } finally {
            setLoadingFilter(false);
        }
    };

    const handleUpdatePrices = async() => {
        setLoading(true)
        const sendAprobation = await axios.get(`/api/kit/kits/getPrices`)
        .then(res => {
            dispatch(actions.HandleAlerta('Actualizado con éxito', 'positive')) 

            return res
        })
        .catch(err => {
            dispatch(actions.HandleAlerta('No hemos logrado actualizar esto', 'mistake'))
            return err;
        })
        .finally(() => {
            setLoading(false)
        })
        return sendAprobation;
    } 

    useEffect(() => {
        if (hayFiltros) {
            getKitsFiltrados();
        } else {
            setKitsFiltrados(null); // volvemos al store
        }
    }, [word, cat, li, ex, state]);



    useEffect(() => {
        // Determinar qué estado enviar según el estado actual
        let estadoQuery = null;
        if (state === 'desarrollo') {
            estadoQuery = 'desarrollo';
        } else if (state === 'simulation') {
            estadoQuery = 'simulacion';
        } else if (state === 'completa') {
            estadoQuery = 'completa';
        }
        // Si state es 'completa' o cualquier otro, estadoQuery queda null (comportamiento normal)
        
        if(!kits){
            dispatch(actions.axiosToGetKits(true, estadoQuery))
        }else{
            dispatch(actions.axiosToGetKits(false, estadoQuery))
        }
    }, [state]) 

    const dataToRender = kitsFiltrados ?? kits;

    return (
        loadingKits || !kits ? (
            <div className="loading" style={{height: '80vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div className="containerLoading">
                    <h1 style={{color: '#02618f', fontWeight: '400', fontSize: '20px'}}>Cargando...</h1>
                </div>
            </div>
        )
        : (
        <div className="provider"> 
            <div className="containerProviders Dashboard-grid">
                <div className="topSection">
                    <div className="title">
                        <h1>Kit's </h1>
                    </div>
                    <div className="optionsFast">
                        <nav>
                            <ul>
                                <li style={{marginRight:10}}>
                                    <button className='Active' onClick={() => {
                                       handleUpdatePrices()
                                    }}>
                                        <span>{loading ? 'Actualizando' : 'Actualizar'}</span>
                                    </button>
                                </li>
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
                                <li> 
                                    <button className={state == 'simulation' ? 'Active' : null} onClick={() => {
                                        setState('simulation')
                                    }}>
                                        <span>Simulación</span>
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
                                            !kits || loadingKits || loadingFilter ?
                                                <Loading />
                                            : dataToRender  && dataToRender .length ?
                                                    dataToRender.map((pv, i) => { 
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
                                    : state == 'simulation' ?
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
                                                                pv.state == 'simulacion' ? 
                                                                        <KitItem key={i+1} kit={pv} /> 
                                                                : null
                                                            )
                                                        })
                                                :
                                                kits.map((kt, i) => {
                                                    return (
                                                        kt.state == 'simulacion'  ? <KitItem kit={kt} key={i+1} /> : null
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
    )
}