import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/action/action';
import dayjs from 'dayjs';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import ZoneForMoveItem from './moveExistencias';

export default function ItemsLists(){
    const almacen = useSelector(store => store.almacen);
    
    const { productosBodega, loadingProductosBodega } = almacen;
    
    const [options, setOptions] = useState(null);
    const [productos, setProducto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();

    const searchKitsWithFunction = async (query) => {
        
        if(!query || query == '') return setProducto(null);
            setLoading(true);
            setProducto(null);

        if(!params.get('bodega') || params.get('bodega') == '1' || params.get('bodega') == '3'){
            const search = await axios.get('api/inventario/get/bodegas/items/query/search', {
                params: { 
                    query: query,
                    bodegaId: params.get('bodega') ? params.get('bodega') : 1
                },
            })
            .then((res) => {
                setProducto(res.data)
            })
            .catch(err => {
                setProducto(null)
                return null
            })
            .finally(() => setLoading(false))
            
            return search
        } else{
             const search = await axios.get('api/inventario/get/bodegas/items/query/pt/search', {
                params: { 
                    query: query,
                    bodegaId: params.get('bodega') ? params.get('bodega') : 2
                },
            })
            .then((res) => {
                setProducto(res.data)
            })
            .catch(err => {
                setProducto(null)
                return null
            })
            .finally(() => setLoading(false))
            return search
        }
    } 

    useEffect(() => {
        setProducto(null)
    }, [options])

    return (
        <div className="listResultsData">
            <div className="containerKits">
                <div className="dataFilters">
                    <div className="searchDataInput">
                        <input type="text" placeholder='Buscar materia prima' onChange={(e) => {
                            searchKitsWithFunction(e.target.value);
                        }}/>
                    </div>
                    <div className="containerDataFilters">
                        <div className="divide">
                            {
                                !options  ?
                                    <div className="tableData">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th></th>
                                                    <th>Cantidad</th>
                                                    <th>Comprometida</th>
                                                    <th></th>

                                                </tr>
                                            </thead> 
                                            {
                                                !productos ? 
                                            
                                            <tbody>
                                                {
                                                    !productosBodega || loadingProductosBodega ? <h1>Cargando...</h1>
                                                    : 
                                                    productosBodega == 404 || productosBodega == 'notrequest' ?
                                                    <h1>Sin resultados</h1>
                                                    : 
                                                    productosBodega?.length ? 
                                                        productosBodega.map((pt, i) => {
                                                            return (
                                                                    <tr key={i+1} onClick={() => {
                                                                        let ruta = pt.materiumId ? pt.materiumId : pt.productoId
                                                                        params.set('item', ruta) 
                                                                        params.set('show', 'Bodega');
                                                                        params.set('who', params.get('bodega'))
                                                                        setParams(params);
                                                                    }}>
                                                                        <td className="coding">
                                                                            <div className="code">
                                                                                <h3>{pt.materiumId} {pt.productoId}</h3>
                                                                            </div>
                                                                        </td>
                                                                        <td className="longer Almacen" > 
                                                                            <div className="titleNameKitAndData"> 
                                                                                <div className="extensionColor">
                                                                                    <div className="boxColor"></div>
                                                                                    <span>{dayjs(pt.createdAt.split('T')[0]).format('DD [de] MMMM [del] YYYY ')}</span>
                                                                                </div>
                                                                                <div className="nameData">
                                                                                    <h3>
                                                                                        {
                                                                                            pt.materium ?
                                                                                                `${pt.materium.description}`
                                                                                            : pt.producto?.item
                                                                                        }
                                                                                    </h3>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="middle Almacen" style={{fontSize:12}}>
                                                                            <span>{pt.cantidad}</span>
                                                                        </td>
                                                                        <td className="middle Almacen" style={{fontSize:12}}>
                                                                            <span>{pt.cantidadComprometida}</span>
                                                                        </td>
                                                                        <td className='middle Almacen'>
                                                                            <span>!</span>
                                                                        </td>
                                                                    </tr>
                                                            )
                                                        })
                                                    :null
                                                }

                                            </tbody>
                                                :
                                                productos == 404 ?  
                                                    <h1>Sin resultados</h1>
                                                :
                                                productos?.length ?
                                                    <tbody> 
                                                        {
                                                            productos?.length ? 
                                                                productos.map((pt, i) => {
                                                                    return (
                                                                            <tr key={i+1} onClick={() => {
                                                                                params.set('item', pt.id)
                                                                                setParams(params);
                                                                            }}>
                                                                                <td className="coding">
                                                                                    <div className="code">
                                                                                        <h3>{pt.id} Este</h3>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="longer Almacen" > 
                                                                                    <div className="titleNameKitAndData">
                                                                                        <div className="extensionColor">
                                                                                            <div className="boxColor"></div>
                                                                                            <span>{dayjs(pt.inventarios[0].createdAt.split('T')[0]).format('DD [de] MMMM [del] YYYY ')}</span>
                                                                                        </div>
                                                                                        <div className="nameData">
                                                                                            <h3>
                                                                                                {
                                                                                                    pt.description ?
                                                                                                        `${pt.description}`
                                                                                                    : 'Sin nombre'
                                                                                                }
                                                                                            </h3>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="middle Almacen" style={{fontSize:12}}>
                                                                                    <span>{pt.inventarios[0].cantidad}</span>
                                                                                </td>
                                                                                <td className="middle Almacen" style={{fontSize:12}}>
                                                                                    <span>{pt.inventarios[0].cantidadComprometida}</span>
                                                                                </td>
                                                                                <td className='middle Almacen'>
                                                                                    <span>!</span>
                                                                                </td>
                                                                            </tr>
                                                                    )
                                                                })
                                                            :null
                                                        }

                                                    </tbody>
                                                : null
                                            }
                                        </table>
                                    </div>
                                : options == 'moveExistencias' ?
                                    <ZoneForMoveItem productos={productos} loading={loading} />
                                : null
                            }
                            {
                                !params.get('bodega') || params.get('bodega') == 1 || params.get('bodega') == 2 ?
                                    <div className="ContainerResultFilter">
                                        {
                                            !options ?
                                                <div className="dataContainer">
                                                    <div className="boxContainer">
                                                        <div className="headerBox">
                                                            <h3>Productos</h3>
                                                        </div>
                                                        <h3 className='h3'>550</h3>
                                                    </div>
                                                    <div className="boxContainer">
                                                        <div className="headerBox">
                                                            <h3>Opciones rápidas</h3>
                                                        </div>
                                                        <button onClick={() => setOptions('moveExistencias')}>
                                                            <span>¡Ingresar existencias!</span>
                                                        </button><br />
                                                        <button>
                                                            <span>¡Sacar existencias!</span>
                                                        </button>
                                                    </div>
                                                    <div className="boxContainer">
                                                        <div className="headerBox">
                                                            <h3>Preguntas que te podrían interesar</h3>
                                                        </div>
                                                        <button onClick={() => setOptions('questions')}>
                                                            <span>¡Vamos!</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            : options == 'moveExistencias' ?
                                                <div className="dataContainer">
                                                    <div className="moving">
                                                        <div className="close">
                                                            <button onClick={() => setOptions(null)}>X</button>
                                                        </div> 
                                                        <div className="vector">
                                                            <img src="https://www.bindwise.com/blog/content/images/2018/06/invenotry-grow.gif" alt="" />
                                                            <h3>Moviendo existencias</h3>
                                                        </div>

                                                        <div className="confirmar">
                                                            <button>
                                                                <span>Confirmar</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            : options == 'questions' ?
                                                <div className="dataContainer">
                                                    <div className="moving">
                                                        <div className="close">
                                                            <button onClick={() => setOptions(null)}>X</button>
                                                        </div> 
                                                        <div className="vector"><br />
                                                            <h3>Preguntas express</h3>
                                                        </div>

                                                        <div className="questionsAsk">
                                                            <div className="itemQuestions">
                                                                <h3>¿Cúal es el producto con más movimientos?</h3>
                                                            </div>
                                                            <div className="itemQuestions">
                                                                <h3>¿10 Productos con menos existencias?</h3>
                                                            </div>
                                                            <div className="itemQuestions">
                                                                <h3>¿Cúales productos estan en negativo?</h3>
                                                            </div>
                                                            <div className="itemQuestions">
                                                                <h3>¿Cúales productos estan alerta?</h3>
                                                            </div>
                                                            <div className="itemQuestions">
                                                                <h3>¿Cúales productos estan en positivo?</h3>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            : null
                                        }

                                    </div>
                                :
                                    null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}