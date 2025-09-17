import React from 'react';
import { MdDeleteOutline, MdOutlineContentCopy } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import * as actions from './../../../store/action/action';
import { useDispatch } from 'react-redux';

export default function ItemRequisicion(props){
    const requisicion = props.requisicion;
    
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();
    
    return (
        <tr style={{cursor:'pointer'}} onClick={() => {
            dispatch(actions.getIDs([requisicion.id]))
        }}>

            <td  className="coding">
                <div className="code">
                    <h3>{requisicion.id}</h3>
                </div>
            </td>
            <td className="longer" >
                <div className="titleNameKitAndData">
                    <div className="extensionColor">
                        <div className="boxColor"></div>
                        <span>{requisicion.cotizacion.client.nombre}</span>
                        <span style={{marginLeft:10}}>{requisicion.cotizacion.id + Number(21719) }</span>
                    </div>
                    <div className="nameData">
                        <h3>{requisicion.nombre}</h3>
                        <span>{requisicion.estado}</span> 
                    </div>
                </div>
            </td>
            <td className="tdPrice" style={{fontSize:11}}>
                <span>{requisicion.fecha.split('T')[0]}</span>
            </td> 
            <td className="tdPrice" style={{fontSize:11}}>
                <span>{requisicion.fechaNecesaria.split('T')[0]}</span>
            </td>            
   
        </tr>
    )
}