import React from "react";
import ItemProjectNecesidad from "./itemNecesidad";
import DataProject from "./dataProject";
import { useSearchParams } from "react-router-dom";
import ItemCompromisoCotizacion from "./itemCompromisoCotizacion";

export default function MateriaProject({ project }){
    const [params, setParams] = useSearchParams();

        const compromiso = project?.cotizacion?.cotizacion_compromisos.reduce(
        (acc, item) => acc + Number(item.cantidadComprometida),
        0
    );   
    
    const entregada = project?.cotizacion?.cotizacion_compromisos.reduce(
        (acc, item) => acc + Number(item.cantidadEntregada),
        0
    );  
 
    const avance = Number(Number(entregada / compromiso) * 100).toFixed(0)
    return (
        <div className="generalComprar">
            <div className="containerGeneral">
                <div className="title">
                    <div className="">
                        <h1>Zona de requisición</h1>
                        <span>Centro de entregas de almacén a producción</span>
                    </div>
                </div>
                <div className="lista">
                    <div className="containerLista">
                        <div className="DataHere">
                            <div className="DataCotizacionCompras">
                                <div className="TopGeneralInformation">

                                    <div className="dataCotizacionReal">
                                        <div className="containerDataRealCotizacion">
                                            <div className="topData">
                                                <div className="divideCotizacion">
                                                    <div className="lade">
                                                        <div className="itemBig">
                                                            <span>Cotización número: {Number(project.cotizacionId + Number(21719))}</span><br />
                                                            <span style={{fontWeight:'bold'}}>{project.nombre}</span><br /><br /> 
                                                            
                                                            <h3>Materia prima</h3>
                                                            <br />
                                                        </div>

                                                    </div>
                                                    <div className="lade Right">
                                                        <div className="price">
                                                            <span>Estado</span>
                                                            <h1>{avance}%</h1>
                                                            <span>Entrega de almacen hasta el momento</span>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tableDataItems">
                                                <div className="listaMP">
                                                    <table>
                                                        <thead> 
                                                            <tr>
                                                                <th>Item</th>
                                                                <th></th>
                                                                <th>Necesidad</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                project?.cotizacion?.cotizacion_compromisos?.length ?
                                                                    project.cotizacion.cotizacion_compromisos.map((r, i) => {
                                                                        return (
                                                                            <ItemCompromisoCotizacion item={r} key={i+1} />
                                                                        )
                                                                    })
                                                                : null
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    params.get('add') ?
                                        <MoveModalRigth />
                                    : null
                                }
                            </div>
                        </div> 
                    </div>
                </div>
            </div>

        </div>
    )
}