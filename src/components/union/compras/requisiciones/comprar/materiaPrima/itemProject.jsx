import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as actions from './../../../../../store/action/action';

export default function ItemProject({ item }){
    const [open, setOpen] = useState(false);

    const [edit, setEdit] = useState(false);
    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);

    const { itemsCotizacions } = req;
    const [plus, setPlus] = useState(null);
    const [cantidad, setCantidad] = useState(0)

    const getHowMany = () => {

        let validacion = itemsCotizacions.find(
            it => it.materiumId === item.materiumId && it.requisicionId === item.requisicionId
        );
        if(validacion){
            setPlus(validacion)
        }
    }

    const handleClick = (e) => {
        if (e.ctrlKey) {
            addItemEstado(true)

        } 
    };
    const addItemEstado = (complete) => {
        let objeto = {
            materiumId: item.materiumId,
            requisicionId: item.requisicionId,
            cantidad
        }
        if(complete){
            objeto.cantidad = Number(item.cantidad - item.cantidadEntrega)
        }
        
        dispatch(actions.getItemsForCotizacion(objeto))
    }
    useEffect(() => {
        getHowMany()
    }, [itemsCotizacions, item])
    return (
        <div className="div" >
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
                <div onClick={handleClick} onDoubleClick={() => setEdit(true)} className="td">
                    {
                        !edit ?
                        <span>{item.cantidadEntrega} / {item.cantidad}</span>
                        :
                        <div className="inputDiv">
                            <input type="number" onBlur={() => setEdit(false)} 
                            onChange={(e) => {
                                setCantidad(e.target.value)
                            }} value={cantidad} onKeyDown={(e) => {
                                if(e.code == 'Enter'){
                                    if(cantidad <= Number(item.cantidad - item.cantidadEntrega)){
                                        addItemEstado()
                                    }
                                }
                            }}/>
                            <span> / </span>
                            <span>{item.cantidad}</span>
                        </div>
                    }
                </div>
                <div className="td">
                    <span>+ {plus?plus.cantidad : 0}</span>
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