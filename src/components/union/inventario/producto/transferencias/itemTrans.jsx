import React from 'react';

export default function ItemTransferirMovimiento({ item , movimiento, clean }){
    return ( 
        <tr onDoubleClick={() => clean(movimiento)}>
             <td className='register Small'> 
                <div className="divRegistro">
                    <h3>{movimiento.cantidad}</h3>
                </div>
            </td>
            <td className="register">
                <div className="divRegistro">
                    <h3>
                        {
                            movimiento.de == 1 ? 'Principal' : movimiento.de == 2 ? 'Producto' : movimiento.de == 4 ? 'Proceso' : movimiento.de == 5 ? 'Producto terminado' : null
                        }
                    </h3>
                </div>
            </td>
            <td className="register">
                <div className="divRegistro">
                    <h3>
                        {
                            movimiento.para == 1 ? 'Principal' : movimiento.para == 2 ? 'Producto' : movimiento.para == 4 ? 'Proceso' : movimiento.para == 5 ? 'Producto terminado' : null
                        }
                    </h3>
                </div>
            </td>
            <td className="register">
                <div className="divRegistro">
                    <h3>
                        {
                            Number(movimiento.proyecto) + Number(21719)
                        }
                    </h3>
                </div>
            </td>
            <td>
                <span>Nota aquí</span>
            </td>
        </tr>
    )
}