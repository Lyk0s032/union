import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { BsPencil, BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import * as actions from '../../../store/action/action';
import { MdDeleteOutline, MdOutlineFlag, MdOutlineRemoveRedEye, MdOutlineScreenShare } from "react-icons/md";
import axios from "axios";
import dayjs from "dayjs";
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/es'; // Idioma español
import SubCondicions from "./itemSubCondiciones";

export default function NewCondicionesItem(){


    return (
        <div className="long New" >
            <tr > 
                <td className="codingg">
                    <div className="code">
                        <h3>?</h3>
                    </div>
                </td>
                <td className="largo" >
                    <div className="titleNameKitAndData">
                        <div className="extensionColor">
                            <select name="" id="" className="type">
                                <option value="">Credito</option>
                                <option value="">Contado</option>
                            </select>
                            <span style={{marginLeft:10}}></span>
                        </div>
                        <div className="nameData">
                            <input type="text" placeholder="Nombre de la condición" /><br />
                            <span>En creación...</span>
                        </div>
                    </div>
                </td>
                <td className="days"> 
                    <select name="" id="" className="timeSelect">
                        <option value="">5 días</option>
                    </select>
                </td>
 
                <td className="btns"> 
                    <div className="menu-container" >
                        <div className="" style={{display:'flex', alignItems:'center', width:'100%', justifyContent:'start'}}>
                            <button className="btnOptions" >
                            {/* Icono de tres puntos */}
                                <BsThreeDots className="icon" />
                            </button>
                            <button className="btnOptions">
                            {/* Icono de tres puntos */}
                                <BsThreeDots className="icon" />
                            </button>
                        </div>

    
                    
                    </div>
                </td>


                
            </tr>
        </div>
    )
}

