import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../../../store/action/action';
import { MdDeleteOutline, MdOutlineContentCopy } from "react-icons/md";
import axios from "axios";

export default function KitItemGeneral(props){
    const [params, setParams] = useSearchParams();
    const [loading, setLoading] = useState(false); 
    const [remove, setRemove] = useState(false);

    const usuario = useSelector(store => store.usuario);
    const { user } = usuario; 
    const kit = props.producto;
    const dispatch = useDispatch();


    return (
        <tr>
            <td className="coding">
                <div className="code">
                    <h3>{kit.id}</h3>
                </div>
            </td>
            <td className="longer" > 
                <div className="titleNameKitAndData">
                    <div className="extensionColor">
                        <div className="boxColor"></div>
                        <span>{kit.extension ? kit.extension.name : null}</span>
                        <span style={{marginLeft:10}}> | {kit.categorium ? kit.categorium.name : null}</span>
                    </div>
                    <div className="nameData">
                        <h3>{kit.name}</h3>
                    </div>
                </div>
            </td>
            <td className="middle" style={{fontSize:11}}>{kit.linea ? kit.linea.name : null}</td>


        </tr>
    )
}