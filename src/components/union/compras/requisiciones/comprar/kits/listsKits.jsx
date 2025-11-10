import React from 'react';
import ItemListKits from './itemKits';

export default function ListaKits({ kits, materia }){
    return (
        <div className="listaMP">
            <table>
                <thead> 
                    <tr>
                        <th>Item</th>
                        <th className="hidden"></th>
                        <th></th>
                        <th></th>
                        <th>Necesidad</th>


                    </tr>
                </thead>
                <tbody>
                    {
                        kits?.length ? 
                            kits.map((kt, i) => {
                                return (
                                    <ItemListKits kit={kt}  key={i+1}/>
                                )
                            })
                        : null
                    }

                    {
                        materia?.length ? 
                            materia.map((kt, i) => {
                                return (
                                    kt.tipo == 'producto' ?
                                        <ItemListKits kit={kt}  key={i+1}/>
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