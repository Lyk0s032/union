import React from 'react';
import { MdDocumentScanner } from 'react-icons/md';
import ItemCompras from './itemCompras';

export default function ListaCompras({ compras }){
    console.log('compraaas,', compras);
    return (
        <div className="containerResults">
            <div className="titleContainer">
                <div className="divideTitle">
                    <h3 style={{fontSize:14}}>Resultados</h3>

                    <select name="" id="">
                        <option value="">Filtrar</option>
                        <option value="">Pendientes</option>
                        <option value="">Ordenes de compra</option>
                        <option value="">Aprobadas</option>
                    </select>
                </div>
            </div>
            {
                compras && compras.length ?
                    compras.map((it, i) => {
                        return (
                            <ItemCompras item={it} key={i+1} />
                        )
                    })
                : null
            }

        </div>
    )
}