import React from "react";
import ItemProjectNecesidad from "./itemNecesidad";
import DataProject from "./dataProject";

export default function DetallesProject({ project }){

    return (
        <div className="generalComprar">
            <div className="containerGeneral">
                <div className="title">
                    <div className="">
                        <h1>Zona de producción</h1>
                        <span>Centro de entregas de producción</span>
                    </div>
                </div>
                <div className="lista">
                    <div className="containerLista">
                        <div className="DataHere">
                            <DataProject project={project}/>
                        </div> 
                    </div>
                </div>
            </div>

        </div>
    )
}