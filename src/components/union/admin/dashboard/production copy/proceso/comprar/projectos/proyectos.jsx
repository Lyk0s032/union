import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ListaProyectos from './listaProyectos';

export default function ProyectosReq(){
    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);
    const { proyectos } = req;
    return (
        <div className="generalComprar">
            <div className="containerGeneral">
                <div className="title">
                    <div className="">
                        <h1>Proyectos</h1>
                         <span>Información general</span>
                    </div>
                    
                </div>
                <div className="lista">
                    <div className="containerLista">
                        <div className="DataHere">
                            <ListaProyectos proyectos={proyectos} />
                        </div> 
                    </div>
                </div>
            </div>

            

        </div>
    )
}