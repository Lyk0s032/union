import React, { useEffect, useRef } from 'react';
import ListaMP from './listaProductos';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

export default function GeneralProductos(){
    const [params, setParams] = useSearchParams();
    const ref = useRef(null);
    const longer = useRef(null);
    const refLeftProduct = useRef(null);

    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);
    const { materia , proyectos} = req;

    return ( 
        <div className="generalComprar">
            <div className="containerGeneral">
                <div className="title">
                    <div className="">
                        <h1>Productos</h1>
                        <span>Lista de productos requeridos</span>
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
                            <ListaMP materia={materia} />
                        </div>
                        
                    </div>
                </div>

                
            </div>
        </div>
    )
}