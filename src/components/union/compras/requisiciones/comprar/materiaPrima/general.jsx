import React, { useEffect, useRef } from 'react';
import ListaMP from './listaMateria';
import AddMP from './addMP';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Cotizador from '../cotizador';

export default function GeneralMateriaPrima(){
    const [params, setParams] = useSearchParams();
    const ref = useRef(null);
    const longer = useRef(null);

    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);
    const { materia } = req;
    console.log(materia)
    useEffect(() => {
        if(!ref.current) return; 
        ref.current.classList.toggle('rightHereActive')
        longer.current.classList.toggle('DataHereShort')

    }, [params.get('MP')]) 
    return (
        <div className="generalComprar">
            <div className="containerGeneral">
                <div className="title">
                    <div className="">
                        <h1>Materia prima</h1>
                        <span>Lista de materia prima requerida</span>
                    </div>
                    <div className="filterProvidersList">
                        <div className="containerFilterProvider">
                            <div className="provider Active">
                                <h3>Todo</h3>
                            </div>
                            <div className="provider">
                                <h3>Expodimo</h3>
                            </div>
                            <div className="provider">
                                <h3>Ferreterias MC</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lista">
                    <div className="containerLista">
                        <div className="DataHere" ref={longer}>
                            <ListaMP materia={materia} />
                            <div className="cotizador">
                                {
                                    <Cotizador />
                                }
                            </div>
                        </div>
                        <div className="rightHere" ref={ref}>
                            <div className="containerRelative">
                                <AddMP />
                            </div>
                        </div>
                    </div>
                </div>

                
            </div>
        </div>
    )
}