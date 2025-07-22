import React, { useEffect, useState } from 'react';
import KitItemGeneral from './itemKit';
import dayjs from 'dayjs';
import GraphSerial from './graph';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../store/action/action';

export default function GeneralKits({ produccion }){
const dispatch = useDispatch();
    const admin = useSelector(store => store.admin)
    const { graphKits, loadingGraphKits} = admin;
    const sistema = useSelector(store => store.system);

    const { categorias, lineas, extensiones }= sistema;
    // 1. Estado para guardar los valores de los filtros
    const [filtros, setFiltros] = useState({
        fechaInicio: '',
        fechaFin: '',
        categoriaId: '',
        lineaId: '',
        extensionId: ''
    });
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(false);

    const handleChange = (e) => {
        setFiltros({
            ...filtros,
            [e.target.name]: e.target.value
        });
    };

    // 5. Función para ejecutar la búsqueda
        // 2. Función de búsqueda modificada para usar axios
    const handleSearch = async () => {
        setCargando(true);
        setProductos([]);

        // axios construye los parámetros de la URL por nosotros
        const params = {
            fechaInicio: filtros.fechaInicio || undefined,
            fechaFin: filtros.fechaFin || undefined,
            categoriaId: filtros.categoriaId || undefined,
            lineaId: filtros.lineaId || undefined,
            extensionId: filtros.extensionId || undefined
        };

        try { 
            // La llamada a la API es más directa
            const response = await axios.get('/api/kit/get/filter/search', { params })
            .then(res => {
                 setProductos(res.data);
                 return res;
            })
            .then(() => {
                dispatch(actions.axiosToGetGraphKits(true, params.fechaInicio,  params.fechaFin, params.categoriaId, params.lineaId))

            }) // Con axios, los datos ya vienen en formato JSON en `response.data`
           
            return response
        } catch (error) {
            // axios trata los errores como 404 como una excepción
            if (error.response && error.response.status === 404) {
                // Si el error es 404, nos aseguramos de que la lista esté vacía
                setProductos([]);
            } else {
                console.error("Error al buscar productos:", error);
            }
        } finally {
            setCargando(false);
        }
    };
    const ahora = dayjs().format('YYYY-MM-DD')
    const atras =  dayjs(ahora).subtract(6, 'month').format('YYYY-MM-DD');
    useEffect(() => {
        if(!graphKits){
            dispatch(actions.axiosToGetGraphKits(true,atras, ahora))
        }
    }, [])
    return (
        <div className="listResultsData">
            <div className="containerKits">
                <div className="headerSeccion">
                    <h3>Kit's</h3>
                </div>
                <div className="topDataKits">
                    <div className="divide">
                        <div className="leftGraph">
                            <GraphSerial datos={graphKits} carga={loadingGraphKits} /> 
                        </div>
                        <div className="rightDataGraph">
                            <div className="containerDataRightGraph">
                                <div className="box">
                                    <div className="headerBox">
                                        <h3>Kit's creados</h3>
                                    </div>
                                    <h3 className='h3'>{produccion.completos + produccion.desarrollo}</h3>
                                </div>
                                <div className="box">
                                    <div className="headerBox">
                                        <h3>Kit's en completos</h3>
                                    </div>
                                    <h3 className='h3'>{produccion.completos}</h3>
                                </div>
                                <div className="box">
                                    <div className="headerBox">
                                        <h3>Kits en Desarrollo</h3>
                                    </div>
                                    <h3 className='h3'>{produccion.desarrollo}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="dataFilters">
                    <div className="filtersOptions">
                        <div className="containerFiltersOption">
                            <div className="time">
                                <label htmlFor="">Fecha inicio</label><br />
                                <input type="date"  name="fechaInicio" value={filtros.fechaInicio} onChange={handleChange} />
                            </div>
                            <div className="time">
                                <label htmlFor="">Fecha fin</label><br />
                                <input type="date" name="fechaFin" value={filtros.fechaFin} onChange={handleChange} />
                            </div>
                            <div className="categoriums">
                                <div className="inputDiv">
                                    <label htmlFor="">Categorías</label><br />
                                    <select name="categoriaId" id="" onChange={handleChange} value={filtros.categoriaId}>
                                        <option value="">Seleccionar</option>
                                        {
                                            categorias?.length ?
                                                categorias.map((c, i) => {
                                                    return (
                                                        <option key={i+1} value={c.id}>{c.name}</option>
                                                    )
                                                })
                                            : null
                                        }
                                    </select>
                                </div>
                                <div className="inputDiv">
                                    <label htmlFor="">Línea</label><br />
                                    <select name="lineaId" id="" onChange={handleChange} value={filtros.lineaId}>
                                        <option value="">Seleccionar</option>
                                        {
                                            lineas?.length ?
                                                lineas.map((c, i) => {
                                                    return (
                                                        <option key={i+1} value={c.id}>{c.name}</option>
                                                    )
                                                })
                                            : null
                                        }
                                    </select>
                                </div>
                                <div className="inputDiv">
                                    <label htmlFor="">Extensión</label><br />
                                    <select name="lineaId" onChange={handleChange} value={filtros.extensionId}>
                                        <option value="">Seleccionar</option>
                                        {
                                            extensiones?.length ?
                                                extensiones.map((c, i) => {
                                                    return (
                                                        <option key={i+1} value={c.id}>{c.name}</option>
                                                    )
                                                })
                                            : null
                                        }
                                    </select>
                                </div>    
                                <div className="inputDiv">
                                    <button onClick={() => handleSearch()} disabled={cargando}>
                                        <span>{cargando ? 'Buscando...' : 'Buscar'}</span>
                                    </button>
                                </div>
                            
                            </div>
                        </div>
                    </div>
                    <div className="containerDataFilters">
                        <div className="divide">
                            <div className="tableData">
                                 {
                                    productos?.length ?
                                     <table>
                                        <tbody>
                                            {
                                                productos.map((p, i) => {
                                                    return (
                                                        <KitItemGeneral producto={p} key={i+1} />
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                    :
                                    <h1>Sin resultados</h1>
                               }
                            </div>
                            <div className="ContainerResultFilter">
                                <div className="dataContainer">
                                    <div className="boxContainer">
                                        <div className="headerBox">
                                            <h3>Resultados</h3>
                                        </div>
                                        <h3 className='h3'>{productos?.length ? productos.length : null}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}