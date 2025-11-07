import React, { useState } from 'react';
import { MdCheck } from 'react-icons/md';
import ItemAddPrice from './itemAddPrice';
import NewProvider from './newProvider';
import NewProviderPrice from './newProvider';

export default function AddPrice(props){
    const prima = props.prima;
    const [provider, setProvider] = useState(null);    
    const promedio = prima.prices && prima.prices.length ? prima.prices.reduce((acc, p) => Number(acc) + Number(p.valor), 0) : null
    const sinIva = prima.prices && prima.prices.length ? prima.prices.reduce((acc, p) => Number(acc) + Number(p.descuentos), 0) : null
    const iva = prima.prices && prima.prices.length ? prima.prices.reduce((acc, p) => Number(acc) + Number(p.iva), 0) : null


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
                                        $ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(Number(promedio) / prima.prices.length).toFixed(0))} 
                                    </h3>
                                </span><br />
                                <span>Promedio sin IVA: <br /><strong>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(Number(sinIva) / prima.prices.length).toFixed(0))} COP </strong></span><br />
                                <span>Valor del IVA: <br /><strong>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(Number(iva) / prima.prices.length).toFixed(0))} COP</strong></span><br />
                                

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
                                    <thead>
                                        <tr>
                                            <th>Proveedor</th>
                                            <th>Valor base</th>
                                            <th>Valor con IVA</th>
                                            <th>Variación</th>
                                            <th>Nuevo</th>
                                            <th></th>
                                        </tr>
                                        
                                    </thead>
                                    <tbody>
                                            {
                                                prima.prices && prima.prices.length ?
                                                    prima.prices.map((pm, i) => {
                                                        return (
                                                            <ItemAddPrice precio={pm} key={i+1}/> 
                                                        )
                                                    })
                                                :
                                                null
                                            }
                                            {/* {
                                                prima.prices && prima.prices.length ?
                                                    prima.prices.map((pm, i) => {
                                                        return (
                                                            <ItemAddPrice precio={pm} key={i+1}/>
                                                        )
                                                    })
                                                :
                                                null
                                            } */}

                                    </tbody>
                            </table>

                    </div>
                }
            </div>
        </div>
    )
}