import React, { useState } from 'react';
import { MdCheck } from 'react-icons/md';
import ItemAddPrice from './itemAddPrice';
import NewProvider from './newProvider';
import NewProviderPrice from './newProvider';

export default function AddPrice(props){
    const prima = props.prima;
    const [provider, setProvider] = useState(null);    
    const promedio = prima.prices && prima.prices.length ? prima.prices.reduce((acc, p) => Number(acc) + Number(p.valor), 0) : null

    return (
        <div className="pestana">
            <div className="containerPestana">
                <div className="messageForLastUpdate">
                    {
                        provider ? <div></div>
                        :
                        <div>
                            <h3>Actualizar <strong>{prima.item}</strong></h3>
                        
                            <div className="dataMateria">
                                <span>Precio promedio: <strong>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(Number(promedio) / prima.prices.length).toFixed(0))}</strong></span><br />
                                <span>Medida: <strong>{prima.medida}</strong></span><br />
                                <span>Unidad: <strong>{prima.unidad}</strong></span><br /><br />
                                <span>Última actualización: <strong>Por definir</strong></span>

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
                                        <tr >
                                            {
                                                prima.prices && prima.prices.length ?
                                                    prima.prices.map((pm, i) => {
                                                        return (
                                                                <th key={i+1}>
                                                                    <div className="proveedorData">
                                                                        <img src="https://isodoc.co/dashboard/wp-content/uploads/2018/08/iconos-isodoc-06.png" alt="" />
                                                                        <h3>{pm.proveedor.nombre}</h3>
                                                                    </div>
                                                                </th>
                                                        )
                                                    })
                                                :
                                                null
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr >
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

                                        </tr>
                                    </tbody>
                            </table>

                    </div>
                }
            </div>
        </div>
    )
}