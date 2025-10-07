import React, { useState } from 'react';
import { FaCircleCheck, FaCircleExclamation } from 'react-icons/fa6';
import * as actions from '../../../../store/action/action';

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/es"; // para español
import axios from 'axios';
import { useDispatch } from 'react-redux';
import PedidoItemAlmacen from './pedidoItem';

dayjs.extend(localizedFormat);
dayjs.locale("es");


export default function DataCotizacion({ orden }){
    let creadoFecha = orden ? dayjs(orden.createdAt).format("dddd, D [de] MMMM YYYY, h:mm A") : null;
    let ordenDeCompra = orden?.dayCompras ? dayjs(orden.dayCompras).format("dddd, D [de] MMMM YYYY, h:mm A") : null;
    let aprobadaCompra  = orden?.daysFinish ? dayjs(orden.dayFinish).format("dddd, D [de] MMMM YYYY, h:mm A") : null;


    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    // 🔹 proyectos únicos de todos los items

{console.log(orden)}
      // Calcular el total de la cotización
    const totalCotizacion = orden?.comprasCotizacionItems?.reduce(
        (acc, item) => acc + Number(item.precioTotal),
        0
    );


    const aprobarCompras = async () => {
        try{
            setLoading(true)
            const send = await axios.get(`/api/requisicion/get/update/cotizacion/comprado/${orden.id}`)
            .then((res) => {
                dispatch(actions.axiosToGetOrdenComprasAdmin(false, orden.id))
            })
            .finally(() => {
                setLoading(false)
            })
        }catch(err){
            console.log(err);
            return null;
        }
    }
    return (
        <div className="DataCotizacionCompras">
            <div className="TopGeneralInformation">
                <div className="lineProgress">
                    <div className="itemHere">
                        <div className="circle">
                            <FaCircleCheck className="icon Active" />
                        </div>
                        <h3 className='Active'>Cotización creada</h3>
                        <span>{creadoFecha} </span>
                    </div>

                    <div className="itemHere">
                        <div className="circle">
                            <FaCircleCheck className="icon Active" />
                        </div>
                        <h3 className="Active">Orden de compra</h3>
                        <span>{ordenDeCompra}</span>
                    </div>

                    <div className="itemHere">
                        <div className="circle" >
                            <FaCircleExclamation className={orden.estadoPago == 'comprado' ? "icon Active" : 'icon'} />
                        </div>
                        <h3 className={orden.estadoPago == 'comprado' ? "Active" : null}>Aprobación</h3>
                        <span >{aprobadaCompra ? aprobadaCompra : `Pendiente`}</span>
                    </div>

                    <div className="itemHere">
                        <div className="circle">
                            <FaCircleExclamation className="icon" />
                        </div>
                        <h3>Entregado</h3>
                        <span>Pendiente</span>
                    </div>
                </div>
                <div className="dataCotizacionReal">
                    <div className="containerDataRealCotizacion">
                        <div className="topData">
                            <div className="divideCotizacion">
                                <div className="lade">
                                    <div className="itemBig">
                                        <span>Cotización número: {orden.id}</span><br /><br />
                                        <h3>{orden.name}</h3>
                                        <br />
                                        <span>Proveedor</span>
                                        <h4>{orden.proveedor?.nombre}</h4>
                                        <span>NIT: {orden.proveedor.nit}</span> 

                                    </div>
                                    
                                </div>
                                <div className="lade Right">
                                    <div className="price">
                                        <span>Estado</span>
                                        <h1>{orden.estadoPago == 'comprado' ? 'Pendiente' : orden.estadoPago == 'Entregado' ? 'Entregado' : null}</h1>
                                        <span>{orden?.comprasCotizacionItems?.length} Proyectos</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tableDataItems">
                            <div className="listaMP">
                                <table>
                                    <thead> 
                                        <tr>
                                            <th>Item</th>
                                            <th className="hidden"></th>
                                            <th></th>
                                            <th></th>
                                            <th>Proyecto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orden?.comprasCotizacionItems?.map((item, i) => (
                                            <PedidoItemAlmacen item={item} key={i+1}/>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="moreOptions">
                        <button>
                            <span>Cotizaciones que se considerarón</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}