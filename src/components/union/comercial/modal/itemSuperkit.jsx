import React, { useEffect, useState } from "react";
import { getPromedio } from "../../produccion/calculo";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import * as actions from './../../../store/action/action';
import { hasPermission } from "../../acciones";

export default function SuperKitItem({dis, superkit, cotizacion, number}){

    const [active, setActive] = useState(null);
    const [howMany, setHowMany] = useState(1);
    const [valor, setValor] = useState(1);
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const dispatch = useDispatch();
    const recibirValor = (data) => {
        setValor(data);
        console.log('LLega del componete Kits')
    }

    const sendPeticion = async () => {
        if(!howMany || howMany == 0) return dispatch(actions.HandleAlerta('Debes ingresar una cantidad', 'mistake'))
        let body = {
            superKitId: superkit.id,
            cotizacionId: number,
            cantidad: howMany,
            precio: valor * howMany,
            areaId: cotizacion.id
        }
        const sendPeticionVar = await axios.post('/api/cotizacion/add/superKit/item', body)
        .then((res) => {
            setActive(null);
            dispatch(actions.HandleAlerta('Kit añadido con éxito', 'positive'))
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
        }).catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta('No hemos logrado crear esto', 'mistake'))
        })
        return sendPeticionVar;
        
    }
    return ( 
        <div className="superKitItem">
            {
                !active ?
                <div className="Divide" onClick={() => setActive('active')}>
                    <div className="leftImg">
                        <img src={superkit.img} alt="" />
                    </div>
                    <div className="titleData">
                        <h3>{superkit.name}</h3>
                        <span>{superkit.description}</span><br />
                        <span>{ new Intl.NumberFormat('es-CO', {currency:'COP'}).format(valor.toFixed(0)) } COP</span>
                    </div>
                </div>
                :
                <div className="Divide" >
                    <div className="leftImg">
                        <img src={superkit.img} alt="" />
                    </div>
                    <div className="titleData">
                        <h3>{superkit.name}</h3>
                        <div className="form">
                            <label htmlFor="">{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(valor * howMany).toFixed(0))} COP</label><br />
                            <input type="text" placeholder="Cantidad" 
                            onChange={(e) => {
                                setHowMany(e.target.value)
                            }} value={howMany}/>
                            <button onClick={() => {
                                sendPeticion()
                            }} className="save">
                                <span>Guardar</span>
                            </button>
                            <button onClick={() => setActive(null)} className="none">
                                <span>Cancelar</span>
                            </button>
                        </div>
                    </div>
                </div>
            }
            <div className="div">
                <GetaAllKit kits={superkit.kits} enviarAlAbuelo={recibirValor} dis={dis} />
            </div>
        </div>
    )
}



function GetaAllKit({ enviarAlAbuelo, kits, dis } ){
    const kitss = kits;
    const [valor, setValor] = useState(0);

    const traerValor = (d) => {
        setValor(Number(d)) 
        return enviarAlAbuelo(d)
    }

    return(
       <div className="">
            {/* <span>{valor}</span> */}
            <WithAll  enviarAlPadre={traerValor} kits={kitss} dis={dis} />
       </div>
    )
}



function WithAll({ enviarAlPadre, kits, dis } ){
    const kitss = kits;

    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;

    const [valor, setVal] = useState(0)
    
 
        const send = (va) => {
            return enviarAlPadre(va)
        }

        const enviar = () => {

            const data = [];
            kitss && kitss.length ?
                kitss.forEach((k, i) => {
                        const linea = k.linea.percentages && k.linea.percentages.length ? k.linea.percentages[0].final : 0
                        const distribuidor = k.linea.percentages && k.linea.percentages.length ? k.linea.percentages[0].distribuidor : 0

                        const a = k.materia.map((c) => {
                            const getV  =  getPromedio(c);
                            return getV
                        })
                        const promedio = a && a.length ? Number(a.reduce((acc, p) => Number(acc) + Number(p), 0)) : 0 // PROMEDIO
                        data.push(promedio)
                        const v = data && data.length ? Number(data.reduce((acc, p) => Number(acc) + Number(p), 0)) : 0 // V

                        const porcentajeDistribuidor = Number(v) / Number(distribuidor); // PORCENTAJE PARA DISTRIBUIR
                        const porcentaje = Number(porcentajeDistribuidor) / Number(linea) // PORCENTAJE X VALOR FINAL


                        
                        send(dis ? porcentajeDistribuidor : porcentaje)
                        return setVal(porcentajeDistribuidor);
                })
            : null
           

        }

        useEffect(() => {
            enviar();
            
        }, [kitss])
    return (
        <div className="div">
            {/* <h1>{ new Intl.NumberFormat('es-CO', {currency:'COP'}).format(valor.toFixed(0)) } COP</h1> */}
        {/* <br /><br /><br /> */}
        </div>
    )
}
