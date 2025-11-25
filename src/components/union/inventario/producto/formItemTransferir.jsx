import React, { useState } from "react";
import * as actions from '../../../store/action/action';
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

export default function FormItemTransferir({ item,  anexar }){

    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();

    const tipoItem = !params.get('bodega') || params.get('bodega') == 1 || params.get('bodega') == 4 ? 'Materia Prima' : 'Producto'
    console.log('desde transferir', item)
    const [form, setForm] = useState({
        materiaId: item.itemType == 'materia' ? item.item.id : null,
        productoId: item.itemType != 'materia' ? item.item.id : null,
        cantidad: 0,
        tipoProducto: tipoItem,
        tipo: 'TRANSFERENCIA',
        ubicacionOrigenId: tipoItem == 'Materia Prima' ? 1 : 2,
        ubicacionDestinoId: tipoItem == 'Materia Prima' ? 4 : 5,
        refDoc: 'TRANS1000', 
        cotizacionId: null, 
        itemFisicoId: null,
        numPiezas: null, // Cantidad de items
        modoSeleccion: "PIEZAS_COMPLETAS",
        de: tipoItem == 'Materia Prima' ? 1 : 2,
        para: tipoItem == 'Materia Prima' ? 4 : 5,
        proyecto: null,
        nota: '' 
    })
 

    const clean = () => {
        setForm({
            de:1,
            para:2,
            proyecto: null,
            cantidad: 0, 
            nota: ''
        })
    }
    const sendThatRegister = () => {
        if(!form.cantidad) return dispatch(actions.HandleAlerta('Debes ingresar una cantidad', 'mistake'));
        console.log(form)
        anexar(form);
        clean()

    }


    return (
        <tr>
            <td>
                <div className="chooseBodega">
                    {
                        tipoItem == 'Materia Prima' ?
                            <select name="" id="" onChange={(e) => {
                                setForm({
                                    ...form,
                                    de: e.target.value,
                                    ubicacionOrigenId: e.target.value
                                })
                            }}>
                                <option value={1}>Principal</option>
                                <option value={4}>En proceso</option>
                            </select>
                        :
                            <select name="" id="" onChange={(e) => {
                                setForm({
                                    ...form,
                                    de: e.target.value,
                                    ubicacionOrigenId: e.target.value
                                })
                            }}>
                                <option value={2}>Principal terminado</option>
                                <option value={5}>Producto Listo</option>
                            </select>
                    }
                </div>
            </td>
            <td>
                <div className="chooseBodega" >
                    {
                        tipoItem == 'Materia Prima' ?
                            <select name="" id="" onChange={(e) => {
                                setForm({
                                    ...form,
                                    para: e.target.value,
                                    ubicacionDestinoId: e.target.value
                                })
                            }}>
                                <option value={4}>Proceso</option>
                                <option value={1}>Principal</option>
                            </select>
                        :
                            <select name="" id="" onChange={(e) => {
                                setForm({
                                    ...form,
                                    para: e.target.value,
                                    ubicacionDestinoId: e.target.value
                                })
                            }}>
                                <option value={5}>Producto Listo</option>
                                <option value={2}>Principal terminado</option>
                            </select>

                    }
                    
                </div>
            </td>
            <td>
                <div className="chooseBodega">
                    <select name="" style={{width:'100%'}} id="" onChange={(e) => {
                        setForm({
                            ...form,
                            proyecto: e.target.value,
                            cotizacionId: e.target.value
                        })
                    }}>
                        <option value={null}>Seleccionar</option>
                        {
                            item.compromisos?.map((compromiso, i) => {
                                return (
                                    <option value={compromiso?.cotizacionId} key={i+1}>{compromiso?.cotizacionId} - {compromiso.cotizacion?.name}</option>
                                )
                            })
                        }
                    </select>
                </div>
            </td>
            <td>
                <div className="chooseBodega">
                    <input type="text" placeholder='10' onChange={(e) => {
                        setForm({
                            ...form,
                            cantidad: e.target.value
                        })
                    }}/>
                </div>
            </td>
            <td>
                <div className="chooseBodega">
                    <input type="Buscar" placeholder='Nota adiocional. Opcional' />
                </div>
            </td>
            <td>
                <button onClick={() => {
                    console.log(form)
                    sendThatRegister()
                }}>Avanzar</button>
            </td>
        </tr>
    )
}