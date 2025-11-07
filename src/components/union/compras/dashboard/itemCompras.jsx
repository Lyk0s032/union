import React from 'react';
import { MdDocumentScanner } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/es"; // para español
import axios from 'axios';

dayjs.extend(localizedFormat);
dayjs.locale("es");


export default function ItemCompras({ item }){
    const [params, setParams] = useSearchParams();
const precio = item.comprasCotizacionItems && item.comprasCotizacionItems.length 
    ? item.comprasCotizacionItems.reduce((acc, r) => {
        return acc + Number(r.precioTotal);
    }, 0) // <--- ¡EL CERO INICIAL ESTABA FALTANDO AQUÍ!
    : 0;

    let creadoFecha = dayjs(item?.createdAt).format("dddd, D [de] MMMM YYYY, h:mm A");
    
    return (
      
        <div className="itemOrden" onClick={() => {
            params.set('orden', item.id);
            setParams(params);
        }}>
                <div className="divideItemOrden">

                    <div className="nameAndData">
                        <div className="tipo">
                            <div className="letter">
                                <MdDocumentScanner className="icon" />
                            </div>
                        </div>
                        <div className="divideHer">
                            <div className="divideTopName">
                                <span>Nro {item.id}</span>
                                <span>|</span>
                                <strong>{item.proveedor?.nombre}</strong>
                            </div>
                            <h3>{item.name}</h3>

                            <strong style={{fontSize:12}}>
                                {
                                    !item.estadoPago ?
                                        'Preorden'
                                    : item.estadoPago == 'compras' ? 
                                        'En compras'
                                    : item.dayCompras ?
                                        'Aprobada'
                                    :null
                                }
                            </strong>
                        </div>
                    </div>
                    <div className="time">
                        <span>{creadoFecha}</span>
                    </div>
                    <div className="price">
                        <h3>$ {precio ? new Intl.NumberFormat('es-CO', {currency:'COP'}).format(precio) : 0}</h3>
                    </div>
                </div>
            </div>
    )
}