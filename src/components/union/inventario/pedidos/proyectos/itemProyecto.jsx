import React from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/es"; // para español
import axios from 'axios';
import { useDispatch } from 'react-redux';

dayjs.extend(localizedFormat);
dayjs.locale("es");

export default function ItemProyecto({ proyecto }){
    const [params, setParams] = useSearchParams();
     
     
    return (
        <tr onClick={() => { 
            params.set('proyecto', proyecto.id)
            setParams(params); 
        }}>
            <td className="coding">
                <div className="code">
                    <h3>{Number(proyecto.id + 21719)}</h3>
                </div>
            </td>
            <td className="longer Almacen" > 
                <div className="titleNameKitAndData">
                    <div className="extensionColor">
                        <span><strong>{proyecto.client?.nombre}</strong></span>
                    </div>
                    <div className="nameData">
                        <h3> 
                           {proyecto.name}
                        </h3>
                    </div> 
                    <div className="extensionColor">
                        <span>{proyecto.fechaAprobada}</span>
                    </div>
                </div>
            </td>
            <td className='middle Almacen'>
                <span></span>
            </td>
            <td className=" Almacen" style={{fontSize:12, textAlign:'left'}}>
            </td>
        </tr>
    )
}