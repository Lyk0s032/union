import React from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import * as actions from '../../store/action/action';

export default function CotizacionItem(props){
    const [params, setParams] = useSearchParams();
    const cotizacion = props.cotizacion;

    const dispatch = useDispatch();
    return (
        <tr>
            <td onClick={() => {
                 dispatch(actions.getCotizacion(cotizacion))
                params.set('w', 'newCotizacion')
                setParams(params);
            }}>{cotizacion.name}</td>
            <td>{cotizacion.client.nombre}</td>
            <td>{cotizacion.updatedAt.split('T')[0]}</td>
            <td>
                <strong>{<ValorKit cotizacion={cotizacion} />} COP</strong>
            </td>
            {/* <td> 
                <button onClick={() => {
                    params.set('w', 'updateMp');
                    setParams(params);
                }}>
                    <span>Editar</span>
                </button>
            </td> */}
        </tr>
    )
}

function ValorKit(props){
    const coti = props.cotizacion;
    const valor = coti.kits && coti.kits.length ? Number(coti.kits.reduce((acc, p) => Number(acc) + Number(p.kitCotizacion ? p.kitCotizacion.precio : 0), 0)) : null

    return (
        <span>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format((valor))}</span>
    )
}