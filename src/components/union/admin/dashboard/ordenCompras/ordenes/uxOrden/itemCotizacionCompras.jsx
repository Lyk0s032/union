import React from 'react';

export default function ItemCotizacionCompras({ item, proyectos }){
    return (
        <tr>
            <td className="longer"> 
                <div className="nameLonger">
                    <div className="letter">
                        <h3>{item.materiaId ? item.materiaId : null} {item.producto ? item.productoId : null} </h3>
                    </div> 
                    <div className="name">{console.log(item)}
                        <h3>{item.materium?.description} {item.producto?.item}</h3>
                        <span>{item.materium?.item} {item.producto?.procedencia}</span><br />
                    </div> 
                </div>
            </td>
            <td className='hidden'>
                <div className="">
                    <span>{item.cantidad}</span> 
                </div>
            </td>
            <td>
                <div className=""> 
                    <span>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(item.precioUnidad).toFixed(0))}</span>
                </div>
            </td> 
            <td>
                <div className="">
                    <span>$ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(item.precioTotal).toFixed(0))}</span>
                </div>
            </td>
            {proyectos.map((proy) => (
                <td key={proy.id}>
                    <div>
                        <span>
                            {item.requisicionId === proy.id ? item.cantidad : "-"}
                        </span>
                    </div>
                </td>
            ))}
            
            
        </tr>
    )
}