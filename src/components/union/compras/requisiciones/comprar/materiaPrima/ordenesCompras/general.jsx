import React from 'react';
import { useSearchParams } from 'react-router-dom';
import NewOrden from './new';

export default function OrdenesCompras({ productosTotal }){
    const [params, setParams] = useSearchParams();

    return (
        <div className="ordenesWhiteCompra">
            <div className="containerOrdenesCompras">
                <button onClick={() => {
                    params.delete('orden') 
                    setParams(params);
                }} title='Escape para cerrar'> 
                    x 
                </button>


                <div className="dataOrdenes">
                    <div className="topNewCreate">
                        <NewOrden productosTotal={productosTotal} />
                    </div>
                </div>
            </div>
        </div>
    )
} 