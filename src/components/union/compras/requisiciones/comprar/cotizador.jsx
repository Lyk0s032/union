import React, { useEffect, useRef, useState } from 'react';
import * as actions from '../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ProveedorCotizador from './proveedorCotizador';
import CotizacionProviderItem from './itemProviderCotizacion';
import { useSearchParams } from 'react-router-dom';

export default function Cotizador({ total }){
    const [materias, setMaterias] = useState();
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);
    const { materiaIds, fastCotizacion, loadingFastCotizacion, itemsCotizacions } = req;

    // const [cotizacionesData, setCotizacionesData] = useState([]); // <-- aquí se guardan todas

    // // Recibe del hijo su objeto y lo guarda/reemplaza en el array
    // const handleCotizacionChange = (proveedorId, cotizacionObj) => {
    //     setCotizacionesData(prev => {
    //         const existe = prev.find(c => c.ProveedorId === proveedorId);
    //         if(existe){
    //             return prev.map(c => c.ProveedorId === proveedorId ? cotizacionObj : c);
    //         }
    //         return [...prev, cotizacionObj];
    //     });
    // };

    const getIdsSolo = () => {
    if (!materiaIds || !materiaIds.length) return [];

    if (params.get("s") === "materia") {
        return materiaIds.map(it => it.materiaId).filter(Boolean);
    } else if (params.get("s") === "productos") {
        return materiaIds.map(it => it.productoId).filter(Boolean);
    }
    return [];
    };
    
    const sendCotizarGeneral = async () => {
        const tipo = params.get("s"); // "materia" o "productos"
        const idsSolo = getIdsSolo();
        if (!idsSolo.length) return;

        dispatch(actions.gettingCotizacionFast(true));
        let endpoint = tipo === "materia"
            ? "/api/requisicion/get/cotizar/realTime/MP"
            : "/api/requisicion/get/cotizar/realTime/PT";

        try {
            const res = await axios.post(endpoint, { materiaIds: idsSolo });
            dispatch(actions.getCotizacionFast(res.data));
        } catch (err) {
            console.log(err);
            dispatch(actions.HandleAlerta("Negativo", "mistake"));
        } finally {
            dispatch(actions.gettingCotizacionFast(false));
        }
    };

    const cotizador = useRef(null);

    const comparar = () => {
        cotizador.current.classList.toggle('cotizadorViewActive')
    }

    useEffect(() => {
        sendCotizarGeneral();
    }, [materiaIds, params.get("s")]);



    return (
        <div className="cotizadorDash">
            <div className="containerCotizador">
                {
                    materiaIds?.length ?
                       
                        !fastCotizacion || loadingFastCotizacion ?
                            <h1>Cargando...</h1>
                        :
                        <div className="caja">
                            <div className="boxCotizaciones">
                                {
                                    fastCotizacion.proveedoresComunes.map((data, i) => {
                                        return (
                                            <ProveedorCotizador provider={data} key={i+1} />
                                        )
                                    })
                                }
                                
                            </div>
                            <button className="comparar" onClick={() => comparar()}>
                                <span>Comparar cotizaciones</span>
                            </button>
                        </div>

                    : null
                }
                    <div className="divPricesNeed">
                        <div className="containerPricesNeed">
                            <span>Inversión  faltante apróximada</span>
                            <h1>$ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(total).toFixed(0))}</h1>
                        </div>
                    </div>
            </div>
            <div className="cotizadorView" ref={cotizador}>
                <div className="containerCotizadorView">
                    <div className="topClose"> 
                        <button onClick={() => comparar()}>
                            <span>
                                Close
                            </span>
                        </button> 
                    </div>
                    <div className="cotizaciones">
                        <div className="containerCotizaciones">
                            {
                                materiaIds?.length ?
                                
                                    !fastCotizacion || loadingFastCotizacion ?
                                        <h1>Cargando...</h1>
                                    :
                                        fastCotizacion.proveedoresComunes.map((data, i) => {
                                            return (
                                                <CotizacionProviderItem 
                                                provider={data} key={i+1} />
                                            )
                                        })
                                            
                                : <h1>no hay</h1>
                            }

                        </div>

                        <button>Crear cotizaciones</button>
                    </div>
                </div>
            </div>
        </div>
    )
}