import React from 'react';
import ItemListMP from './itemMp';

export default function ListaMP({ materia }){
    return (
        <div className="listaMP">
            <table>
                <thead> {console.log(materia)}
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
                                    <ItemListMP materia={mat} key={i+1}/>
                                )
                            })
                        : null
                    }
                </tbody>
            </table>
        </div>
    )
}