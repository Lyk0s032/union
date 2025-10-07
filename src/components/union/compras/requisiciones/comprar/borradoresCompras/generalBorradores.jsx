import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ListaMP from '../materiaPrima/listaMateria';
import ListaComprasCotizaciones from './listaCotizaciones';

export default function GeneralBorradoresCotizacion(){
    const [params, setParams] = useSearchParams(); 
    const ref = useRef(null);
    const longer = useRef(null);

    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);
    const { cotizacionesCompras, proyectos } = req;

    return (
        <div className="generalComprar">
            <div className="containerGeneral">
                <div className="title">
                    <div className="">
                        <h1>Cotizaciones</h1>
                        <span>Lista de cotizaciones relacionadas a los proyectos seleccionados</span>
                    </div>
                    <div className="filterProvidersList">
                        <div className="containerFilterProvider">
                            {
                                proyectos?.length ?
                                    proyectos.map((p, i) => {
                                        return (
                                            <div style={{paddingLeft:10,paddingRight:10,width:'auto'}} className="provider " key={i+1}>
                                                <h3 style={{fontSize:12}}>{p.nombre}</h3>
                                            </div>
                                        )
                                    })
                                : null
                            }
                        </div>
                    </div>
                </div>
                <div className="lista">
                    <div className="containerLista">
                        <div className="DataHere" ref={longer} >
                            <ListaComprasCotizaciones cotizaciones={cotizacionesCompras} />
                        </div>
                        
                    </div>
                </div>

                
            </div>
        </div>
    )
}