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

    const deleteItem = async (itemId) => {
        const body = {
            kitId: itemId,
            cotizacionId: cotizacion.id 
        }

        const sendPetion = await axios.delete('api/cotizacion/remove/item', { data: body} )
        .then((res) => {
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            dispatch(actions.HandleAlerta('Kit removido', 'positive'))
 
        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta('No hemos logrado remover este kit', 'mistake'))
        })
        return sendPetion; 
    }
    
    const deleteSuperKitItem = async (itemId) => {
        const body = {
            superKidId: itemId,
            cotizacionId: cotizacion.id 
        }

        const sendPetion = await axios.delete('api/cotizacion/remove/superKit', { data: body} )
        .then((res) => {
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            dispatch(actions.HandleAlerta('Kit removido', 'positive'))
 
        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta('No hemos logrado remover este Superkit', 'mistake'))
        })
        return sendPetion; 
    }
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