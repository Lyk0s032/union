import React, { useEffect, useState } from 'react';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos, MdOutlineArrowOutward, MdOutlineOpenInNew } from "react-icons/md";
import { Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/action/action';
import ItemRequisicion from './itemRequisicion';
import Loading from '../../loading';

export default function Requisiciones(){
    const [show, setShow] = useState(null)

    const [params, setParams] = useSearchParams();

    const [requisiciones, setRequisiciones] = useState([]);

    // --- Función para analizar ---

    const addRequisicion = (reqs) => {
        setRequisiciones([...requisiciones, reqs])
    } 
    const removeReq = (reqs) => {
        setRequisiciones(reqs)
    }
    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion); 
    const { requisicions, loadingRequisicions } = req;
 
    const [word, setWord] = useState(null);
    const [reporte, setReporte] = useState(null);

    const conteo = (requisicions ?? []).reduce(
        (acc, r) => {
            if (r.estado === "pendiente") acc.pendiente++;
            if (r.estado === "comprando") acc.comprando++;
            if (r.estado === "comprado") acc.comprado++;
            return acc;
        },
        { pendiente: 0, comprando: 0, comprado: 0 }
    );

    useEffect(() => {           
        dispatch(actions.axiosToGetRequisicions(true)) 
    }, [])          
    return ( 
        <div className="panelDashboardType">
            {
                !requisicions || loadingRequisicions ?
                    <Loading />
                :
                requisicions == 'notrequest' || requisicions == 404 ?
                    <div className="messageBox">
                        <h1>No hay nada</h1>
                    </div>
                :
                    <div className="containerTypeDashboard">
                        <div className="topHeaderPanel"><br /><br />
                            <div className="divideHeader"> 
                                <div className="dataHeaderPrincipal">
                                    <div className="containerDataHeader">
                                        <div className="area">
                                            <h2 >Proyectos </h2> 
                                            <div className="optionsData">
                                                <button>Todas</button>
                                            </div>
                                        </div>
                                        <div className={!params.get('state') || params.get('state') == 'pendiente' ? 'datosBox Active' : 'datosBox'} onClick={() => {
                                            params.set('state', 'pendiente')
                                            setParams(params);
 
                                        }} >
                                            <span>Sin comprar</span>
                                            <h1>{conteo.pendiente}</h1>
                                        </div>
                                        <div className={params.get('state') == 'parcial' ? 'datosBox Active' : 'datosBox'} onClick={() => {
                                            params.set('state', 'parcial')
                                            setParams(params);
                                        }} >
                                            <span>Parcialmente</span>
                                            <h1>{conteo.comprando}</h1>
                                        </div>   
                                        <div className={!params.get('state') == 'completed' ? 'datosBox Active' : 'datosBox'} onClick={() => {
                                            params.set('state', 'completed')
                                            setParams(params);

                                        }} >
                                            <span>Finalizado</span>
                                            <h1>{conteo.comprado}</h1>
                                        </div>   
                                    </div>
                                </div>
                            </div>                   
                        </div>

                        <div className="dataDashboard">
                            <div className="containerDataDashboardNav">
                                <nav>
                                    <ul>
                                        <li onClick={() => setShow('items')}
                                            className={show == 'items' || !show ? 'Active' : null }>
                                            <div>
                                                <span>General</span>
                                            </div>
                                        </li>
                                        {/* <li  onClick={() => setShow('movimientos')}
                                            className={show == 'movimientos' ? 'Active' : null }>
                                            <div>
                                                <span>Movimientos</span>
                                            </div>
                                        </li>
                                        <li  onClick={() => setShow('graph')}
                                            className={show == 'graph' ? 'Active' : null }>
                                            <div>
                                                <span>Gráfica</span>
                                            </div>
                                        </li> */}
                                    </ul>
                                </nav>

                                {
                                    requisiciones?.length ?
                                        <button onClick={() => {
                                            dispatch(actions.getIDs(requisiciones))
                                        }}> 
                                            <span>Analizar</span>
                                        </button>
                                    : null 
                                }
                            </div>
                            <div className="dataRoutesDashboard">
                                <div className="table TableUX">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th></th>
                                                <th>Fecha</th>
                                                <th>Entrega</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                            requisicions?.length ? 
                                                requisicions.map((re, i) => {
                                                    return (
                                                        !params.get('state') || params.get('state') == 'pendiente' ?
                                                            re.estado == 'pendiente' ? 
                                                                <ItemRequisicion requisiciones={requisiciones} clean={removeReq} add={addRequisicion} requisicion={re} key={i+1} />
                                                            : null
                                                        : params.get('state') == 'parcial' ? 
                                                            re.estado == 'comprando' ?
                                                                <ItemRequisicion requisiciones={requisiciones} clean={removeReq} add={addRequisicion} requisicion={re} key={i+1} />
                                                            : null
                                                        : params.get('state') == 'completed' ?
                                                            re.estado == 'comprado' ?
                                                            <ItemRequisicion requisiciones={requisiciones} clean={removeReq} add={addRequisicion} requisicion={re} key={i+1} />
                                                        : null
                                                            :   <ItemRequisicion requisiciones={requisiciones} clean={removeReq} add={addRequisicion} requisicion={re} key={i+1} />
                                                    )
                                                })

                                            : null
                                            }

                                        </tbody>
                                    </table>
                                </div>
                                {
                                    !show || show == 'items' ?
                                        <h1>Aquí</h1>
                                    : show == 'movimientos' ?
                                        <Movimientos />
                                    : show == 'graph' ?
                                        <Graph />

                                    : null
                                }

                            </div>
                        </div>
                        {/* <Routes>
                            <Route path="/*" element={<GeneralProduction />} />
                            <Route path="/home/*" element={<GeneralComercial />} />
                            <Route path="/productos/*" element={<GeneralProductos />} />
                            <Route path="/comprando/*" element={<EnProcesoComercial />} />
                            <Route path="/usuarios/*" element={<GeneralUsuarios />} />
                        </Routes> */}
                    </div>
            }
        </div>
    )
}