import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ItemToSelected({ pt, eliminar }){
    const [params, setParams] = useSearchParams();


    return (
            <tr onDoubleClick={() => eliminar(pt)}>
                <td className="coding">
                    <div className="code">
                        <h3>{pt.id}</h3>
                    </div>
                </td>
                <td className="longer Almacen" > 
                    <div className="titleNameKitAndData">
                        <div className="extensionColor">
                            <div className="boxColor"></div>
                            <span>{dayjs(pt.fecha.split('T')[0]).format('DD [de] MMMM [del] YYYY ')}</span>
                        </div>
                        <div className="nameData">
                            <h3>
                                {
                                    pt.description
                                }
                            </h3>
                        </div>
                    </div>
                </td>
                <td className="middle Almacen" style={{fontSize:12}}>
                    <span>{pt.cantidadActual}</span>
                </td>
                <td className="middle Almacen" style={{fontSize:12}}>
                    <span>{pt.cantidad}</span>
                </td>
            </tr>
    )
}