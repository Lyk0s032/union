import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../../store/action/action';
import axios from 'axios';

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/es"; // para español

dayjs.extend(localizedFormat);
dayjs.locale("es");


export default function ItemCotizacionCompras({ cotizacion }){
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();

    const req = useSelector(store => store.requisicion);
    const { ids, materiaIds, itemsCotizacions } = req;

    let fechaCreacion = dayjs(cotizacion.createdAt).format("D [de] MMMM YYYY, h:mm A");

    return (
        <tr onClick={() => {
            params.set('facture', 'show');
            params.set('c', cotizacion.id)
            setParams(params);
        }}> 
            <td className="longer"> 
                <div className="nameLonger">
                    <div className="letter">
                        <h3>{cotizacion.id} </h3>
                    </div> 
                    <div className="name">
                        <span>{fechaCreacion} </span><br />
                        <h3>{cotizacion.name}</h3>
                        <span>{cotizacion.proveedorId}</span><br />

                    </div> 
                </div>
            </td>
            <td className='hidden'>
                <div className="">
                    <span>Pendiente</span>
                </div>
            </td>
            <td>
                <div className="">
                    {
                        cotizacion.requisiciones?.map((r) => {
                            return (
                                <><span>{r.id} - {r.nombre}</span></>
                            )
                        })
                    }
                    <br />
                </div>
            </td> 
            <td>
                <div className="">
                </div>
            </td>
            <td>
            </td>
        </tr>
    )
}