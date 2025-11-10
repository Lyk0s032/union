import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../../store/action/action';
import axios from 'axios';

export default function ItemListKits({ kit }){
    const [params, setParams] = useSearchParams();

    return (
        <tr >
            <td className="longer"> 
                <div className="nameLonger">
                    <div className="letter">
                        <h3 style={{fontSize:12}}>{kit.id} </h3>
                    </div> 
                    <div className="name">
                        <h3>{kit.nombre}</h3>
                        <span>{!kit.tipo ? 'Producto terminado' : kit.tipo.toUpperCase()}</span><br />
                    </div> 
                </div>
            </td>
            <td className='hidden'>
            </td>
            <td></td>
            <td></td>
            <td>
                <div className=""> 
                    <span><strong>{kit.totalKits ? kit.totalKits : null} {kit.totalCantidad ? Number(Number(kit.totalCantidad)).toFixed(2) : null}</strong></span>
                </div>
            </td> 
        </tr>
    )
}