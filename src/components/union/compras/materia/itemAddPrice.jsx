import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../../store/action/action';
import axios from "axios";
import { MdCheck } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
 
export default function ItemAddPrice(props){
    const precio = props.precio;
    const [valor, setValor] = useState(precio.valor)
    const [confirmar, setConfirmar] = useState(false);
    const materiaPrima = useSelector(store => store.prima);
    const { prima } = materiaPrima;

    const [porcentaje, setPorcentaje] = useState(0)
    const dispatch = useDispatch();

    const porcentaChange = () => {
        const p = ((Number(valor) - Number(precio.valor)) / Number(precio.valor)) * 100 
        setPorcentaje(p)
    }

    const updatePrice = async () => {
        if(!valor) return dispatch(actions.HandleAlerta("Debes ingresar un valor", 'mistake'))
        // Caso contrario, enviamos consulta

        const body = {
            mtId: prima.id,
            pvId: precio.proveedor.id,
            price: valor,
            iva: null,
            descuentos: null
        }
        console.log(body)
        const sendPetion = await axios.post('/api/mt/price/give', body)
        .then((res) => {
            dispatch(actions.axiosToGetPrima(false, prima.id))
            dispatch(actions.HandleAlerta("Valor actualizado con éxito", 'positive'))
            setValor(0)
            setConfirmar(null)
            dispatch(actions.axiosToGetPrimas(false))
        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta("Debes ingresar un valor", 'mistake'))
        })
        return sendPetion;
    }
    useEffect(() => {
        porcentaChange()
    }, [valor])
    return( 
        <td className='input' >
            <input type="text" onChange={(e) => setValor(e.target.value)} value={valor}/><br />
            <div className="data">
                <div className="title">
                    <span>Actual: <strong>{precio.valor} <span>COP</span></strong></span><br />
                    {
                        valor ?
                        <span>Actual: {valor} <span>COP</span></span>
                        : null
                    }<br/>
                    <div className="promedio">
                        {
                            valor ? 
                                <span className={porcentaje > 0  ? 'porcentaje Danger' : 'porcentaje Less'}>{Number(porcentaje).toFixed(2)} %</span>
                            : <span> </span>
                        }
                    </div>
                </div>
                {
                !confirmar ?
                    <button onClick={() => {
                        if(!valor) return dispatch(actions.HandleAlerta('Ingresa un valor', 'mistake'))
                        setConfirmar(true)
                    }} >
                        <span>Actualizar</span>
                    </button>
                :
                    <div className="div">
                        <button onClick={() => updatePrice()} className="confirm">
                            <span><MdCheck /></span>
                        </button>
                        <button className="cancel" onClick={() => {
                            setConfirmar(null)
                        }}>
                            <span><AiOutlineClose /></span>
                        </button>
                    </div>
                }
            </div>
        </td>
    )
}