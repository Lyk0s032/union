import React from 'react';
import ItemProveedorProducto from './itemProductoProveedor';

export default function ListaProductosProveedor({ provider }){
    return (
        <div className="pestana">
            <div className="containerPestana">
                <div className="titlePestana">
                    <h3>Productos registrados ({provider.prices.length? provider.prices.length : null }{provider.productPrices.length ? provider.productPrices.length : null})</h3>
                </div> 

                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th>
                                    Ult. Actualización Precio
                                </th>
                                <th>Precio</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                provider.prices && provider.prices.length ?
                                     provider.prices.map((item, i) => {
                                        return (
                                            <ItemProveedorProducto item={item} key={i+1} />
                                        )
                                     })
                                : null
                            }
                            {
                                provider.productPrices && provider.productPrices.length ?
                                     provider.productPrices.map((item, i) => {
                                        return (
                                            <ItemProveedorProducto item={item} key={i+1} />
                                        )
                                     })
                                : null
                            }
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}