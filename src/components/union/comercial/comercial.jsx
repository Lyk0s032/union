import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ModalNewKit from "./modal/newCotizacion";
import CotizacionItem from "./cotizacionItem";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../store/action/action';
import ModalNewCotizacion from "./modal/newCotizacion";

export default function ComercialPanel(){
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();
    const cotizacions = useSelector(store => store.cotizacions);
    const { cotizaciones, loadingCotizaciones } = cotizacions;

    const [state, setState] = useState('completa');      
    const [word, setWord] = useState(null);
    const [metodo, setMetodo] = useState(null); // METODO DE BUSQUEDA LINEA O CATEGORIA
    const [filter, setFilter] = useState(cotizaciones);
        
    console.log(cotizaciones)

    useEffect(() => {
        dispatch(actions.axiosToGetCotizaciones(true))
    }, []) 
    return (
        <div className="provider">
            <div className="containerProviders">
                <div className="topSection">
                    <div className="title">
                        <h1>Cotizaciones</h1>
                    </div>
                    <div className="optionsFast">
                        <nav>
                            <ul>
                                <li> 
                                    <button onClick={() => {
                                        params.set('w', 'newCotizacion');
                                        setParams(params);
                                    }}>
                                        <span>Nueva Cotización</span>
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
                                <input type="text" placeholder="Buscar cotización" />
                            </div>
                        </div>
                        <div className="table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Cliente</th>
                                        <th>fecha</th>
                                        <th>Valor</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        !cotizaciones || loadingCotizaciones ?
                                            <h1>Cargando</h1>
                                        :
                                        cotizaciones && cotizaciones.length ?
                                            cotizaciones.map((coti, i) => {
                                                return (
                                                    <CotizacionItem cotizacion={coti} key={i+1} />
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
                : null
            }
        </div>
    )
}