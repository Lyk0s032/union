import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { MdArrowForward, MdCheck } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../../store/action/action';
import ModalCalibre from "./modalCalibre";
import { useSearchParams } from "react-router-dom";

export default function ItemToSelect({ number, kitt}){
    const [active, setActive] = useState(null);
    const [params, setParams] = useSearchParams();
    const [valorDelHijo, setValorDelHijo] = useState(null);

    const kits = useSelector(store => store.kits);
    const { kit } = kits;

    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;     
    const dispatch = useDispatch();
    const option = kitt;
    const howManyRef = useRef(null);
    const promedio = option.prices && option.prices.length ? Number(option.prices.reduce((acc, p) => Number(acc) + Number(p.valor), 0)) / option.prices.length : null
    const [form, setForm] = useState({
        mt2: option.unidad == 'mt2' ? Number(Number(option.medida.split('X')[0]) * Number(option.medida.split('X')[1])) : '1',
        other: option.unidad != 'mt2' ? option.medida : option.medida,
        cantidad: option.cantidad ? option.cantidad : 0,
        kg: option.medida 
    });

    const addItem = async () => {
        const body = {
            kitId: kit.id,
            calibre: valorDelHijo,
            mtId: option.id,
            cantidad: 1,
            medida: option.unidad == 'mt2' ? form.mt2 : option.unidad == 'kg' ? form.kg : form.other,
            userId: user.user.id,
            areaKitId: number ? number : null
        }
        if(!form.other) return dispatch(actions.HandleAlerta('Debes ingresar una medida valida', 'mistake'));

        const sendPetion = await axios.post('api/kit/add/item', body )
        .then((res) => {
            dispatch(actions.axiosToGetKit(false, kit.id))
            dispatch(actions.axiosToGetPrimas(false))
            dispatch(actions.HandleAlerta('Item agregado con éxito', 'positive'))

        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta('No hemos logrado agregar este item', 'mistake'))
        })
        return sendPetion; 
    } 


    const manejarValor = (nuevoValor) => {
        setValorDelHijo(nuevoValor);
      };

    useEffect(() => {
        if(active){
            howManyRef.current.focus()
        }
    }, [active])
    return ( 
        active ?
       <tr className="uxTable">
            <td className="titleKit Mini"> 
                <div className="divTitleKits">
                    <div className="leftTitle">
                        <strong>{option.id}</strong>
                    </div>
                    <div className="right">
                        <h3>{option.description.toUpperCase()}</h3>
                        <h4>{option.medida} {option.unidad == 'mt' ? 'METROS' : option.unidad == 'unidad' ? 'UNIDADES': option.unidad == 'kg' ? 'KILOGRAMOS' : option.unidad == 'mt2' ? 'METROS CUADRADOS' : null} </h4>
                    </div>
                </div>
            </td>
            { 
                params.get('almacen') ? <ModalCalibre onEnviarValor={manejarValor} />  : null
            }
            <td className="short">
                {
                    valorDelHijo ?
                        <span>{valorDelHijo}</span>
                    :
                    <button className="calibre" onClick={() => {
                        params.set('almacen', 'select')
                        setParams(params);
                    }}>
                        <span>Almacen</span>
                    </button>
                }
            </td>  
            <td className="short Mini">
                <h3>
                    {   
                    
                        option.unidad == 'mt2' ?
                            new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(Number(Number(promedio) / Number(Number(option.medida.split('X')[0] * option.medida.split('X')[1]))) * Number(Number(form.mt2))).toFixed(0))
                        :option.unidad == 'mt' ?
                            new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(Number(Number(promedio) / Number(option.medida)) * Number(form.other)).toFixed(0))
                        : option.unidad == 'unidad' ?
                            new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(Number(Number(promedio) / Number(option.medida))) * Number(form.other).toFixed(0))
                        : option.unidad == 'kg' ?
                            new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(Number(Number(promedio) / Number(option.medida)) * Number(form.kg)).toFixed(0))
                        : 0 
                    } 
                    <span> COP</span>
                </h3>
            </td>
            <td className="btns"> 
                <div className="HowManyHere">
                    {
                    option.unidad == 'mt2' ? 
                        <div className="medida"> 
                            <input type="text" ref={howManyRef} id="one" onChange={(e) => {
                                setForm({
                                    ...form,
                                    mt2:  `${e.target.value}`
                                })
                            }} value={form.mt2} onKeyDown={(e) => {
                                    if(e.key == 'Enter'){
                                        addItem()
                                    }
                                }} onBlur={() => setActive(null)}/>
                            {/* <h3>x</h3>
                            <input type="text" onChange={(e) => {
                                setForm({
                                    ...form,
                                    mt2:  `${form.mt2.split('X')[0]}X${e.target.value}`
                                })
                            }} value={form.mt2.split('X')[1]}/> */}
                        </div>
                    :
                        <div className="medida">
                            {
                                option.unidad == 'kg' ?
                                <input type="text" ref={howManyRef} onChange={(e) => {
                                    setForm({
                                        ...form,
                                        kg: e.target.value
                                    })
                                }} value={form.kg} onKeyDown={(e) => {
                                    if(e.key == 'Enter'){
                                        addItem()
                                    }
                                }} onBlur={() => setActive(null)}/>
                                : 
                                <input type="text" ref={howManyRef} onChange={(e) => {
                                    setForm({
                                        ...form,
                                        other: e.target.value
                                    })
                                }} value={form.other} onKeyDown={(e) => {
                                    if(e.key == 'Enter'){
                                        addItem()
                                    }
                                    if(e.code == 'Escape') setActive(null)
                                }} />
                            }
                        </div>
                }
                </div>
            </td>
        </tr>
        :
        <tr className="uxTable">
            <td className="titleKit Mini"> 
                <div className="divTitleKits">
                    <div className="leftTitle">
                        <strong>{option.id}</strong>
                    </div>
                    <div className="right">
                        <h3>{option.description.toUpperCase()}</h3>
                        <h4>{option.medida} {option.unidad == 'mt' ? 'METROS' : option.unidad == 'unidad' ? 'UNIDADES': option.unidad == 'kg' ? 'KILOGRAMOS' : option.unidad == 'mt2' ? 'METROS CUADRADOS' : null} </h4>
                    </div>
                </div>
            </td>

            <td className="short Mini">
                <h3>{option.medida} </h3>
            </td>
            <td className="short Mini">
                <h3>{promedio ? `${new Intl.NumberFormat('es-CO', {currency:'COP'}).format(promedio.toFixed(0))} ` : 0} <span>COP</span></h3>
            </td>
            <td className="btns Mini">
                <button onClick={() => setActive('active')}>
                    <MdArrowForward />
                </button>
            </td>
        </tr>
    )
}