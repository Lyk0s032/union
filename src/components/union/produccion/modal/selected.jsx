import React from "react";
import { OneElement } from "../calculo";
import axios from "axios";
import * as actions from '../../../store/action/action';
import { useDispatch } from "react-redux";

export default function Selected(props){
    const kit = props.kit;
    const dispatch = useDispatch();

    const deleteItem = async (itemId) => {
        const body = {
            kitId: kit.id,
            itemId: itemId
        }

        const sendPetion = await axios.delete('api/kit/remove/item', { data: body} )
        .then((res) => {
            dispatch(actions.axiosToGetKit(false, kit.id))
            dispatch(actions.HandleAlerta('Item removido', 'positive'))
        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta('No hemos logrado remover este item', 'mistake'))
        })
        return sendPetion; 
    }
    return (
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Medida</th>
                    <th>Unidad</th>
                    <th>Val. Promedio</th>
                    <th></th>

                </tr>
            </thead>
            <tbody>
                {
                    kit.materia && kit.materia.length ?
                        kit.materia.map((materia, i) => {
                            return (
                                <tr key={i+1}>
                                    <td>{materia.description.toUpperCase()}</td>
                                    <td>{materia.itemKit.medida}</td>

                                    <td>
                                        {materia.unidad}
                                    </td>

                                    <td> 
                                        <strong>{<ValorSelected mt={materia} />}</strong>
                                    </td>
                                    <td>
                                        <button onClick={() => deleteItem(materia.id)}>
                                            x
                                        </button>
                                    </td>
                                </tr>
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
        mt.unidad == 'kg' ?
        <span>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(valor).toFixed(0))}</span>
        :
        <span>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(valor).toFixed(0))}</span>
    )
}