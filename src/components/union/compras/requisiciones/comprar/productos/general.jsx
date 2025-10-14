import React, { useEffect, useRef } from 'react';
import ListaMP from './listaProductos';
import AddMP from './addMP';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Cotizador from '../cotizador';
import ProviderAnalisis from './providers/providersAnalisis';

export default function GeneralProductos({ cargaProyectos }){
    const [params, setParams] = useSearchParams();
    const ref = useRef(null);
    const longer = useRef(null);
    const refLeftProduct = useRef(null);

    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);
    const { materia , proyectos} = req;
    useEffect(() => {
    if (!ref.current || !longer.current) return;

    if (params.get("MP")) {
        // abrir
        ref.current.classList.add("rightHereActive");
        longer.current.classList.add("DataHereShort");
    } else {
        // cerrar
        ref.current.classList.remove("rightHereActive");
        longer.current.classList.remove("DataHereShort");
    }
    }, [params.get("MP")]);

    useEffect(() => {
    if (!refLeftProduct.current) return;

    if (params.get("PV")) {
        // abrir
        refLeftProduct.current.classList.add("leftHereActive");
    } else {
        // cerrar
        refLeftProduct.current.classList.remove("leftHereActive");
    }
    }, [params.get("PV")]);
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
                            <div className="cotizador">
                                {
                                    <Cotizador />
                                }
                            </div>
                        </div>
                        <div className="leftHere" ref={refLeftProduct}>
                            <div className="containerRelative">
                                <ProviderAnalisis />
                            </div>
                        </div> 
                        <div className="rightHere" ref={ref}>
                            <div className="containerRelative">
                                <AddMP cargaProyectos={cargaProyectos} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}