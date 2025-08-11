import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { BsPencil, BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import * as actions from '../../../store/action/action';
import { MdDeleteOutline, MdOutlineFlag, MdOutlineRemoveRedEye, MdOutlineScreenShare } from "react-icons/md";
import axios from "axios";
import dayjs from "dayjs";
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/es'; // Idioma español

export default function ItemProgress({changeOpen, open, r }){
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;

        dayjs.locale('es') 
        dayjs.extend(localeData);

    const dispatch = useDispatch();
    // Aprobar 

    let porcentaje = r.state == 'finish' ? 100 : r.leidoProduccion && r.state == 'creando' ? 70 : r.leidoProduccion ? 30   : 0

    return (
        <tr onClick={() => {
            
            dispatch(actions.axiosToGetRequerimiento(true, r.id))
            changeOpen(r.id)
        }} className={r.id == open ? 'Active' : null}>
            <td className="longer">
                <div className="titleNameKitAndData">
                    <div className="nameData">{open}
                        <span style={{color: '#ccc'}}>{r.type && r.type == 'producto' ? 'Producto terminado' : 'Kit'}</span>
                        <h3>{r.nombre}</h3>
                        <span>{r.createdAt.split('T')[0]}</span>

                    </div>
                </div>
            </td>
            <td className="middle">  <span>{r.state == 'finish' ? 'Creado': r.leidoProduccion ? 'Leido' : 'Espera'}</span></td>
            <td className="percentage">
                <div className="circle-container" style={{ '--percentage': porcentaje }}>
                    <div className="circle-inner">
                        <h3>{porcentaje}</h3>
                    </div>
                </div>    
            </td> 

        </tr>
    )
}
