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

export default function ItemKitLista({ kit }){

    const [valorProduccion, setValorProduccion] = useState(0);
    const { cotizacion } = useSelector(store => store.cotizacions);
    const dispatch = useDispatch();
    
    const distribuidor = kit?.linea?.percentages?.length ? kit.linea.percentages[0].distribuidor : 0;
    const final = kit?.linea?.percentages?.length ? kit.linea.percentages[0].final : 0;



    return (
        <div className="long" style={{width:'100%'}}>
            <tr  > 
                <td style={{width:'7%'}}>
                    <div className="code">
                        <h3>{kit.id}</h3>
                    </div>
                </td>
                <td style={{width:'90%'}} >
                    <div className="titleNameKitAndData">
                        <div className="extensionColor">
                            <div className="boxColor"></div>
                            <span>{kit.extension.name}</span>
                            <span style={{marginLeft:10}}></span>
                        </div>
                        <div className="nameData">
                            <h3>{kit.name}</h3>
                            
                            <span style={{fontSize:11}}>{kit.description}</span>
                            <br /><br />
                            <div className="pricesItems" style={{display:'flex', alignItems:'center',
                            marginBottom:10
                            }}>
                                <PrecioCalculado
                                    kit={kit}
                                    setValorProduccion={setValorProduccion}
                                    distribuidor={distribuidor}
                                    final={final}
                                />
                                
                            </div>
                        </div>
                    </div>
                </td>
                <td style={{width:'20%'}}> </td>

                <td style={{width:'5%'}}>

                </td>


                
            </tr>
        </div>
    )
}

function PrecioCalculado({ kit, setValorProduccion, distribuidor, final }) {
    const valorProduccion = useMemo(() => {
        if (!kit.itemKits || kit.itemKits.length === 0) return 0;
        const costos = kit.itemKits.map(item => getPromedio(item));
        return costos.reduce((acc, costo) => acc + costo, 0);
    }, [kit.itemKits]);

    useEffect(() => {
        setValorProduccion(valorProduccion);
    }, [valorProduccion, setValorProduccion]);

    const valorDistribuidor = (distribuidor > 0) ? (valorProduccion / Number(distribuidor)) : valorProduccion;
    const valorFinal = (final > 0) ? (valorDistribuidor / Number(final)) : valorDistribuidor;

    return (
        <>
            <h4 style={{fontWeight:400,fontSize:13}}>
                <span>Final</span><br />
                {new Intl.NumberFormat('es-CO', { currency: 'COP' }).format(Number(valorFinal).toFixed(0))} <span>COP</span>
            </h4>
            <h4 style={{marginLeft:20,fontWeight:400,fontSize:13}}>
                <span>Distribuidor</span><br />
                {new Intl.NumberFormat('es-CO', { currency: 'COP' }).format(Number(valorDistribuidor).toFixed(0))} <span>COP</span>
            </h4>
        </>
    );
}