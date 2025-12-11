import React, { useState } from 'react';
import * as actions from '../../../../store/action/action';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function ItemCompromisoCotizacion({ item }){

    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();

    return (
        <tr> {console.log('item en producción, ', item)}
            <td className="longer"> 
                <div className="nameLonger">
                    <div className="letter">
                        <h3>{item.materium ? item.materiaId : null} {item?.productoId}</h3>
                    </div> 
                    <div className="name">
                        <h3>{item.materium?.description} {item?.producto?.item}</h3>
                        <span>{item.materium ? 'Materia prima' : 'Producto terminado' }</span> <br />
                    </div> 
                </div>
            </td>
            <td></td>
            <td>
                <div className=""> 
                    <span style={{color: 'green'}}>{Number(item.cantidadEntregada).toFixed(0)} / {Number(item.cantidadComprometida).toFixed(0)} {item.materium?.unidad} {item.producto?.unidad == 'mt2' ? 'mt2' : null}</span>
                </div>
            </td> 
        </tr>
    )
}