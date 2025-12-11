import React from 'react';
import ItemListMP from './itemProducto';

export default function ListaMP({ word, materia, sumar, productosTotal }){
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
                            materia.filter(m => {
                                let coincidePalabra = true; // Por defecto, la condición es verdadera

                                // Solo aplicamos el filtro si hay algo escrito en el buscador
                                if (word && word.trim() !== '') {
                                    const searchTerm = word.toLowerCase();

                                    // Revisa si el término de búsqueda es un número
                                    if (!isNaN(searchTerm)) {
                                        // SI ES NÚMERO: busca solo en el ID del producto.
                                        coincidePalabra = String(m.id).includes(searchTerm);
                                    } else {
                                        // SI ES TEXTO: busca solo en el nombre del ítem.
                                        coincidePalabra = m.nombre.toLowerCase().includes(searchTerm);
                                    }
                                }
                                return coincidePalabra
                            }).map((mat, i) => {
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