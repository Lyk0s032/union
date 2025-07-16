import axios from "axios";
import React, { useState } from "react";
import { AiTwotoneCheckCircle } from "react-icons/ai";
import { MdOutlineCheck } from "react-icons/md";
import * as actions from '../../../store/action/action';
import { useDispatch } from "react-redux";
import Analisis from "./analisis";

export default function ReporteTable(props){
    const requisicions = props.requisicions;
    const dispatch = useDispatch();
    const [ids, setIds] = useState([])
    
    const [data, setData] = useState(false);
    const [loading, setLoading] = useState(false);


    const getAnalisisServices = async () => {
        setLoading(true)
        const body = {
            ids
        }
        const getData = await axios.post('/api/requisicion/get/multiReq', body)
        .then((res) => {
            setData(res.data);
        }).catch(err => {
            console.log(err)
            dispatch(actions.HandleAlerta('No hemos logrado analizar esto', 'mistake'))
        })
        .finally(e => {
            setLoading(false)
        })
        return getData; 
    } 
    console.log(data)
    return (
        <div className="reporte">
            <table>
                <thead> 
                    <tr>
                        <th></th>
                        <th>Nombre</th>
                        <th>Fecha</th>
                        <th>Fecha necesaria</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    
                        requisicions == 404 || requisicions == 'notrequest' ? null :
                        requisicions && requisicions.length ?
                            requisicions.map((re, i) => {
                                return (
                                    <tr key={i+1} onClick={(e) => {
                                        ids.includes(re.id) ?
                                            setIds(ids.filter(l => l != re.id))  
                                        :
                                            setIds([
                                                ...ids,
                                                re.id
                                            ])
                                    }} className={ids.includes(re.id) ? "active" : null}>
                                        <td>
                                            <div className="check">
                                                <button> 
                                                    <MdOutlineCheck className="iconito" />
                                                </button>
                                            </div>
                                        </td>
                                        <td>{re.nombre}</td>
                                        <td>{re.fecha.split('T')[0]}</td>
                                        <td>{re.fechaNecesaria.split('T')[0]}</td>
                                        <td>{re.estado}</td>

                                    </tr>
                                )
                            })
                      : <h1>No hay resultados</h1>
                    }
                </tbody>
            </table>

            {
                ids.length ?
                    !data ?
                    <div className="modalBottomHidden">
                        <button onClick={() => {
                            !loading ? getAnalisisServices() : null 
                        }}>
                            {
                                loading ?
                                <span>Analizando...</span>
                                :
                                <span>Analizar {ids.length} requisiciones</span>
                            }
                        </button>
                    </div>
                    :
                    <div className="analisisData" >
                        <div className="hidden" onClick={() => {
                        setData(null)
                    }}></div>
                        <div className="containerAnalisisData">
                            <Analisis data={data} />
                        </div>
                    </div>
                : null
            }
        </div>
    )
}