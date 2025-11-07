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
            }} className='coding'>
                <div className="code">
                    <h3>{provider.id}</h3>
                </div>
            </td> 
            <td className="longer" onClick={() => {
                params.set('provider', provider.id) 
                setParams(params);
            }} >
                <div className="titleNameKitAndData">
                    <div className="extensionColor">
                        <div className="boxColor"></div>
                        <span >{provider.nit}</span>
                        <span style={{marginLeft:10}}>| {provider.type == 'MP' ? 'Materia prima' : 'Comercial'}</span>

                    </div>
                    <div className="nameData">
                        <h3>{provider.nombre}</h3>
                    </div>
                </div>
            </td>
        </tr>
    )
}