import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ItemMP(props){
    const MP = props.pv;
    const [params, setParams] = useSearchParams()
    
    const promedio = MP.prices && MP.prices.length ? MP.prices.reduce((acc, p) => Number(acc) + Number(p.valor), 0) : null
    return (
        <tr >
            <td onClick={() => {
                params.set('prima', MP.id) 
                setParams(params);
            }}>{MP.item}</td>
            <td >{MP.description.toUpperCase()}</td>
            <td>{MP.medida}</td>
            <td style={{fontSize:11}}>{MP.unidad.toUpperCase()}</td> 
            <td>{promedio ? new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(promedio/MP.prices.length).toFixed(0)) : 'No hay precios aun'}</td> 
            
            {/* <td>
                <button onClick={() => {
                    params.set('w', 'updateProvider');
                    setParams(params);
                }}>
                    <span>Editar</span>
                </button>
            </td> */}
        </tr>
    )
}