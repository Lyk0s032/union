import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ItemListPT from './itemPT';

export default function LISTAPT({ materia, sumar }){
    return (
        <div className="listaMP">
            <table>
                <thead> 
                    <tr>
                        <th>Item</th>
                        <th className="hidden"></th>
                        <th>Necesidad</th>
                        <th>Precio / U</th>
                        <th>Total promedio</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        materia?.length ? 
                            materia.map((mat, i) => {
                                return (
                                    mat.tipo == 'producto' ?
                                        <ItemListPT materia={mat} sumar={sumar}  key={i+1}/>
                                    : null
                                )
                            })
                        : null
                    }
                </tbody>
            </table>
        </div>
    )
}