import React, { useEffect, useState, useMemo } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { useSearchParams } from 'react-router-dom';
import ItemProject from './itemProject';
import Project from './proyecto/project';
import * as actions from './../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';

export default function RouteProyects(){
    const [params, setParams] = useSearchParams();
    const [word, setWord] = useState(''); 
    const req = useSelector(store => store.requisicion);
    const { requisicions, loadingRequisicions } = req;

    const dispatch = useDispatch();

    console.log('requisiciones', requisicions)
    useEffect(() => {
        dispatch(actions.axiosToGetRequisicions(true)) 
    }, [])

    // Filtrar proyectos por nombre o número de cotización
    const proyectosFiltrados = useMemo(() => {
        if (!word || word.trim() === '') {
            return requisicions || [];
        }

        const searchTerm = word.toLowerCase().trim();
        
        return (requisicions || []).filter((item) => {
            // Buscar por nombre del proyecto
            const nombreMatch = item.nombre?.toLowerCase().includes(searchTerm);
            
            // Buscar por número de cotización (21719 + cotizacionId)
            const numeroCotizacion = String(21719 + (item.cotizacionId || 0));
            const numeroMatch = numeroCotizacion.includes(searchTerm);
            
            return nombreMatch || numeroMatch;
        });
    }, [requisicions, word]);
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
                                    <h3>Cantidad en el sistema</h3>
                                    <h3>{word ? proyectosFiltrados?.length : requisicions?.length}</h3>
                                </div>
                                <div className="filterOptions">
                                    <div className="inputDivA">
                                        <div className="inputUX" style={{width:'100%'}}>
                                            <input type="text" placeholder="Buscar aquí..." onChange={(e) => {
                                                setWord(e.target.value)
                                            }} />
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
                                            proyectosFiltrados?.length ? 
                                                proyectosFiltrados.map((re, i) => {
                                                    return (
                                                        <ItemProject item={re} key={i+1} />
                                                    )
                                                })

                                            : word ? (
                                                <tr>
                                                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                                        No se encontraron proyectos que coincidan con "{word}"
                                                    </td>
                                                </tr>
                                            ) : null
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