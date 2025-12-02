import React, { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { useSearchParams } from 'react-router-dom';
import ItemProject from './itemProject';
import Project from './proyecto/project';
import * as actions from './../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';

export default function RouteProyects(){
    const [params, setParams] = useSearchParams();
    const [word, setWord] = useState(null);
    const req = useSelector(store => store.requisicion); 
    const { requisicions, loadingRequisicions } = req;

    const dispatch = useDispatch();

    console.log('requisiciones', requisicions)
    useEffect(() => {
        dispatch(actions.axiosToGetRequisicions(true)) 
    }, [])
    return (
        <div className="provider">
            <div className="containerProviders Dashboard-grid">
                <div className="topSection">
                    <div className="title">
                        <h1>Proyectos en producción</h1>
                    </div>
                    <div className="optionsFast">
                        <nav>
                            <ul>
                                <li style={{marginRight:5}}>
                                    <button>
                                        <span>Descargar</span>
                                    </button>
                                </li>
                                <li style={{marginRight:5}}>
                                    <button>
                                        <span>Proceso de compra</span>
                                    </button>
                                </li>
                            </ul>
                        </nav> 
                    </div>
                </div>
                <div className="listProviders">
                    <div className="containerListProviders">
                        <div className="topSearchData">
                            <div className="divideSearching">
                                <div className="data">
                                    <h3>Cantidad en el sistema 5</h3>
                                    <button onClick={() => {
                                        params.set('w', 'newMp');
                                        setParams(params);
                                    }}>
                                        <AiOutlinePlus className="icon" />
                                    </button>
                                </div>
                                <div className="filterOptions">
                                    <div className="inputDivA">
                                        <div className="inputUX" style={{width:'80%'}}>
                                            <input type="text" placeholder="Buscar aquí..." onChange={(e) => {
                                                setWord(e.target.value)
                                            }} />
                                        </div>
                                        <div className="filtersUX">
                                            <select name="" id=""  style={{width:150}}>
                                                <option value="">Categoría</option>
                                            </select>

                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div><br />

                        <div className="table TableUX">
                                <table >
                                    <thead> 
                                        <tr>
                                            <th>Prioridad</th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th>Progreso</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            requisicions?.length ? 
                                                requisicions.map((re, i) => {
                                                    return (
                                                        <ItemProject item={re} key={i+1} />
                                                    )
                                                })

                                            : null
                                        }   
                                    </tbody>
                                </table>
                        </div>
                    </div>
                </div>
            </div>
                {
                    params.get('project') ?
                        <Project />
                    : null
                }
        </div>
    )
}