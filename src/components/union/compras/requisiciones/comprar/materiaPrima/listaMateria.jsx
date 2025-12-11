import React from 'react';
import ItemListMP from './itemMp';

export default function ListaMP({ estado, word, materia, sumar }){
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
                            materia.filter(m => {
                                const codigo = word ? m.id == word: true
                                const busqueda = word ? m.nombre?.toLowerCase().includes(word.toLowerCase()) : true
                                const linea = estado ? Number(m.linea) == Number(estado): true
                                
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
                                return linea && coincidePalabra
                            }).map((mat, i) => {
                                return (
                                    mat.tipo == 'materia' ?
                                        <ItemListMP materia={mat} sumar={sumar} key={i+1}/>
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