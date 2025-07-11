import React, { useEffect, useState } from "react";
import ItemToSelect from "./itemToSelect";
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

export default function SearchKitsComercial({ number }){

    const dispatch = useDispatch();
    

    const kitStore = useSelector(store => store.kits);
    const {kits, kit, loadingKits} = kitStore;

    const cotizacions  = useSelector(store => store.cotizacions);
    const { cotizacion } = cotizacions;

    
    const [kitSearch, setSearchKit] = useState();
    const [loading, setLoading] = useState(false);
    const searchKitsWithFunction = async (query) => {
        if(!query || query == '') return setSearchKit(null);
        setLoading(true);
        setSearchKit(null);

        const search = await axios.get('/api/kit/get/cotizar/search', {
            params: { query: query },
        })
        .then((res) => {
            setSearchKit(res.data)
        })
        .catch(err => {
            console.log(err);
            setSearchKit(null)
            return null
        })
        .finally(e => setLoading(false))
        return search
    }

    const [dis, setDis] = useState(false);
    const [final, setFinal] = useState(true);

    const change = () => {
        if(dis){
            setFinal(false)
        }else{
            setFinal(true)
        }
    }
    useEffect(() => {
        change()
    }, [dis])
    return (
        <div className="containerRightSelect">
            <div className="topSelect">
                {/* <div className="titleSelect">
                    <h3>Selecciona un kit</h3>
                </div> */}
                {/* <div className="searchInput">
                    <input type="text" placeholder='Buscar aquí' onChange={(e) => {
                        searchKitsWithFunction(e.target.value)
                    }}/>
                </div> */}

                <div className="boxAllInOne">
                    <div className="containerBoxAll">
                        <div className="containerSearch">
                            <div className="searchInputDiv">
                                <div className="inputDiv">
                                    <input type="text" placeholder="Pedestal 2X1" onChange={(e) => {
                                        searchKitsWithFunction(e.target.value)
                                    }} />
                                </div>
                                <div className="filtersInput">
                                    <select name="" id="">
                                        <option value="">Categoría</option>
                                    </select>
                                    <select className="filterRight" name="" id="">
                                        <option value="">Linea</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="typePrices">
                            <div className="chooseFilter">
                                <button className={dis ? 'distribuidor' : null} onClick={() => {
                                    setDis(!dis)
                                }}>
                                    <span>Distribuidor</span>
                                </button>
                                <button className={!dis ? 'final' : null} onClick={() => {
                                    setDis(false) 
                                }}>
                                    <span>Final</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="resultsToSelect">
                <div className="tabla">
                
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th ></th>
                            <th className="btns"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            !loading ? 
                                <div className="boxMessage">
                                    <img src="https://mir-s3-cdn-cf.behance.net/project_modules/source/eb7e7769321565.5ba1db95aab9f.gif" />
                                </div>
                            :
                            kitSearch == 404 || kitSearch == 'notrequest' ?
                                <div className="boxMessage">
                                    <h3>Sin resultados</h3>
                                </div>
                            :
                            kitSearch && kitSearch.length ?
                                kitSearch.map((pv, i) => {
                                    return (
                                        <ItemToSelect kit={pv} key={i+1} dis={dis} number={number} />
                                    )
                                })
                            : null
                        }
                    </tbody><br /><br /><br /><br /><br />
                </table>
                </div>
            </div>
        </div>
    )
}