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

    return (
        <tr onClick={() => {
            const tipo = item.materium ? 1 : 2
            const identificador = item.materium ? item.materiaId : item.productoId
            params.set('move', identificador);
            params.set('bodega', tipo)
            setParams(params)
            dispatch(actions.getItemToProject(item))
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

            
            
        </tr>
    )
}