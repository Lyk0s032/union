import React from 'react';
import ListaKits from './listsKits';
import { useSelector } from 'react-redux';

export default function KitsData(){
    const req = useSelector(store => store.requisicion);
    const { kits , materia, proyectos} = req;
    
    return (
        <div className="generalComprar">
            <div className="containerGeneral">
                <div className="title">
                    <div className="">
                        <h1>KITS y Producto terminado</h1>
                        <span>Lista de productos requeridos</span>
                    </div>
                    <div className="filterProvidersList">
                        <div className="containerFilterProvider">
                            {proyectos.map((r) => 
                                <div style={{paddingLeft:10,paddingRight:10,width:'auto'}} className="provider ">
                                    <h3 style={{fontSize:12}}>{r.nombre} </h3>
                                </div>
                            )}
                            

                        </div>
                    </div>
                </div>
                <div className="lista"> 
                    <div className="containerLista">
                        <div className="DataHere"  >
                            <ListaKits kits={kits} materia={materia}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}