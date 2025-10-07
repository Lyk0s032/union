import React from 'react';
import * as actions from '../../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import DataProject from './dataProject';

export default function DetallesProject({ proyecto }){
    const dispatch = useDispatch();
    return (
        <div className="generalComprar">
            <div className="containerGeneral">
                <div className="title">
                    <div className="">
                        <h1>Zona de pedido</h1>
                        <span>Centro de ingresos a través de ordenes de compra</span>
                    </div>
                    
                </div>
                <div className="lista">
                    <div className="containerLista">
                        <div className="DataHere">
                            {
                                <DataProject proyecto={proyecto}/>
                            }
                        </div> 
                    </div>
                </div>
            </div>

        </div>
    )
}