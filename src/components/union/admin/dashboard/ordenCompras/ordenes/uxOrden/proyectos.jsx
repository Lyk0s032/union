import React from 'react';
import * as actions from '../../../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import DataCotizacion from './dataCotizacion';

export default function ProyectosOrdenCompras(){
    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);
    const { proyectos } = req;
    return (
        <div className="generalComprar">
            <div className="containerGeneral">
                <div className="title">
                    <div className="">
                        <h1>Proyectos</h1>
                        <span>Cotizaciones relacionadas con esta orden de compra</span>
                    </div>
                    
                </div>
                <div className="lista">
                    <div className="containerLista">
                        <div className="DataHere">
                            <DataCotizacion />
                        </div> 
                    </div>
                </div>
            </div>

        </div>
    )
}