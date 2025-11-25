import React, { useState } from 'react';
import * as actions from '../../../../../store/action/action';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function ItemNecesidadProyecto({ item }){

    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const [loadingToAlmacen, setLoadingToAlmacen] = useState(false);
    const [loadingToAlmacenProject, setLoadingToAlmacenProject] = useState(false);

    {console.log(item)} 
    return (
        <tr onClick={() => {
            params.set('move', item.id);
            setParams(params)
        }}>
            <td className="longer"> 
                <div className="nameLonger">
                    <div className="letter">
                        <h3>{item.materium?.id} {item.producto?.id}</h3>
                    </div> 
                    <div className="name">
                        <h3>{item.materium?.description} {item.producto?.item}</h3>
                        <span>{item.materium?.item} {item.producto?.unidad}</span> - <span>{item.estado}</span><br />
                    </div> 
                </div>
            </td>
            <td>
               
            </td>
            <td>
                <div className=""> 
                    <span style={{color: 'green'}}>{item.estado}</span>
                </div>
            </td> 
            <td>
                
            </td>
            <td>
                <div>
                    <span>( {item.cantidadEntregada}  / <strong>{item.cantidadComprometida}</strong> )</span>
                </div>
            </td>
            <td>
                <div>
                    <span>(4)</span>
                </div>
            </td>
            <td>
                <div>
                    <span>(3)</span>
                </div>
            </td>
            
            
        </tr>
    )
}