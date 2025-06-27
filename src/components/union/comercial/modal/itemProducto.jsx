import React, { useEffect, useState } from "react";
import { getPromedio } from "../../produccion/calculo";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import * as actions from './../../../store/action/action';
import { hasPermission } from "../../acciones";

export default function ProductoTerminadoItem({ area, terminado, final }){
    const [active, setActive] = useState(null);
    const [howMany, setHowMany] = useState(terminado.unidad == 'mt2' ? terminado.medida : '1');
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const cotizacions = useSelector(store => store.cotizacions);
    const { cotizacion } = cotizacions;

    const dispatch = useDispatch();
    
    const [form, setForm] = useState({
        cantidad: 1
    })
    const [valor, setValor] = useState(0);

    const distribuidor = terminado.linea.percentages && terminado.linea.percentages.length ? terminado.linea.percentages[0].distribuidor : 0
    const Pfinal = terminado.linea.percentages && terminado.linea.percentages.length ? terminado.linea.percentages[0].final : 0
    const [mt, setMt] = useState(0);
    const getValor = (val) => {
        setValor(val)
    }

    const generatePrice = async () => {
        let valorPromedio = valor;
        let medida = terminado.medida;
        console.log(terminado)
        // Área Definida
        let areaDefinida = Number(Number(medida.split('X')[0]) * Number(medida.split('X')[1]))
        // Obtenemos el valor del MT2.
        let valorMt2 = Number(valorPromedio) / areaDefinida
        // Área a consumir
        const AreaAConsumir =  Number(Number(howMany.split('X')[0] * howMany.split('X')[1])).toFixed(2)
        console.log('Area', AreaAConsumir)
        console.log('Valor Promedio', valorPromedio)
        console.log('Área definida', areaDefinida)

        console.log('Valor MT', valorMt2)

        const valorTotal = AreaAConsumir * valorMt2;
        setMt(valorTotal)
        return valorTotal;
    }
    const addItem = async () => {
        const body = {
            cotizacionId: area,
            productoId: terminado.id,
            cantidad: form.cantidad,
            medida: howMany,
            precio: terminado.unidad == 'mt2' ? Number(mt * form.cantidad).toFixed(0) : Number(valor * howMany).toFixed(0),
            areaId: area,
            areaCotizacionId: cotizacion.id
        }
        console.log(body)
        if(!form.cantidad || form.cantidad == 0) return dispatch(actions.HandleAlerta('Debes ingresar una cantidad valida', 'mistake'));
 
        const sendPetion = await axios.post('api/cotizacion/add/producto/item', body )
        .then((res) => {
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
            dispatch(actions.axiosToGetCotizaciones(false, user.user.id))
            dispatch(actions.HandleAlerta('Kit agregado con éxito', 'positive'))
    
        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta('No hemos logrado agregar este producto a la cotización', 'mistake'))
        })
        return sendPetion; 
    }  
    useEffect(() => {
        setActive(null)
    }, [terminado])

    useEffect(() => {
        if(terminado.unidad == 'mt2') generatePrice() 
    }, [howMany])

    return ( 
        <div className="superKitItem">
            {
                !active ?
                <div className="Divide" onClick={() => {
                        setActive('active')
                        terminado.unidad == 'mt2' ? generatePrice() : null
                    }}>
                    <div className="leftImg">
                        <div className="boxDiv" style={{
                            width:40,
                            height:40,
                            borderRadius:100,
                            backgroundColor: 'black',
                            display: 'flex',
                            alignItems:'center',
                            justifyContent: 'space-around'
                        }}>
                            <h1 style={{color: 'white', fontWeight:400,fontSize:14}}>{terminado.item[0]}</h1>
                        </div>
                    </div> 
                    <div className="titleData" style={{marginTop:-30}}>
                        <h3>{terminado.item}  </h3> 
                        <span>{terminado.description}</span><br />
                        <GetPrice getValor={getValor} estado={final} distribuidor={distribuidor} final={Pfinal} precios={terminado.productPrices} terminado={terminado} />
                        <span>{ new Intl.NumberFormat('es-CO', {currency:'COP'}).format(valor) } COP</span>
                    </div>
                </div>
                :
                <div className="Divide" >
                    <div className="leftImg"> 
                        <div className="boxDiv">
                            <h1>{terminado.item[0]} </h1>
                        </div>
                    </div>
                    <div className="titleData"  style={{marginTop:-10}}>
                        <h3>{terminado.item} {terminado.unidad == 'mt2' ? <strong>{`(MT2)`}</strong> : null} </h3> 
                        <div className="form"  >
                            {
                                terminado.unidad == 'mt2' ?
                                    <label htmlFor="">
                                        {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(
                                            Number(mt * form.cantidad).toFixed(0)
                                        )}
                                         <span> COP</span>
                                        <div>
                                        </div>
                                    </label>
                                : 
                                 <label htmlFor=""> Precio normal {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(valor * howMany).toFixed(0))} COP</label>
                                }
                                <br />
                            <input type="text" id={terminado.id} placeholder={terminado.unidad == 'mt2' ? 'Medida. Ejemplo: 1.70X2.30' : "Cantidad"}
                            onChange={(e) => {
                                setHowMany(e.target.value)
                            }} value={howMany.toUpperCase()}/>

                            {
                                terminado.unidad == 'mt2' && (
                                    <input type="text" id={terminado.id+2} placeholder={"Cantidad"}
                                    onChange={(e) => {
                                        setForm({
                                            ...form,
                                            cantidad: e.target.value
                                        })
                                    }} value={form.cantidad}/>
                                )
                            }


                            <button onClick={() => {
                                addItem()
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
                {/* <GetaAllKit kits={superkit.kits} enviarAlAbuelo={recibirValor} dis={dis} /> */}
            </div>
        </div>
    )
}


function GetPrice({ precios, terminado, getValor, final, distribuidor, estado }){
    const valor = precios.reduce((a,b) => Number(a) + Number(b.valor), 0)
    const promedio = Number(valor) / precios.length

    const  precioDistribuidor = promedio / distribuidor
    const precioFinal = precioDistribuidor / final
    useEffect(() => {
        getValor(estado ? precioFinal.toFixed(0) : precioDistribuidor.toFixed(0))
    }, [promedio, estado])
    return (
    //    <h1>{estado ? precioFinal.toFixed(0) : precioDistribuidor.toFixed(0)}</h1>
        <></>
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
