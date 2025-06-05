import React, { useEffect, useState } from "react";
import ItemToSelect from "./itemToSelect";
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from "react-redux";

export default function SearchKitsComercial(){

    const dispatch = useDispatch();
    

    const kitStore = useSelector(store => store.kits);
    const {kits, kit, loadingKits} = kitStore;

    const cotizacions  = useSelector(store => store.cotizacions);
    const { cotizacion } = cotizacions;

    const [word, setWord] = useState(null);
    const [metodo, setMetodo] = useState(null); // METODO DE BUSQUEDA LINEA O CATEGORIA
    const [filter, setFilter] = useState(kits);
    

    const [dis, setDis] = useState(false);
    useEffect(() => {
        dispatch(actions.axiosToGetKitsCompleted(false))
        setFilter(kits)
    }, [])
    return (
        <div className="containerRightSelect">
            <div className="topSelect">
                <div className="titleSelect">
                    <h3>Selecciona un kit</h3>
                </div>
                <div className="searchInput">
                    <input type="text" placeholder='Buscar aquí' onChange={(e) => {
                        setWord(e.target.value)
                    }}/>
                </div>
            </div>
            <div className="resultsToSelect">
                <div className="filters">
                    <div className="divideFilters">
                        <div>
                            <label htmlFor="">Categoría</label><br />
                            <select name="" id="">
                                <option value="">Seleccionar</option>
                                <option value="">A</option>
                                <option value="">B</option>
                                <option value="">C</option>

                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Línea</label><br />
                            <select name="" id="">
                                <option value="">Seleccionar</option>
                                <option value="">A</option>
                                <option value="">B</option>
                                <option value="">C</option>

                            </select>
                        </div>
                    </div>
                </div>
                <div className="tabla">
                <div className="priceFilter">
                    <label htmlFor="">Para distribuidor</label><br />
                    <input type="checkbox" onChange={(e) => {
                        setDis(!dis)
                    }}/>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th >Precio Promedio</th>
                            <th className="btns"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            kits && kits.length ?
                                kits.filter(m => {
                                        const porLetra = word ? m.name.toLowerCase().includes(word.toLowerCase()) : true
                                        return porLetra
                                    }
                                ).map((pv, i) => {
                                    return (
                                        <ItemToSelect kit={pv} key={i+1} dis={dis} />
                                    )
                                })
                            : <h1>No hay resultados de busqueda</h1>
                        }
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    )
}