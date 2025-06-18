import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { MdArrowForward, MdCheck } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../../store/action/action';
import { getPromedio } from "../../produccion/calculo";
import { hasPermission } from "../../acciones";

export default function ItemToSelect({ dis, kit, number }){
    const [active, setActive] = useState(null);

    const [form, setForm] = useState({
        cantidad: 1
    })
    const [valor, setValor] = useState(0);

    const cotizacions = useSelector(store => store.cotizacions);

    const { cotizacion } = cotizacions; 
 
    const dispatch = useDispatch(); 
    const option = kit;
    const distribuidor = option.linea.percentages && option.linea.percentages.length ? option.linea.percentages[0].distribuidor : 0
    const final = option.linea.percentages && option.linea.percentages.length ? option.linea.percentages[0].final : 0


 
    const addItem = async () => {
        const body = {
            cotizacionId: number,
            kitId: option.id,
            cantidad: form.cantidad,
            precio: Number(valor * form.cantidad).toFixed(0),
            areaId: cotizacion.id
        }
        if(!form.cantidad || form.cantidad == 0) return dispatch(actions.HandleAlerta('Debes ingresar una cantidad valida', 'mistake'));
        const sendPetion = await axios.post('api/cotizacion/add/item', body )
        .then((res) => {
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            dispatch(actions.axiosToGetCotizaciones(false))
            dispatch(actions.HandleAlerta('Kit agregado con éxito', 'positive'))

        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta('No hemos logrado agregar este kit a la cotización', 'mistake'))
        })
        return sendPetion; 
    }  
    
    const recibirValor = (data) => {
        setValor(Number(data));
    } 
    return ( 
        active ?
        <tr className="active" >
            <td>{option.name}</td> 
            <td> 
                {

                    <div className="medida">
                        <input type="text" onChange={(e) => {
                            setForm({
                                ...form,
                                cantidad: e.target.value
                            })
                        }} value={form.cantidad}/>
                    </div>
                }
            </td>
            <td>{option.extension.name}</td>
            <td>
                <strong>
                    {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(valor * form.cantidad).toFixed(0))} COP
                </strong>
            </td>
            <td> 
                <div className="twoButtons">
                    <button className="great" onClick={() => addItem()}>
                        <MdCheck />
                    </button>
                    <button className="danger" onClick={() => setActive(null)}>
                        <AiOutlineClose />
                    </button>
                </div> 
            </td>
        </tr>
        :
        <tr >
            <td className="large">{option.name} </td>
            <td className="short">
                <strong>1</strong>
            </td>
            <td>
                {
                    option.extension.name
                }
            </td>
            <td className="short"> 
                <strong>
                    <AllKit kit={option} enviarAlPadre={recibirValor} distribuidor={distribuidor} final={final} dis={dis} />
                </strong>
            </td> 

            <td className="btns">
                <button onClick={() => setActive('active')}>
                    <MdArrowForward />
                </button>
            </td>
        </tr>
    )
}

function AllKit( { enviarAlPadre, kit, final, distribuidor, dis } ){
    const kitt = kit;
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const [valor, setVal] = useState(0)
    const dist = distribuidor ?  Number(Number(valor) / Number(distribuidor)) : valor
    const fn = final ? Number(Number(dist) / Number(final)) : Number(dist) 

    console.log(`valor de ${kitt.name}`, dist)

    // PORCENTAJE A EL VALOR DEL DIST



    const Mensage = () => {
        return enviarAlPadre(dis ? Number(dist) : fn) 
    } 

    const getTrueValor = (val) => {
        setVal(val)
        Mensage()
    } 
    useEffect(() => {
        if(valor){ 
            Mensage() 
        }
    })
    return (
        <div >
            {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(dis ? dist : fn).toFixed(0))} COP
            <GetSimilarPrice materia={kitt.materia} realValor={getTrueValor} />
        </div>
    )
}


function GetSimilarPrice({realValor, materia }){
    const consumir = materia;

    const [valor, setValor] = useState(0) 

    const mapear = () => {
        // const a = consumir ? consumir.map((c, i) => {
        //     const getV  =  getPromedio(c);
        //     return getV
        // }) : 0
        // const promedio = a && a.length ? Number(a.reduce((acc, p) => Number(acc) + Number(p), 0)) : null
        // realValor(promedio ? promedio.toFixed(0) : 0);
        // return setValor(promedio);

        const costos = consumir.map((c) => getPromedio(c));
        const costoTotalKit = costos.reduce((acc, p) => acc + p, 0);
        realValor(Number(costoTotalKit.toFixed(0)));
        setValor(costoTotalKit);
    } 

    
    useEffect(() => {
        mapear()
    }, [consumir])
    return (
        <></>
    )
}