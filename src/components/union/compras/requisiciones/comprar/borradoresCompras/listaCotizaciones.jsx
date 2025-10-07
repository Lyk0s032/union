import React from 'react';
import ItemCotizacionCompras from './itemCotizacionCompras';

export default function ListaComprasCotizaciones({ cotizaciones }){
    return (
        <div className="listaMP" >
            <table>
                <thead> 
                    <tr>
                        <th></th>
                        <th className="hidden">Estado</th>
                        <th>Proyectos</th>
                        <th></th>
                        <th></th>

                    </tr>
                </thead>
                <tbody>
                    {
                        cotizaciones?.length ? 
                            cotizaciones.map((cotizacion, i) => {
                                return (
                                    <ItemCotizacionCompras cotizacion={cotizacion} key={i+1}/>
                                )
                            })
                        : <span>No hay</span>
                    }
                </tbody>
            </table>
        </div>
    )
}