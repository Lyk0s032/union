import React, { useEffect, useState } from 'react';
import ProductoItemGeneral from './itemProducto';
import GraphSerial from '../graph';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../../store/action/action';
import axios from 'axios';
import dayjs from 'dayjs';

export default function GeneralProductos({ produccion }){
    const dispatch = useDispatch();
    const admin = useSelector(store => store.admin)
    const { graphProducto, loadingGraphProducto} = admin;
    const sistema = useSelector(store => store.system);

    const { categorias, lineas }= sistema;
    // 1. Estado para guardar los valores de los filtros
    const [filtros, setFiltros] = useState({
        fechaInicio: '',
        fechaFin: '',
        categoriaId: '',
        lineaId: ''
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
        };

        try { 
            // La llamada a la API es más directa
            const response = await axios.get('/api/materia/producto/get/filter/search', { params })
            .then(res => {
                 setProductos(res.data);
                 return res;
            })
            .then(() => {
                dispatch(actions.axiosToGetGraphProducto(true, params.fechaInicio,  params.fechaFin, params.categoriaId, params.lineaId))

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
        if(!graphProducto){
            dispatch(actions.axiosToGetGraphProducto(true,atras, ahora))
        }
    }, [])
 
    return (
        <div className="listResultsData"> 
            <div className="containerKits">
                <div className="headerSeccion">
                    <h3>Producto terminado</h3>
                </div>
                <div className="topDataKits">
                    <div className="divide">
                        <div className="leftGraph">
                            <GraphSerial datos={graphProducto} carga={loadingGraphProducto} /> 
                        </div>
                        <div className="rightDataGraph">
                            <div className="containerDataRightGraph">
                                <div className="box">
                                    <div className="headerBox">
                                        <h3>Productos creados</h3>
                                    </div>
                                    <h3 className='h3'>{produccion.productos}</h3>
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
                                                        <ProductoItemGeneral producto={p} key={i+1} />
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
                                        <h3 className='h3'>{productos?.length ? productos.length : 0}</h3>
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