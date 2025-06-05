import React from "react";
import { OneElement } from "../../produccion/calculo";
import axios from "axios";
import * as actions from '../../../store/action/action';
import { useDispatch } from "react-redux";
import SelectedSuperKit from "./superKitSelected";
import SelectedKit from "./selectedKit";

export default function SelectedKits(props){
    const cotizacion = props.cotizacion;
    const dispatch = useDispatch();

    
    
    
    return (
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Descuento</th>
                    <th>Val. Promedio</th>
                    <th></th>

                </tr>
            </thead>
            <tbody>
                {
                    cotizacion && cotizacion.kits && cotizacion.kits.length || cotizacion.armados && cotizacion.armados.length ? 

                        cotizacion.armados.concat(cotizacion.kits).map((kt, i) => {
                            return (
                                kt.armadoCotizacion ?
                                    <SelectedSuperKit key={i+1} kt={kt} cotizacion={cotizacion}/>
                                : <SelectedKit key={i+1} kt={kt} cotizacion={cotizacion} />
                            )
                        })
                    : null
                }


            </tbody>
        </table>
    )
}

function ValorSelected(props){
    const mt = props.mt;
    const valor = OneElement(mt)
    return (
        <span>{Number(valor).toFixed(2)}</span>
    )
}