import React from 'react';
import ItemProyecto from './proyectoItem';

export default function ListaProyectos({ proyectos }){
    return (
        <div className="listaMP">
            <table className="">
                <thead>
                    <tr>
                        <th>General</th>
                        <th>Cliente</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        proyectos?.length ?
                            proyectos.map((pr,i) => {
                                return (
                                    <ItemProyecto pr={pr} key={i+1} />
                                )
                            })
                        : null
                    }
                </tbody>
            </table>
        </div>
    )
}