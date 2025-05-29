import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import KitItem from "./kitItem";
import ModalNewKit from "./modal/newKit";
import * as actions from '../../store/action/action';
import { useDispatch, useSelector } from "react-redux";
import Loading from "../loading";
import LineaItem from "./lineaItem";

export default function Lineas(){
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();
    const kitsState = useSelector(store => store.kits);
    const { kits, loadingKits } = kitsState;

    const [cat, setCat] = useState(null);
    const [li, setLi] = useState(null);
    const [ex, setEx] = useState(null);

    const system = useSelector(store => store.system);
    const { porcentajes, loadingPorcentaje } = system;

    const [state, setState] = useState('completa');       
    const [word, setWord] = useState(null);
        

    useEffect(() => {
        dispatch(actions.axiosToGetPorcentajes(false))
    }, [])
    return (
        <div className="provider">
            {console.log(porcentajes)}
            <div className="containerProviders">
                <div className="topSection">
                    <div className="title">
                        <h1>Líneas </h1>
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

                        <div className="table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Nombre de linea</th>
                                        <th>Porcentaje final</th>
                                        <th>Porcentaje distribuidor</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                
                                    <tbody>
                                    {
                                            !porcentajes || loadingKits ?
                                                <Loading />
                                            : porcentajes == 404 || porcentajes == 'notrequest' ? null
                                            : porcentajes && porcentajes.length ?
                                                porcentajes.filter(m => {
                                                        const porLetra = word ? m.name.toLowerCase().includes(word.toLowerCase()) : true
                                                        return porLetra
                                                    } 
                                                        ).map((pv, i) => { 
                                                            return (
                                                                <LineaItem key={i+1} linea={pv} /> 
                                                            )
                                                        })

                                            : <h1>No hay resultados</h1>
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
                params.get('w') == 'newKit' ?
                    <ModalNewKit />
                // :params.get('w') == 'updateMp' ?
                //     <ModaUpdateMp />    
                : null
            }
        </div>
    )
}