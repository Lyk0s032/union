import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

export default function ItemProject({ item }){
    const [open, setOpen] = useState(false);

    const [edit, setEdit] = useState(false);



    return (
        <div className="div">
            <div className="tr">
                <div className="td longer" onDoubleClick={() => setOpen(!open)}>
                    <div className="dataProject">
                        <div className="letter">
                            <h3>{item.requisicion?.cotizacionId}</h3>
                        </div>
                        <div className="dataProjectico">
                            <h3>{item.requisicion?.nombre}</h3>
                            <span>{item.estado}</span>
                        </div>
                    </div>
                </div> 
                <div onDoubleClick={() => setEdit(true)} className="td">
                    {
                        !edit ?
                        <span>{item.cantidadEntrega} / {item.cantidad}</span>
                        :
                        <div className="inputDiv">
                            <input type="number" onBlur={() => setEdit(false)}/>
                            <span> / </span>
                            <span>{item.cantidad}</span>
                        </div>
                    }
                </div>
                <div className="td">
                    <span>+ 1</span>
                </div>
            </div>
            {
                open ?
                <div className="searchOpenBig">
                    <div className="that">
                        <h1>Big</h1>
                    </div>
                </div>
                :null
            }
        </div>
    )
}