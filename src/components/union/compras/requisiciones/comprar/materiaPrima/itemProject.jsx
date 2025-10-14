import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as actions from './../../../../../store/action/action';

export default function ItemProject({ cargaProyectos, item, data }){
    const [open, setOpen] = useState(false);

    const [edit, setEdit] = useState(false);
    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);

    const { itemsCotizacions, ids } = req;
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

    const openThat = () => {
        dispatch(actions.gettingItemRequisicion(false))
        let body = {
            mpId: data.id,
            ids: ids
        }
        const send = axios.post('/api/requisicion/get/materiales/materia/', body)
        .then((res) => {
            dispatch(actions.getItemRequisicion(res.data));
        }).catch(err => {
            console.log(err);
            dispatch(actions.getItemRequisicion(404));
        })
    
        return send
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

    const sendHowMany = async (how) => {
        let body = {
            cantidadEntrega: Number(how),
            comprasItemCotizacion: item.id
        }

        const send = await axios.put(`/api/requisicion/put/updateCantidad/comprasCotizacionItem`, body)
        .then((res) => {
            cargaProyectos()
            setEdit(false)
            openThat()
        })
    }
    const m = data;
    let productoLados = 1;
    
    if (data.unidad == 'mt2') {
        const [ladoA, ladoB] = m.medida.split('X').map(Number);
        if (!isNaN(ladoA) && !isNaN(ladoB)) {
            productoLados = ladoA * ladoB;
        } 
    }else{
        productoLados = data.medida
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
                            <span>
                            {
                              item.cantidadEntrega  == 0 ? 'Pendiente' 
                              : item.cantidadEntrega >=   Number((Number(Number(item.cantidad) / Number(productoLados)))).toFixed(0) ? 'Comprado' 
                              : 'Parcialmente comprado'
                            }</span>
                        </div>
                    </div>
                </div> 
                <div onClick={handleClick} onDoubleClick={() => setEdit(true)} className="td">
                    {
                        !edit ?
                        <span>{item.cantidadEntrega} / 
                        {
                            Number(Number(Number(item.cantidad) / Number(productoLados))).toFixed(4) < 1 ?
                             Number(Number(Number(item.cantidad) / Number(productoLados))).toFixed(4) 
                            : 
                             Number(Math.ceil(Number(Number(item.cantidad) / Number(productoLados))))
                        }</span>
                        :
                        <div className="inputDiv">
                            <input type="number" onBlur={() => setEdit(false)} 
                            onChange={(e) => {
                                setCantidad(e.target.value)
                            }} value={cantidad} onKeyDown={(e) => {
                                if(e.code == 'Enter'){ 
                                        sendHowMany(e.target.value)

                                    // if(cantidad <= Number(Number(Math.ceil(Number(Number(item.cantidad) / Number(productoLados)))) - item.cantidadEntrega)){
                                        // sendHowMany(e.target.value)
                                    // }
                                }
                            }}/>
                            <span> / </span>
                            <span>
                                {
                                    Number(Number(Number(item.cantidad) / Number(productoLados))).toFixed(4) < 1 ?
                                     Number(Number(Number(item.cantidad) / Number(productoLados))).toFixed(4) 
                                    : 
                                    Number(Math.ceil(Number(Number(item.cantidad) / Number(productoLados))))
                                }
                            </span>
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