import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ItemRequisicion(props){
    const requisicion = props.requisicion;

    const [params, setParams] = useSearchParams();
    return (
        <tr > 
            <td onClick={() => {
                params.set('requisicion', requisicion.id) 
                setParams(params); 
            }}>{requisicion.id}</td>
            <td >{requisicion.nombre}</td>
            <td>{requisicion.cotizacion.client.nombre}</td>
            <td>{requisicion.fecha.split('T')[0]}</td>
            <td>{requisicion.fechaNecesaria.split('T')[0]}</td>

            <td style={{fontSize:11}}>{requisicion.estado}</td> 
        </tr>
    )
}