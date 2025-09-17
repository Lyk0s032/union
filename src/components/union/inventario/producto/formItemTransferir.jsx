import React, { useState } from "react";
import * as actions from '../../../store/action/action';
import { useDispatch } from "react-redux";

export default function FormItemTransferir({ item,  anexar }){

    const dispatch = useDispatch();

    const [form, setForm] = useState({
        tipoProducto: 'Materia Prima',
        materiaId: item.id,
        cotizacionId: null,
        tipo: 'TRANSFERENCIA',
        ubicacionOrigenId: 1,
        ubicacionDestinoId: 4,
        refDoc: 'TRANS1000',
        de: 1,
        para: 4,
        proyecto: null,
        cantidad: 0,
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
        anexar(form);
        clean()

    }


    return (
        <tr>
            <td>
                <div className="chooseBodega">
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
                </div>
            </td>
            <td>
                <div className="chooseBodega" >
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
                            item.cotizacion_compromisos?.map((compromiso, i) => {
                                return (
                                    <option value={compromiso.cotizacion?.id} key={i+1}>{compromiso.cotizacion?.id} - {compromiso.cotizacion?.name}</option>
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
                    sendThatRegister()
                }}>Avanzar</button>
            </td>
        </tr>
    )
}