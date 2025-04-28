import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ItemProvider(props){
    const provider = props.pv;

    const [params, setParams] = useSearchParams()
    return (
        <tr >
            <td onClick={() => {
                params.set('provider', provider.id)
                setParams(params);
            }}>{provider.nombre}</td>
            <td>{provider.nit}</td>
            <td>{provider.type}</td>
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