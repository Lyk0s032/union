import React, { useState } from 'react';
import { MdCheck } from 'react-icons/md';
import ItemAddPrice from './itemAddPrice';
import NewProvider from './newProvider';
import NewProviderPrice from './newProvider';

export default function AddPrice(props){
    const prima = props.prima;
    const [provider, setProvider] = useState(null);    
    const promedio = prima.productPrices && prima.productPrices.length ? prima.productPrices.reduce((acc, p) => Number(acc) + Number(p.valor), 0) : null
    const promedioValor = prima.productPrices && prima.productPrices.length ? prima.productPrices.reduce((acc, p) => Number(acc) + Number(p.descuentos), 0) : null
    const sinIva = prima.productPrices && prima.productPrices.length ? prima.productPrices.reduce((acc, p) => Number(acc) + Number(p.descuentos), 0) : null
    const iva = prima.productPrices && prima.productPrices.length ? prima.productPrices.reduce((acc, p) => Number(acc) + Number(p.iva), 0) : null

    return (
        <div className="pestana">
            <div className="containerPestana">
                <div className="messageForLastUpdate">
                    {
                        provider ? <div></div>
                        :
                        <div>
                            <div className="dataMateria">
                                <span>Precio promedio: <br />
                                    <h3> 
                                        $ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(Number(promedio) / prima.productPrices.length).toFixed(0))}
                                    </h3>
                                </span><br />
                                <span>Promedio sin IVA: <br /><strong>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(Number(sinIva) / prima.productPrices.length).toFixed(0))} COP </strong></span><br />
                                <span>Valor del IVA: <br /><strong>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(Number(iva) / prima.productPrices.length).toFixed(0))} COP</strong></span><br />
                                

                            </div>
                        </div>
                    }
                    <button onClick={() => setProvider(!provider)}>
                        <span>{provider ? 'Cancelar' : 'Incluir proveedor'}</span>
                    </button>
                </div>
                {
                    provider ? 
                        <NewProviderPrice prima={prima} />
                    :
                    <div className="table">
                            <table>
                                <tbody>
                                        {
                                            prima.productPrices && prima.productPrices.length ?
                                                prima.productPrices.map((pm, i) => {
                                                    return (
                                                        <ItemAddPrice precio={pm} key={i+1}/>
                                                    )
                                                })
                                            :
                                            null
                                        }

                                </tbody>
                            </table>

                    </div>
                }
            </div>
        </div>
    )
}