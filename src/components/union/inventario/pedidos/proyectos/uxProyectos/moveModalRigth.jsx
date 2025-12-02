import React, { useEffect } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../../store/action/action';
import Transferir from './transferir';

export default function MoveModalRigth(){
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const almacen = useSelector(store => store.almacen);    
    const { item, loadingItem, itemToProject, loadingItemToProject } = almacen;

    
    console.log('Item y proyecto, ', itemToProject, loadingItemToProject)
    console.log('item desde la principal', item, loadingItem)

    useEffect(() => {
        if(params.get('move') && params.get('item')){
            dispatch(actions.axiosToGetItemInventarioPlus(false, params.get('move'), null, null, true))
        } 
    }, [params.get('move'), params.get('item')])

    useEffect(() => {
        const tipo = !params.get('bodega') || params.get('bodega') == 1 || params.get('bodega') == 4 ? 'MP' : 'PT'
        let rutaMP = tipo == 'MP' ? params.get('move') : null
        let rutaPT = tipo == 'PT' ? params.get('move') : null
        console.log('rutaaa mp', tipo)
        dispatch(actions.axiosToGetItemInventarioPlus(true, rutaMP, params.get('bodega'), rutaPT))
    }, [params.get('move'),  params.get('bodega')])

    return (
        <div className="rightModalSlide">
            <div className="containerThatModal">
                <div className="headerThat">
                    <div className="divideText">
                        <div className="title">
                            <h3>
                                Zona de movimientos
                            </h3>
                        </div>
                        <button onClick={() => {
                            params.delete('move')
                            setParams(params);
                        }}>
                            <MdOutlineClose className='icon' />
                        </button>
                    </div>
                </div>
                { 
                    loadingItem || !item ?
                        <span>Cargando...</span>
                    : item == 'notrequest' || item == 404 ?
                        <span>404</span>
                    :
                    <div className="containerScrollBody">
                    <div className="scrollContainer">
                        <div className="dataItemHere">
                            <div className="containerDataItem">
                                <div className="letter">
                                    <h3>
                                        {item.item.id}
                                    </h3>   
                                </div>
                                <div className="dataItemName">
                                    <h3>{item.item.description}</h3>
                                    <span>{item.item.id} - {item.item.medida} {item.item.unidad}</span>
                                </div>
                            </div>
                            {console.log('toProject,', itemToProject)}
                            {console.log('iteem,', item)}
                            <div className="divideHowMany">
                                <div className="divideDive">
                                    <div className="itemNumber">
                                        <h1>{itemToProject.cantidadEntregada} / {itemToProject.cantidadComprometida}</h1>
                                        <span>Necesidad</span>
                                    </div>
                                    <div className="itemNumber">
                                        <h1>{item.resumenBodega.completeCount}</h1>
                                        <span>En Stock</span>
                                    </div>
                                    <div className="itemNumber">
                                        <h1>{item.resumenBodega.totalMeters}</h1>
                                        <span>Cantidad medida</span>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="giveTransferir">
                            <Transferir item={item} itemToProject={itemToProject} />
                        </div>

                        <div className="comprasToThisProject">
                            <div className="containerComprasToThis">
                                <div className="titleCompras">
                                    <span>Compras realizadas para este proyecto</span>
                                </div>
                                <div className="resultData">
                                    <div className="itemMoveOrden">
                                        <div className="ladeData">
                                            <div className="divideLadeData">
                                                <div className="letter">
                                                    <h3>1</h3>
                                                </div>
                                                <div className="dataLade">
                                                    <h3>Orden de  compra ABC</h3>
                                                    <span>Cantidad (5)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ladeTime">
                                            <span>10 de Marzo del 2025, 8:20 PM</span>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                }
            </div>
            <h1>Hola</h1>
        </div>
    )
}