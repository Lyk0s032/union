import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actions from './../../../store/action/action';
import Loading from "../../loading";
import ItemRequisicion from "./itemRequisicion";
import ShowRequisicion from "./requisicion";
import ReporteTable from "./reporte";


export default function GeneralCompras(){
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion); 
    const { requisicions, loadingRequisicions } = req;

    const [word, setWord] = useState(null);
    const [reporte, setReporte] = useState(null);

    useEffect(() => {
        dispatch(actions.axiosToGetRequisicions(true)) 
    }, [])
    return (
        <div className="provider">
            <div className="containerProviders">
                <div className="topSection">
                    <div className="title">
                        {
                            requisicions == 404 || requisicions == 'notrequest' ?
                                <h1>¡Hola! La bandeja de requisiciones esta limpia.</h1>
                            :
                            requisicions && requisicions.length ?
                                <h1>¡Hola! Tenemos {requisicions.length } requisiciones</h1>
                            :
                                <h1>¡Hola! La bandeja de requisiciones esta limpia.</h1>
                        }
                    </div>
                    <div className="btnOptions">
                        <button onClick={(e) => {
                            setReporte(!reporte)
                        }} className={!reporte ? `btnReporte Open` : 'btnReporte Close'}>
                            <span>{!reporte ? 'Seleccionar' : 'Cancelar'}</span>
                        </button>
                    </div>
                </div>
                <div className="listProviders">
                    <div className="containerListProviders">
                        <div className="topSearch">
                            <div className="containerTopSearch">
                                <input type="text" placeholder="Buscar requisiciones" onChange={(e) => {
                                    setWord(e.target.value)
                                }}/>
                            </div>
                        </div>

                        <div className="table">
                            {
                                !requisicions || loadingRequisicions ?
                                    <Loading />
                                :
                                reporte ?
                                    <ReporteTable requisicions={requisicions} />
                                :
                                <table>
                                    <thead> 
                                        <tr>
                                            <th>Código</th>
                                            <th>Nombre</th>
                                            <th>Cliente</th>
                                            <th>Fecha</th>
                                            <th>Fecha necesaria</th>
                                            <th>Estado</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                        
                                            requisicions == 404 || requisicions == 'notrequest' ? null :
                                            requisicions && requisicions.length ?
                                                word ?
                                                    requisicions.filter(m => {
                                                        const porLetra = word ?  m.nombre.toLowerCase().includes(word.toLowerCase()) ||
                                                        m.id == word: true;
                                                        return porLetra 
                                                      }
                                                  ).map((re, i) => {
                                                      return (
                                                        <ItemRequisicion key={i+1} requisicion={re}/>
                                                      )
                                                    })
                                                :
                                                requisicions.map((re, i) => {
                                                    return (
                                                        <ItemRequisicion key={i+1} requisicion={re}/>
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
                    params.get('requisicion') ?
                        <ShowRequisicion />
                    : null
                }
            </div>

        </div>
    )
}