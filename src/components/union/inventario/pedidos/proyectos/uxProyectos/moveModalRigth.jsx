import React, { useEffect } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../../store/action/action';

export default function MoveModalRigth(){
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const almacen = useSelector(store => store.almacen);    
    const { itemToProject, loadingItemToProject } = almacen;

    console.log('Item y proyecto, ', itemToProject, loadingItemToProject)

    useEffect(() => {
        if(params.get('move') && params.get('item')){
            dispatch(actions.axiosToGetItemInventarioPlus(false, params.get('move'), null, null, true))
        }
    }, [params.get('move'), params.get('item')])

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
                <div className="containerScrollBody">
                    <div className="scrollContainer">
                        <div className="dataItemHere">
                            <div className="containerDataItem">
                                <div className="letter">
                                    <h3>
                                        1
                                    </h3>
                                </div>
                                <div className="dataItemName">
                                    <h3>Pintura En Polvo Gris claro</h3>
                                    <span>{3304}</span>
                                </div>
                            </div>
                            <div className="divideHowMany">
                                <div className="divideDive">
                                    <div className="itemNumber">
                                        <h1>1 / 2</h1>
                                        <span>Necesidad</span>
                                    </div>
                                    <div className="itemNumber">
                                        <h1>2</h1>
                                        <span>En Stock</span>
                                    </div>
                                    <div className="itemNumber">
                                        <h1>3</h1>
                                        <span>Comprometida</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="giveTransferir">
                            <div className="containerGive">
                                <div className="inputDiv">
                                    <label htmlFor="">Cantidad a transferir</label><br />
                                    <input type="Number" placeholder='Ingresar cantidad aquí' />
                                </div>
                            </div>
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
            </div>
            <h1>Hola</h1>
        </div>
    )
}