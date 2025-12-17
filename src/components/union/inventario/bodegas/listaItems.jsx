import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/action/action';
import dayjs from 'dayjs';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import ZoneForMoveItem from './moveExistencias';
import { AiOutlineCheckCircle, AiOutlineExclamationCircle, AiOutlinePlus } from 'react-icons/ai';

export default function ItemsLists(){
    const almacen = useSelector(store => store.almacen);
    
    const { productosBodega, loadingProductosBodega } = almacen;
    
    const [options, setOptions] = useState(null);
    const [productos, setProducto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();

    console.log(productosBodega)
    const searchKitsWithFunction = async (query) => {
        
        if(!query || query == '') return setProducto(null);
            setLoading(true);
            setProducto(null);

        if(!params.get('bodega') || params.get('bodega') == '1' || params.get('bodega') == '4'){
            const search = await axios.get('api/inventario/get/bodegas/items/query/search', {
                params: {  
                    query: query,
                    bodegaId: params.get('bodega') ? params.get('bodega') : 1
                },
            })
            .then((res) => {
                console.log('resultado busqueda', res.data)
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
                        <input type="text" placeholder={
                            params.get('bodega') == '1' ? 'Buscar materia prima' 
                            : params.get('bodega') == '4' ? 'Buscar materia prima en proceso'
                            : params.get('bodega') == '2' ? 'Buscar producto terminado' 
                            : params.get('bodega') == '5' ? 'Buscar kit o producto terminado en proceso'
                            : null
                        } onChange={(e) => {
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
                                                    <th>Item</th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
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
                                                    productosBodega && productosBodega.items?.length ? 
                                                        productosBodega.items.map((pt, i) => {
                                                            return (
                                                                    <tr key={i+1} onClick={() => {
                                                                        let ruta = pt.itemId
                                                                        params.set('item', ruta) 
                                                                        params.set('show', 'Bodega');
                                                                        if(!params.get('bodega')){
                                                                            params.set('bodega', 1)
                                                                        }
                                                                        !params.get('bodega') ?
                                                                            params.set('who', 1)
                                                                        : params.set('who', params.get('bodega'))
                                                                        setParams(params);
                                                                    }}>
                                                                        <td className="coding">
                                                                            <div className="code">
                                                                                <h3>{pt.itemId}</h3>
                                                                            </div>
                                                                        </td>
                                                                        <td className="longer Almacen" > 
                                                                            <div className="titleNameKitAndData"> 
                                                                                <div className="extensionColor">
                                                                                    <div className="boxColor"></div>
                                                                                    <span>{pt.itemType == 'MP' ? 'Materia prima' : pt.itemType == 'PT' ? 'Producto terminado' : 'Por definir'}</span>
                                                                                </div>
                                                                                <div className="nameData">
                                                                                    <h3>
                                                                                        {
                                                                                            pt.itemType == 'MP' ?
                                                                                                `${pt.itemData.description}`
                                                                                            : pt.itemData.item
                                                                                        }
                                                                                    </h3>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="middle Almacen" style={{fontSize:12}}>
                                                                            {/* <span>{pt.fullPiecesCount}</span> */}
                                                                        </td>
                                                                        <td className="middle Almacen" style={{fontSize:12}}>
                                                                            {/* <span>{pt.totalMeters} {pt.itemData.unidad}</span> */}
                                                                        </td>
                                                                        <td className='middle Almacen'>
                                                                            {/* {
                                                                                Number(pt.cantidad) < Number(pt.cantidadComprometida)   ?
                                                                                    <AiOutlineExclamationCircle className="icon Exclamation" />
                                                                                : Number(pt.cantidad) == Number(pt.cantidadComprometida) ?
                                                                                    <AiOutlinePlus className="icon" />
                                                                                : 
                                                                                    <AiOutlineCheckCircle className="icon" />
                                                                            } */}
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
                                                                    console.log('pt por busqueda', pt)
                                                                    return (
                                                                            <tr key={i+1} onClick={() => {
                                                                                params.set('item', pt.id)
                                                                                params.set('show', 'Bodega');
                                                                                params.set('who', params.get('bodega')) 
                                                                                
                                                                                setParams(params);
                                                                            }}>
                                                                                <td className="coding"> 
                                                                                    <div className="code">
                                                                                        <h3>{pt.id} </h3>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="longer Almacen" > 
                                                                                    <div className="titleNameKitAndData">
                                                                                        <div className="extensionColor">
                                                                                            <div className="boxColor"></div>
                                                                                            <span>{pt?.inventarios.length && ( dayjs(pt.inventarios[0].createdAt.split('T')[0]).format('DD [de] MMMM [del] YYYY ') )}</span>
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
                                                                                    {/* <span>{pt?.inventarios.length && (pt.inventarios[0].cantidad)}</span> */}
                                                                                </td>
                                                                                <td className="middle Almacen" style={{fontSize:12}}>
                                                                                    {/* <span>{pt?.inventarios.length && (pt.inventarios[0].cantidadComprometida)}</span> */}
                                                                                </td>
                                                                                <td className='middle Almacen'>
                                                                                    {console.log('ptt', pt)}
                                                                                    {
                                                                                        Number(pt?.inventarios[0]?.cantidad) < Number(pt?.inventarios[0]?.cantidadComprometida)   ?
                                                                                            <AiOutlineExclamationCircle className="icon Exclamation" />
                                                                                        : Number(pt?.inventarios[0]?.cantidad) == Number(pt?.inventarios[0]?.cantidadComprometida) ?
                                                                                            <AiOutlinePlus className="icon" />
                                                                                        : 
                                                                                            <AiOutlineCheckCircle className="icon" />
                                                                                    }
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
                                                            <h3>Registros</h3>
                                                        </div>
                                                        <h3 className='h3'>{productosBodega?.groupsCount}</h3>
                                                    </div>
                                                    {/* <div className="boxContainer">
                                                        <div className="headerBox">
                                                            <h3>Opciones rápidas</h3>
                                                        </div>
                                                        <button onClick={() => setOptions('moveExistencias')}>
                                                            <span>¡Ingresar existencias!</span>
                                                        </button><br />
                                                        <button>
                                                            <span>¡Sacar existencias!</span>
                                                        </button>
                                                    </div> */}
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