import React, { useEffect, useState } from "react";
import ItemToSelect from "./itemToSelect";
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from "react-redux";

export default function SearchKits(){

    const dispatch = useDispatch();
    const primasStore = useSelector(store => store.prima);
    const {primas, loadingPrimas } = primasStore;

    const kitStore = useSelector(store => store.kits);
    const {kit, loadingKit} = kitStore;
    const [cat, setCat] = useState(null);
    const [li, setLi] = useState(null);
    const system = useSelector(store => store.system);
    const { categorias, lineas } = system;

    const [word, setWord] = useState(null);
    const [metodo, setMetodo] = useState(null); // METODO DE BUSQUEDA LINEA O CATEGORIA
    const [filter, setFilter] = useState(primas);
    

    useEffect(() => {
        if(!primas){
            dispatch(actions.axiosToGetPrimas(false))
        }
        setFilter(primas)
    }, [primas])
    return (
        <div className="containerRightSelect">
            <div className="topSelect">
                <div className="titleSelect">
                    <h3>Selecciona un item</h3>
                </div>
                <div className="searchInput">
                    <input type="text" placeholder='Buscar aquí materia prima' onChange={(e) => {
                        return setWord(e.target.value)
                    }}/>
                </div>
            </div>
            <div className="resultsToSelect">
                <div className="filters">
                    <div className="divideFilters">
                        
                        <div>
                            <label htmlFor="">Categorías</label><br />
                            <select name="" id="" onChange={(e) => {
                                return setCat(e.target.value)
                            }}>
                                <option value="">Seleccionar</option>
                                {
                                    categorias && categorias.length ?
                                    categorias.map((c, i) => {
                                        return (
                                            <option key={i+1} value={c.id}>{c.name.toUpperCase()}</option>
                                        )
                                    })
                                    :null
                                }

                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Líneas</label><br />
                            <select name="" id="" onChange={(e) => {
                                return setLi(e.target.value)
                            }}>
                                <option value="">Seleccionar</option>
                                { 
                                    lineas && lineas.length ? 
                                    lineas.map((c, i) => {
                                        return (
                                            c.type == 'MP' ?
                                            <option key={i+1} value={c.id}>{c.name.toUpperCase()}</option>
                                            : null
                                        )
                                    })
                                    :null
                                }

                            </select>
                        </div>
                    </div>
                </div>
                <div className="tabla">
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Unidad</th>
                            <th>Medida / Cant.</th>
                            <th>Precio Promedio</th>
                            <th></th>

                        </tr>
                    </thead>
                    <tbody>
                        {   
                            primas && primas.length ? 
                                    primas.filter(m => {
                                        const porTexto = word ? m.description.toLowerCase().includes(word.toLowerCase()) ||
                                        m.id == Number(word)
                                        : true 
                                        const porCategoria = cat ? m.categoriumId == cat : true;
                                        const porLinea = li ? m.lineaId == li : true; 
                                        const diferente = kit.materia && kit.materia.length ? !kit.materia.some(l => l.id === m.id) : true;
                                        return porTexto && porCategoria && porLinea && diferente;
                                    }
                                        ).map((pv, i) => { 
                                            console.log(pv)
                                            return (
                                                <ItemToSelect kit={pv} key={i+1} />
                                            ) 
                                        })
                            :<span>Noada</span>
                        }
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    )
}