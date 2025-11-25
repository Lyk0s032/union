import React from 'react';
import { MdCompareArrows, MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowUp } from "react-icons/md";
import { useSearchParams } from 'react-router-dom';
export default function ItemMovimiento({ movimiento }){
    
    const [params, setParams] = useSearchParams();

    return (
        <tr>
            <td className="people">
                <div className="divPeople">
                    <div className="letter">
                        <h3>D</h3>
                    </div>
                    <div className="dataPerson">
                        <h3>Daiana Costa</h3>
                        <span>{ movimiento.createdAt.split('T')}</span>
                    </div>
                </div>
            </td>
            <td className='register Small'>
                {
                    params.get('show') == 'Proyecto' ?
                    <div className="divRegistro">
                        <h3>
                            {
                                movimiento.tipoMovimiento == 'TRANSFERENCIA' ? 
                                    movimiento.ubicacionDestinoId == 4 || movimiento.ubicacionDestinoId == 5 ? `${movimiento.cantidad}` : `-${movimiento.cantidad}`
                                : movimiento.tipoMovimiento == 'SALIDA' ?
                                    `-${movimiento.cantidad}` 
                                :movimiento.tipoMovimiento == 'ENTRADA' ?
                                    movimiento.cantidad
                                : null
                            }
                        </h3>
                    </div>

                :
                    <div className="divRegistro">
                        <h3>
                            {
                                movimiento.tipoMovimiento == 'TRANSFERENCIA' ? 
                                    movimiento.ubicacionDestinoId == params.get('who')  ? `${movimiento.cantidad}` : `-${movimiento.cantidad}`
                                : movimiento.tipoMovimiento == 'SALIDA' ?
                                    `-${movimiento.cantidad}` 
                                :movimiento.tipoMovimiento == 'ENTRADA' ?
                                    movimiento.cantidad
                                : null
                            }
                        </h3>
                    </div>
                }
            </td>
            <td className="register">
                <div className="divRegistro">
                    <h3>{movimiento.tipoMovimiento}</h3>
                </div>
            </td>
            {/* <td className="register">
                <div className="divRegistro">
                    <h3>Bodega principal</h3>
                </div>
            </td>
            <td className="register">
                <div className="divRegistro">
                    <h3>Bodega en Proceso</h3>
                </div>
            </td> */}
            <td>
                <button className="icono">
                    {
                        movimiento.tipoMovimiento == 'ENTRADA' ?
                            <MdKeyboardDoubleArrowUp className="icon Great" />
                        : movimiento.tipoMovimiento == 'SALIDA' ?
                            <MdKeyboardDoubleArrowDown className="icon Danger" />
                        : movimiento.tipoMovimiento == 'TRANSFERENCIA' ?
                            <MdCompareArrows className="icon "  />
                        : null
                    }
                </button>
            </td>
        </tr>
    )
}