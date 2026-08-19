import React, { useMemo } from 'react';
import { MdDocumentScanner } from 'react-icons/md';
import ItemCompras from './itemCompras';

export default function ListaCompras({ compras }){
    const comprasOrdenadas = useMemo(() => {
        if (!Array.isArray(compras)) return [];
        return [...compras].sort((a, b) => {
            const fechaA = new Date(a?.createdAt || 0).getTime();
            const fechaB = new Date(b?.createdAt || 0).getTime();
            if (fechaB !== fechaA) return fechaB - fechaA;
            return Number(b?.id || 0) - Number(a?.id || 0);
        });
    }, [compras]);

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
                comprasOrdenadas.length ?
                    comprasOrdenadas.map((it) => (
                        <ItemCompras item={it} key={it.id} />
                    ))
                : null
            }

        </div>
    )
}