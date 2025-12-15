import React from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/es"; // para español
import axios from 'axios';
import { useDispatch } from 'react-redux';

dayjs.extend(localizedFormat);
dayjs.locale("es");

export default function ItemPedido({ orden }){
    const [params, setParams] = useSearchParams();
    
    let aprobadaCompra  = orden.daysFinish ? dayjs(orden.dayFinish).format("dddd, D [de] MMMM YYYY, h:mm A") : null;
    
    return (
        <tr onClick={() => {
            params.set('pedido', orden.id)
            setParams(params);
        }}>
            <td className="coding">
                <div className="code">
                    <h3>{orden.id}</h3>
                </div>
            </td>
            <td className="longer Almacen" > 
                <div className="titleNameKitAndData">
                    <div className="extensionColor">
                        <span><strong>{orden.proveedor?.nombre}</strong></span>
                    </div>
                    <div className="nameData">
                        <h3>
                           {orden.name}
                        </h3>
                    </div>
                    <div className="extensionColor">
                        <span>{aprobadaCompra}</span>
                    </div>
                </div>
            </td>
            <td className='middle Almacen'>
                <span></span>
            </td>
            <td className=" Almacen" style={{fontSize:12, textAlign:'left'}}> {console.log(orden)}
                {
                    orden.requisiciones?.map((req, i) => {
                        return (
                            <span key={i+1} style={{color: '#666'}}>{Number(21719 + req.cotizacionId)} - {req.nombre}<br /></span>
                        ) 
                    })
                }
            </td>

            
        </tr>
    )
}