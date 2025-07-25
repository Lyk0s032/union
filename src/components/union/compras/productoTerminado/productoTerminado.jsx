import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actions from './../../../store/action/action';
import Loading from "../../loading";
import ItemProductoTerminado from "./itemProductoTerminado";
import ModalNewProducto from "../modal/producto";
import ShowMateriaPrima from "../materia/showMateriaPrima";
import ShowProductoTerminado from "./showProductoTerminado";


export default function ProductoTerminado(){
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();
    const pm = useSelector(store => store.prima); 
    const { productos, loadingProductos } = pm;

    const system = useSelector(store => store.system); 
    const { categorias, lineas } = system

    const [word, setWord] = useState('');
    const [cat, setCat] = useState(null);
    const [li, setLi] = useState(null);

    useEffect(() => {
        dispatch(actions.axiosToGetProductos(true)) 
    }, []) 
    return (
        <div className="provider">
            <div className="containerProviders">
                <div className="topSection">
                    <div className="title">
                        <h1>Productos terminado {productos?.length && (`(${productos.length})`)}</h1>
                    </div>
                    <div className="optionsFast">
                        <nav>
                            <ul>
                                <li> 
                                    <button onClick={() => {
                                        params.set('w', 'newProduct');
                                        setParams(params);
                                    }}>
                                        <span>Agregar producto terminado</span>
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
                                <input type="text" placeholder="Buscar producto terminado" onChange={(e) => {
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
                                                            c.type == 'comercial' ?
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
                                                            l.type == 'comercial' ?
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
                                !productos || loadingProductos ?
                                    <Loading />
                                :
                                <table>
                                    <thead> 
                                        <tr>
                                            <th>Código</th>
                                            <th>Nombre</th>
                                            <th>Categoría</th>
                                            <th>Línea</th>
                                            <th>Precio promedio</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                         
                                            productos == 404 ? 0 :
                                            productos && productos.length ?
                                                          productos.filter(m => {
                                                            const porLinea = li ? m.lineaId == li : true;
                                                            const porCategoria = cat ? m.categoriumId == cat : true;

                                                            // Lógica de búsqueda por palabra (la parte que cambia)
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
                                                                        coincidePalabra = m.item.toLowerCase().includes(searchTerm);
                                                                    }
                                                                }

                                                                // El producto final debe cumplir con TODOS los filtros activos.
                                                                return porLinea && porCategoria && coincidePalabra;
                                                          }
                                                          ).map((pv, i) => {
                                                              return ( 
                                                                <ItemProductoTerminado key={i+1} pv={pv} />
                                                              )
                                                          })
                                              : <h1>No hay resultados</h1>
                                        }
                                    </tbody>
                                </table>
                            }
                        </div>
                    </div>
                </div>
                {
                    params.get('producto') ?
                        <ShowProductoTerminado />
                    : null
                }
            </div>
            {
                params.get('w') == 'newProduct' ?
                    <ModalNewProducto />
                :params.get('w') == 'updateMp' ?
                    <ModaUpdateMp />    
                : null
            }
        </div>
    )
}