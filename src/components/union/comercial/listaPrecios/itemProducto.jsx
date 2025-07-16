import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { BsPencil, BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import * as actions from '../../../store/action/action';
import { MdDeleteOutline, MdOutlineFlag, MdOutlineRemoveRedEye, MdOutlineScreenShare } from "react-icons/md";
import axios from "axios";
import dayjs from "dayjs";
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/es'; // Idioma español
import { getPromedio } from "../../produccion/calculo";

export default function ItemProductoLista({ terminado }){

    const [valorProduccion, setValorProduccion] = useState(0);
    const { cotizacion } = useSelector(store => store.cotizacions);
    const dispatch = useDispatch();
    
    const distribuidor = terminado?.linea?.percentages?.length ? terminado.linea.percentages[0].distribuidor : 0;
    const final = terminado?.linea?.percentages?.length ? terminado.linea.percentages[0].final : 0;

    return (
        <div className="long" >
            <tr > 
                <td className="coding">
                    <div className="code">
                        <h3>{terminado.id}</h3>
                    </div>
                </td>
                <td style={{ width:'40%'}} >
                    <div className="titleNameKitAndData" style={{width:'100%'}}>
                        <div className="extensionColor">
                            <span style={{marginLeft:10}}></span>
                        </div>
                        <div className="nameData">
                            <h3>{terminado.item}</h3>
                            
                            <span style={{fontSize:11}}>{terminado.description}</span>
                            <br /><br />
                            <div className="pricesItems" style={{display:'flex', alignItems:'center',
                            marginBottom:10
                            }}>
                                <GetPrice distribuidor={distribuidor} final={final} precios={terminado.productPrices} terminado={terminado} />
                                
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </div>
    )
}

function GetPrice({ precios, final, distribuidor, estado }){
    const valor = precios.reduce((a,b) => Number(a) + Number(b.valor), 0)
    const promedio = Number(valor) / precios.length

    const  precioDistribuidor = promedio / distribuidor
    const precioFinal = promedio / final
    useEffect(() => {
    }, [promedio, estado]) 
    return (
        <>
            <h4 style={{fontWeight:400,fontSize:13}}>
                <span>Final</span><br />
                {new Intl.NumberFormat('es-CO', { currency: 'COP' }).format(Number(precioFinal).toFixed(0))} <span>COP</span>
            </h4>
            <h4 style={{marginLeft:20,fontWeight:400,fontSize:13}}>
                <span>Distribuidor</span><br />
                {new Intl.NumberFormat('es-CO', { currency: 'COP' }).format(Number(precioDistribuidor).toFixed(0))} <span>COP</span>
            </h4>
         {/* <strong>{estado ? new Intl.NumberFormat('es-CO', {currency:'COP'}).format(precioFinal.toFixed(0)) : new Intl.NumberFormat('es-CO', {currency:'COP'}).format(precioDistribuidor.toFixed(0))}</strong><br />
         <span>Precio básico: {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(promedio)}</span><br />
         <span>Precio distribuidor: {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(precioDistribuidor.toFixed(0))} - ({distribuidor})</span><br />
         <span>Precio Final: {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(precioFinal.toFixed(0))} - ({final})</span><br />

        <br /><br /> */}
        </>
    )
}