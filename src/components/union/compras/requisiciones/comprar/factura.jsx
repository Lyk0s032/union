import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Factura({ ref }){
    const [params,setParams] = useSearchParams();
    return (
        <div className="factura" ref={ref} style={{zIndex:7}}>
            
            <div className="facturaBox">
                    <button onClick={() => {
                    params.delete('facture');
                    setParams(params)
                }}>x</button>
                <div className="containerFactura">
                    <div className="divideTop">
                        <div className="lade">
                            <div className="item"> 
                                <span>Empresa</span>
                                <h3>Expodimo</h3>
                            </div>
                            <div className="item">
                                <span>Dirección</span>
                                <h3>Calle 72z2#28f33</h3>
                            </div>
                            <div className="item">
                                <span>NIT</span>
                                <h3>1241354-1</h3>
                            </div>
                            <div className="item">
                                <span>Tipo</span>
                                <h3>Materia prima</h3>
                            </div>
                        </div>

                        <div className="lade">
                            <div className="item">
                                <span>Encargado de la compra</span>
                                <h3>Jessica</h3>
                            </div>
                            <div className="item">
                                <span>C.C</span>
                                <h3>1005832422</h3>
                            </div>
                            <div className="item">
                                <span>Correo</span>
                                <h3>compras@metalicascosta.com.co</h3>
                            </div>
                            <div className="item">
                                <span>Teléfono</span>
                                <h3>3212207563</h3>
                            </div>
                        </div>
                    </div>

                    <div className="itemsTable">
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Cantidad</th>
                                    <th>Valor invidual</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="large">1520 - Lamina XBA</td>
                                    <td className="short">2</td>
                                    <td className="short">$ 45.000</td>
                                    <td className="short">$ 90.000</td>
                                </tr>
                            </tbody>
                        </table>

                        <table className="Topcito">
                            <thead>
                                <tr>
                                    <th ></th>
                                    <th></th>
                                    <th></th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="large"></td>
                                    <td className="short"></td>
                                    <td className="short"></td>

                                    <td className="short"> 90.000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}