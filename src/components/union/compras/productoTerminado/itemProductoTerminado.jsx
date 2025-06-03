import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ItemProductoTerminado(props){
    const MP = props.pv;
    const [params, setParams] = useSearchParams()
    
    const promedio = MP.productPrices && MP.productPrices.length ? MP.productPrices.reduce((acc, p) => Number(acc) + Number(p.valor), 0) : null
    return (
        <tr > 
            <td onClick={() => {
                params.set('producto', MP.id) 
                setParams(params);
            }}>{MP.id}</td>
            <td >{MP.description.toUpperCase()}</td>
            <td>{promedio ? new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(promedio/MP.productPrices.length).toFixed(0)) : 'No hay precios aun'}</td> 
             
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