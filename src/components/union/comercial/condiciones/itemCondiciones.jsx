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

export default function CondicionesItem(){

     // 1. Se añade un estado para controlar si el acordeón está abierto o cerrado
    const [isOpen, setIsOpen] = useState(false);

    // 2. Función para cambiar el estado (de abierto a cerrado y viceversa)
    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };


    return (
        <div className="long" style={{width:'100%'}}>
            <tr  > 
                <td style={{width:'7%'}}>
                    <div className="code">
                        <h3>{Number(21719) + 1}</h3>
                    </div>
                </td>
                <td style={{width:'70%'}} onClick={toggleAccordion} >
                    <div className="titleNameKitAndData">
                        <div className="extensionColor">
                            <div className="boxColor"></div>
                            <span>Crédito</span>
                            <span style={{marginLeft:10}}></span>
                        </div>
                        <div className="nameData">
                            <h3>50% ANTICIPO - 50% ENTREGA</h3>
                            <span>Disponible</span>
                        </div>
                    </div>
                </td>
                <td style={{width:'20%'}}> <span>30 Días de plazo</span></td>

                <td style={{width:'5%'}}>
                    <div className="menu-container">
                    <button className="btnOptions">
                    {/* Icono de tres puntos */}
                        <BsThreeDots className="icon" />
                    </button>

    
                    
                    </div>
                </td>


                
            </tr>
                    <div className={`divListSubCondicions ${isOpen ? 'Open' : ''}`}>
                        <div className="containerThat">
                            <SubCondicions />
                            <SubCondicions />
                            <SubCondicions />
                            <SubCondicions />
                            <SubCondicions />
                            <SubCondicions />

                        </div>
                    </div>
        </div>
    )
}

