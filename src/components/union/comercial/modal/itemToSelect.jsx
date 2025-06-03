import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { MdArrowForward, MdCheck } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../../store/action/action';
import { getPromedio } from "../../produccion/calculo";
import { hasPermission } from "../../acciones";

export default function ItemToSelect(props){
    const [active, setActive] = useState(null);

    const [form, setForm] = useState({
        cantidad: 1
    })
    const [valor, setValor] = useState(0);

    const cotizacions = useSelector(store => store.cotizacions);

    const { cotizacion } = cotizacions; 
 
    const dispatch = useDispatch(); 
    const option = props.kit;
    const distribuidor = option.linea.percentages && option.linea.percentages.length ? option.linea.percentages[0].distribuidor : 0
    const final = option.linea.percentages && option.linea.percentages.length ? option.linea.percentages[0].final : 0


 
    const addItem = async () => {
        const body = {
            cotizacionId: cotizacion.id,
            kitId: option.id,
            cantidad: form.cantidad,
            precio: Number(valor * form.cantidad).toFixed(0)
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
        setValor(Number(data) + Number(final));
        console.log('LLega del componete Kits')
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
            <td>
                <strong>
 
                   {Number(valor * form.cantidad).toFixed(0)} COP
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
            <td>{option.name}</td>
            <td>
                <strong>1</strong>
            </td>
            <td> 
                <strong>
                    <AllKit kit={option} enviarAlPadre={recibirValor} distribuidor={distribuidor} final={final} />
                </strong>
            </td>

            <td>
                <button onClick={() => setActive('active')}>
                    <MdArrowForward />
                </button>
            </td>
        </tr>
    )
}

function AllKit( { enviarAlPadre, kit, final, distribuidor } ){
    const kitt = kit;
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const [valor, setVal] = useState(0)
    const fn = valor / Number(final)
    const dist = valor / Number(distribuidor)

    // PORCENTAJE A EL VALOR DEL DIST
    const porcentajeADist = Number(valor + dist) * Number(final) // Porcentaje descuento a val Desc.



    const Mensage = () => {
        hasPermission(user.user, 'cotizar_distribuidor') && (enviarAlPadre(Number(Number(dist)).toFixed(0))) 
        hasPermission(user.user, 'cotizar_final') && (enviarAlPadre(Number(Number(valor) + porcentajeADist).toFixed(0))) 
        
    }

    const getTrueValor = (val) => {
        hasPermission(user.user, 'cotizar_distribuidor') && (enviarAlPadre(Number(Number(dist)).toFixed(0))) 
        hasPermission(user.user, 'cotizar_final') && (enviarAlPadre(Number(Number(valor) + fn).toFixed(0))) 
        setVal(val) 
    } 
    useEffect(() => {
        if(valor){ 
            Mensage()
        }
    })
    return (
        <div >
            {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(valor))} COP
            <GetSimilarPrice materia={kitt.materia} realValor={getTrueValor} />
        </div>
    )
}


function GetSimilarPrice({realValor, materia }){
    const consumir = materia;

    const [valor, setValor] = useState(0) 

    const mapear = () => {
        const a = consumir ? consumir.map((c, i) => {
            const getV  =  getPromedio(c);
            return getV
        }) : 0
        const promedio = a && a.length ? Number(a.reduce((acc, p) => Number(acc) + Number(p), 0)) : null
        realValor(promedio ? promedio.toFixed(0) : 0);
        return setValor(promedio);
    } 

    
    useEffect(() => {
        mapear()

    }, [])
    return (
        <div className="">
        </div>
    )
}