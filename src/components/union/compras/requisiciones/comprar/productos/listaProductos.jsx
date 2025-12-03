import React from 'react';
import ItemListMP from './itemProducto';

export default function ListaMP({ materia, sumar, productosTotal }){
    console.log('productos totales', productosTotal)
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
                                        <ItemListMP materia={mat} sumar={sumar} productosTotal={productosTotal} key={i+1}/>
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