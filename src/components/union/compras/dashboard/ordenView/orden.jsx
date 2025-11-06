import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Orden(){
    const [params, setParams] = useSearchParams();
    return (
        <div className="ordenView">
            <div className="containerView">
                <div className="headerView">
                    <div className="divideZone">
                        <div className="dataCoti">
                            <h3>Lamento</h3>
                        </div>
                        <button onClick={() => {
                            params.delete('orden');
                            setParams(params);
                        }}>x</button>
                    </div>
                </div>
                <div className="containerScrollBody">
                    <div className="containerScroll">
                        <div className="titleDiv">
                            <span>Proveedor</span>
                            <h3>Pintura Vitra</h3>
                            <strong>NIT: </strong> <span>900365931</span><br /><br />
                            <span>13 de Octubre del 2025</span>
                        
                        </div>

                        <div className="itemsOrden">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Cantidad</th>
                                        <th>Precio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="largeThis">
                                            <div className="divideThis">
                                                <div className="letter">
                                                    <h3>3</h3>
                                                </div>
                                                <div className="data">
                                                    <h3>Nombre del item</h3>
                                                    <span>Código</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span>10.00</span>
                                        </td>
                                        <td>
                                            <span>5</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="titleDiv">
                            <div className="price">
                                <span>Precio</span>
                                <h1>$ 215.000</h1>
                                <span>Estado: Pendiente</span>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}