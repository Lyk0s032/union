import React, { useEffect, useRef, useState } from 'react';
import * as actions from '../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ProveedorCotizador from './proveedorCotizador';
import CotizacionProviderItem from './itemProviderCotizacion';

export default function Cotizador(){
    const [materias, setMaterias] = useState();

    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);
    const { materiaIds, fastCotizacion, loadingFastCotizacion } = req;

    const sendCotizar = async () => {
        dispatch(actions.gettingCotizacionFast(true))
        let body = {
            materiaIds
        }
        const send = axios.post('/api/requisicion/get/cotizar/realTime/MP', body)
        .then((res) => {
            console.log(res)
            dispatch(actions.getCotizacionFast(res.data))
        })
        .catch(err => {
            dispatch(actions.HandleAlerta('Negativo', 'mistake'))
        })
        .finally(() => {
            dispatch(actions.gettingCotizacionFast(false))
        })
        return send;
    }

    const cotizador = useRef(null);

    const comparar = () => {
        cotizador.current.classList.toggle('cotizadorViewActive')
    }
    useEffect(() => {
        sendCotizar()
    }, [materiaIds])

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
                                    materiaIds.map((id, i) => {
                                        return (
                                            <ProveedorCotizador />
                                        )
                                    })
                                }
                                
                            </div>
                            <button className="comparar" onClick={() => comparar()}>
                                <span>Comparar cotizaciones</span>
                            </button>
                        </div>

                    : <h1>no hay</h1>
                }
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
                            <CotizacionProviderItem />
                            <CotizacionProviderItem />
                            <CotizacionProviderItem />
                            <CotizacionProviderItem />
                            <CotizacionProviderItem />
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}