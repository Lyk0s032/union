import React, { useEffect } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../store/action/action';
import Transferir from './transferir';

export default function MoveModalRigth(){
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const almacen = useSelector(store => store.almacen);    
    const { item, loadingItem, itemToProject, loadingItemToProject } = almacen;

    const requisicion = useSelector(store => store.requisicion);
    const { itemElemento, loadingItemElemento } = requisicion


    console.log('comportamiento, ', itemElemento, loadingItemElemento)
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
                            params.delete('add')
                            setParams(params);
                        }}>
                            <MdOutlineClose className='icon' />
                        </button>
                    </div>
                </div>
                <div className="containerScrollBody">
                    {
                        loadingItemElemento || !itemElemento ?
                            <h1>Cargando</h1>
                        : 
                        itemElemento == 404 || itemElemento == 'notrequest' ?
                            <h1>Algo fallo</h1>
                        :
                        <div className="scrollContainer">
                            <div className="dataItemHere">
                                <div className="containerDataItem">
                                    <div className="letter">
                                        <h3>
                                            {itemElemento?.kit?.id}
                                            {itemElemento?.producto?.id}
                                        </h3>   
                                    </div>
                                    <div className="dataItemName">
                                        <h3>
                                            {itemElemento?.kit?.name} {itemElemento?.kit?.extension?.name}
                                            {itemElemento?.producto?.item}
                                        </h3>
                                        <span>Kabo - 50 x o</span>
                                    </div>
                                </div>
                                <div className="divideHowMany">
                                    <div className="divideDive">
                                        <div className="itemNumber">
                                            <h1></h1>
                                            <span></span>
                                        </div>
                                        <div className="itemNumber">
                                            <h1>{Number(itemElemento.cantidadEntregada).toFixed(0)} / {Number(itemElemento.cantidadComprometida).toFixed(0)}</h1>
                                            <span>Necesidad</span>
                                        </div>
                                        
                                        <div className="itemNumber">
                                            <h1><PorcentajeActual item={itemElemento} /></h1>
                                            <span>Progreso</span>
                                        </div>
                                        <div className="itemNumber">
                                            <h1></h1>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="giveTransferir">
                               <Transferir item={itemElemento} />
                            </div>

                            <div className="comprasToThisProject">
                                <div className="containerComprasToThis">
                                    <div className="titleCompras">
                                        <span>Compras realizadas para este proyecto</span>
                                    </div>
                                    <div className="resultData">
                                        {/* <div className="itemMoveOrden">
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
                                        </div> */}
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

function PorcentajeActual({ item }){
    const progreso = Number(Number(item.cantidadEntregada) / Number(item.cantidadComprometida) * 100).toFixed(0)
    return (
        <h1>{progreso} %</h1>
    )
}