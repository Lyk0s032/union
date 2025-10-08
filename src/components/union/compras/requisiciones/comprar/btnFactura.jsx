import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function BtnFactura({ ref }){
    const [params, setParams] = useSearchParams();
    return (
        <div className="facturaBtn" ref={ref} >
            <div className="containerBtn" onClick={() => {
                params.set('facture', 'show')
                setParams(params);
            }}>
                <h3>Ver cotizaciones</h3>
            </div>
        </div>
    )
}