import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../../../../store/action/action';
import { MdDeleteOutline, MdOutlineContentCopy } from "react-icons/md";
import axios from "axios";

export default function ProductoItemGeneral(props){
    const [params, setParams] = useSearchParams();
    const [loading, setLoading] = useState(false); 
    const [remove, setRemove] = useState(false);

    const usuario = useSelector(store => store.usuario);
    const { user } = usuario; 
            
    const dispatch = useDispatch();
    const producto = props.producto;


    return (
        <tr>
            <td className="coding">
                <div className="code">
                    <h3>15</h3>
                </div>
            </td>
            <td className="longer" > 
                <div className="titleNameKitAndData">
                    <div className="extensionColor">
                        <div className="boxColor"></div>
                        <span>Gris nopal</span>
                        <span style={{marginLeft:10}}> | {producto.linea ? producto.linea.name : null}</span>
                    </div>
                    <div className="nameData">
                        <h3>{producto.item}</h3>
                    </div>
                </div>
            </td>
            <td className="middle" style={{fontSize:11}}>{producto.categorium ? producto.categorium.name : null}</td>


        </tr>
    )
}