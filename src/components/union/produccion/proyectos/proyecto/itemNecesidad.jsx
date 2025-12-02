import React, { useState } from 'react';
import * as actions from '../../../../store/action/action';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function ItemProjectNecesidad({ item }){

    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const [loadingToAlmacen, setLoadingToAlmacen] = useState(false);
    const [loadingToAlmacenProject, setLoadingToAlmacenProject] = useState(false);

    const porcentaje = Number(Number(item.cantidadEntregada).toFixed(0) / Number(item.cantidadComprometida).toFixed(0)) * 100
    return (
        <tr onClick={() => {
            params.set('add', item.id);
            setParams(params)
            
            dispatch(actions.axiosToGetItemElemento(true, item.requisicionId, item.kit ? item.kit.id : null, item.kit ? null: item.producto.id))
        }}>
            <td className="longer"> 
                <div className="nameLonger">
                    <div className="letter">
                        <h3>{item.kit ? item.kit.id : null} {item?.productoId}</h3>
                    </div> 
                    <div className="name">
                        <h3>{item?.kit?.name} -  {item.kit ? item.kit.extension?.name : null} {item?.producto?.item}</h3>
                        <span>{item.kit ? 'KIT' : 'Producto terminado' }</span> <br />
                    </div> 
                </div>
            </td>
            <td>
                <div className=""> 
                    <span style={{color: 'green'}}>{Number(item.cantidadEntregada).toFixed(0)} / {Number(item.cantidadComprometida).toFixed(0)}</span>
                </div>
            </td> 
            <td>
                <div>
                    <span>{porcentaje}%</span>
                </div>
            </td>
        </tr>
    )
}