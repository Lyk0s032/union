import React, { useEffect, useState } from "react";
import ModalNewProvider from "./modal/provider";
import { useSearchParams } from "react-router-dom";
import ModalUpdateProvider from "./modal/updateProvider";
import ShowProveedor from "./proveedor/showProveedor";
import ModalNewMp from "./modal/mp";
import ModaUpdateMp from "./modal/updateMp";
import ShowMateriaPrima from "./materia/showMateriaPrima";
import { useDispatch, useSelector } from "react-redux";
import * as actions from './../../store/action/action';
import ItemMP from "./itemMp";
import Loading from "../loading";


export default function MateriaPrima(){
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();
    const pm = useSelector(store => store.prima); 
    const { primas, loadingPrimas } = pm;

    const system = useSelector(store => store.system); 
    const { categorias, lineas } = system

    const [word, setWord] = useState(null);
    const [metodo, setMetodo] = useState(null); // METODO DE BUSQUEDA LINEA O CATEGORIA
    const [cat, setCat] = useState(null);
    const [li, setLi] = useState(null);

    const [filter, setFilter] = useState(primas);

    const filterProviders = (val) => {
        const filtrado = providers.filter(pv => pv.nombre.toLowerCase().includes(word.toLowerCase()))
        return setFilter(filtrado)
    }


     
    useEffect(() => {
        dispatch(actions.axiosToGetPrimas(true)) 
        setFilter(primas)
    }, [])
    return (
        <div className="provider">
            <div className="containerProviders">
                <div className="topSection">
                    <div className="title">
                        <h1>Materia prima { primas?.length && (`(${primas.length})`)}</h1>
                    </div>
                    <div className="optionsFast">
                        <nav>
                            <ul>
                                <li> 
                                    <button onClick={() => {
                                        params.set('w', 'newMp');
                                        setParams(params);
                                    }}>
                                        <span>Agregar materia prima</span>
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
                                <input type="text" placeholder="Buscar materia prima" onChange={(e) => {
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
                                            <option value=''>Seleccionar</option>
                                            {
                                                categorias && categorias.length ?
                                                    categorias.map((c, i) => {
                                                        return (
                                                            c.type == 'MP' ?
                                                                <option key={i+1} value={c.id}>{c.name}</option>
                                                            :null 
                                                        )
                                                    })
                                                : null
                                            }
                                        </select>
                                    </div>
                                    <div className="options">
                                        <label htmlFor="">Lineas </label><br />
                                        <select name="" id="" onChange={(e) => {
                                            setLi(e.target.value)
                                        }}>
                                            <option value=''>Seleccionar </option>
                                            {
                                                lineas && lineas.length ?
                                                    lineas.map((l, i) => {
                                                        return (
                                                            l.type == 'MP' ?
                                                                <option key={i+1} value={l.id}>{l.name.toUpperCase()}</option>
                                                            :null 
                                                        )
                                                    })
                                                : null
                                            }
                                        </select>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="table">
                            {
                                !primas || loadingPrimas ?
                                    <Loading />
                                :
                                <table>
                                    <thead> 
                                        <tr>
                                            <th>Código</th>
                                            <th>Nombre</th>
                                            <th>Medida</th>
                                            <th>Unidad</th>
                                            <th>Precio promedio</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                        
                                            primas == 404 ? 0 :
                                            primas && primas.length ?
                                                  word || cat || li?
                                                          primas.filter(m => {
                                                            const porLetra = word ?  m.description.toLowerCase().includes(word.toLowerCase()) ||
                                                            m.item.toLowerCase().includes(word.toLowerCase()): true;
                                                            const porLinea = li ? m.lineaId == li : true;
                                                            const porCategoria = cat ? m.categoriumId == cat : true;

                                                            return porLetra && porLinea && porCategoria
                                                          }
                                                          ).map((pv, i) => {
                                                              return (
                                                                <ItemMP key={i+1} pv={pv} />
                                                              )
                                                          })
                                                  :
                                                  primas && primas.length ?
                                                    primas.map((pv, i) => {
                                                        return (
                                                            <ItemMP key={i+1} pv={pv} />
                                                        )
                                                    })
                                                : <ItemMP key={i+1} pv={pv} />
                                              : <h1>No hay resultados</h1>
                                        }
                                    </tbody>
                                </table>
                            }
                        </div>
                    </div>
                </div>
                {
                    params.get('prima') ?
                        <ShowMateriaPrima />
                    : null
                }
            </div>
            {
                params.get('w') == 'newMp' ?
                    <ModalNewMp />
                :params.get('w') == 'updateMp' ?
                    <ModaUpdateMp />    
                : null
            }
        </div>
    )
}