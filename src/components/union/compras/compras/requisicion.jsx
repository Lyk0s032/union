import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';

export default function ShowRequisicion(){
    const [params, setParams] = useSearchParams();
    const [show, setShow] = useState(null);

    const dispatch = useDispatch();

    const mt = useSelector(store => store.requisicion);
    const { requisicion, loadingRequisicion } = mt;
    
    useEffect(() => {
        dispatch(actions.axiosToGetRequisicion(true, params.get('requisicion')))
    }, [params.get('requisicion')])
    return ( 
        !requisicion || loadingRequisicion ?
        <div className="showProveedor">
            <div className="containerShow">
                <h1>Loading</h1>
            </div>
        </div>
        :
        <div className="showProveedor">
            <div className="containerShow">
                <div className="topProvider"> 
                    <div className="divideTop">
                        <button onClick={() => {
                            params.delete('requisicion');
                            setParams(params);
                        }}>
                            <span>Volver</span>
                        </button>
                        <div className="title">
                            <h3>Nro. {requisicion.requisicion.id} - {requisicion.requisicion.nombre}</h3>
                        </div>
                    </div>
                </div>
                <div className="bodyProvider">
                    
                    <div className="containerBodyProvider">
                        <div className="requisicionDocument">
                            <div className="topHeader">
                                <div className="topTitle">
                                    <h1>{requisicion.requisicion.nombre}</h1>
                                </div>
                                <div className="fechaDiv">
                                    <div className="left">
                                        <span>Fecha</span><br />
                                        <strong>{requisicion.requisicion.fecha.split('T')[0]}</strong>
                                    </div>
                                    <div className="right">
                                        <span>Fecha necesaria</span><br />
                                        <strong>{requisicion.requisicion.fechaNecesaria.split('T')[0]}</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="bodyDocument">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Medida Original</th>
                                            <th>M. consumo</th>
                                            <th>Cantidad a pedir</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            requisicion.cantidades && requisicion.cantidades.length ?
                                                requisicion.cantidades.map((r,i) => {
                                                    return (
                                                        <tr key={i+1}>
                                                            <td>
                                                                <div className='about'>
                                                                    <span>Item Codigo: {r.id}</span><br />
                                                                    <strong>{r.nombre}</strong>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="price">
                                                                    <span>{r.medidaOriginal} {r.unidad}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="price">
                                                                    <span>
                                                                        {
                                                                            Number(r.cantidad) % 1 === 0 ?
                                                                            r.cantidad
                                                                            : r.cantidad.toFixed(3)
                                                                        }
                                                                    </span>
                                                                </div> 
                                                            </td>
                                                            <td>
                                                                <div className="price">
                                                                    {
                                                                        r.unidad == 'mt2' ?
                                                                            
                                                                            <span>
                                                                                {r.cantidad / Number(Number(r.medidaOriginal.split('X')[0]) * Number(r.medidaOriginal.split('X')[1])) < 0.5 ? 1 : Math.round(r.cantidad / Number(Number(r.medidaOriginal.split('X')[0]) * Number(r.medidaOriginal.split('X')[1])) )}
                                                                            </span>
                                                                        : r.unidad == 'mt' ?
                                                                            <span>{r.cantidad / Number(r.medidaOriginal) < 0.5 ? 1 : r.cantidad / Number(r.medidaOriginal)} </span> 
                                                                        
                                                                        : r.unidad == 'kg' ?
                                                                            <span>{r.cantidad / Number(r.medidaOriginal) < 0.5 ? 1 : r.cantidad / Number(r.medidaOriginal)} </span> 

                                                                        : <span>{r.cantidad / r.medidaOriginal} </span>

                                                                    
                                                                    }

                                                                    
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            :
                                            <h1>Nada</h1>
                                        }
                                        
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}