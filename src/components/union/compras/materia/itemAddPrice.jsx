import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../../store/action/action';
import axios from "axios";
import { MdCheck, MdClose } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
 
export default function ItemAddPrice(props){
    const precio = props.precio;
    const [valor, setValor] = useState(precio.descuentos)
    const [confirmar, setConfirmar] = useState(false);
    const materiaPrima = useSelector(store => store.prima);
    const { prima } = materiaPrima;
    const [update, setUpdate] = useState(null);
    const [porcentaje, setPorcentaje] = useState(0)
    const dispatch = useDispatch();

    const porcentaChange = () => {
        const p = ((Number(valor) - Number(precio.descuentos)) / Number(precio.descuentos)) * 100 
        setPorcentaje(p)
    }

    const updatePrice = async () => {
        if(!valor) return dispatch(actions.HandleAlerta("Debes ingresar un valor", 'mistake'))
        if(valor == precio.descuentos) return dispatch(actions.HandleAlerta('Debes ingresar un valor diferente'))
       // Caso contrario, enviamos consulta
        let iva = valor * 0.19;
        let total = Number(Number(valor) + Number(iva)).toFixed(0); 
        const body = { 
            mtId: prima.id,
            pvId: precio.proveedor.id,
            price:total ,
            iva,
            descuentos: valor,
        }
        const sendPetion = await axios.post('/api/mt/price/give', body)
        .then((res) => {
            dispatch(actions.axiosToGetPrima(false, prima.id))
            dispatch(actions.HandleAlerta("Valor actualizado con éxito", 'positive'))
            dispatch(actions.axiosToGetPrimas(false))
            setUpdate(null)
        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta("Debes ingresar un valor", 'mistake'))
        })
        return sendPetion;
    }
    // Remover
    const RemovePrice = async () => {
        const body = { 
            priceId: precio.id
        }
        const sendPetion = await axios.put('/api/mt/price/remove', body)
        .then((res) => {
            dispatch(actions.axiosToGetPrima(false, prima.id))
            dispatch(actions.HandleAlerta("Valor removido con éxito", 'positive'))
            dispatch(actions.axiosToGetPrimas(false))
            setUpdate(null)
        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta("No hemos logrado remover esto.", 'mistake'))
        })
        return sendPetion;
    }
    useEffect(() => {
        porcentaChange()
    }, [valor])
    return( 
        <>
        <tr>
            <td className="medium" >
                <div className="proveedorData">
                    <div className="letter">
                        <h1>{precio.proveedor.nombre[0]}</h1>
                    </div>
                    <div className="dataProvider">
                        <h3>{precio.proveedor.nombre}</h3>
                    <span style={{color: '#666', fontWeight:400,fontSize:11}}>Ult. {precio.createdAt.split('T')[0]}</span>
                    </div>
                </div>
            </td>
            <td className='price'>
                <h3>{valor && (new Intl.NumberFormat('es-CO', {currency:'COP'}).format(precio.descuentos))} COP</h3>
            </td>
            <td className='price'>
                <h3>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(precio.valor)} COP</h3>
            </td>
            <td className='porcentage'>
                {
                    valor ? 
                        <span className={porcentaje > 0  ? 'porcentaje Danger' : 'porcentaje Less'}>{Number(porcentaje).toFixed(2)} %</span>
                    : <span> </span>
                }
            </td>
            
                {
                    !update ?
                    <td className="price" onDoubleClick={() => setUpdate(true)}>
                        <h3>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(valor)}</h3>
                    </td>
                    :
                    <td className=''>
                        <div className="inputDiv">
                            <input type="text" placeholder='' 
                            id={precio.id} onChange={(e) => setValor(e.target.value)} value={valor}
                            onKeyDown={(e) => {
                                if(e.code == 'Enter'){
                                    if(!valor || valor == 0) dispatch(actions.HandleAlerta('Debes ingresar un valor'))
                                    updatePrice()
                                } if(e.code == 'Escape'){
                                    setUpdate(null)
                                }
                            }} />
                        </div>
                    </td>
                }
                <td className="remove">
                    <button onClick={() => {
                        RemovePrice()
                    }} >
                        <MdClose className="icon" />
                    </button>
                </td>
        </tr>
        </>
    )
}