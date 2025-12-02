import React from 'react';
import { MdDeleteOutline, MdOutlineContentCopy } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
 
export default function ItemProject({ item }){
    const [params, setParams] = useSearchParams();
    return (
        <tr onClick={() => {
            params.set('project', item.id)
            params.set('s', 'detalles')
            setParams(params);
        }}>
            <td style={{fontSize:11}} className="position">
                <div className="priority">
                    <h3># {item.id}</h3>
                </div> 
            </td>
            <td  className='coding'>
                <div className="code">
                    <h3>{Number(21719 + item.cotizacionId)} </h3>
                 </div>
            </td> 
            <td className="longer" >
                <div className="titleNameKitAndData">
                    <div className="extensionColor" style={{fontSize:14}}>
                        <div className="boxColor"></div>
                        <span>{item.cotizacion?.client?.nombre}</span>
                        <span style={{fontSize:11}} > </span>
                    </div>
                    <div className="nameData">
                        <h3>{item.nombre}</h3>
                        <span>{item.fecha.split('T')[0]}</span>
                    </div>
                </div>
            </td>
            <td></td>
            <td style={{fontSize:11}} ></td> 
            <td className="tdPrice" onClick={() => {
                params.set('prima', MP.id) 
                setParams(params);
            }} >
                <div className="progresProject">
                    {/* <div className="boxCircle">
                        <div className="containerCircle">
                            <h3>
                                10%
                            </h3>
                        </div>
                    </div> */}
                    <h3>
                    {/* {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(100000).toFixed(0))} */}

                    </h3>
                </div>
            </td>
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