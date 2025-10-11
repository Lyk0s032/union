import React from 'react';
import ItemListMP from './itemMp';

export default function ListaMP({ materia }){
    return (
        <div className="listaMP">
            <table>
                <thead> 
                    <tr>
                        <th>Item</th>
                        <th className="hidden">Med. Consumo</th>

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
                                    mat.tipo == 'materia' ?
                                        <ItemListMP materia={mat} key={i+1}/>
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