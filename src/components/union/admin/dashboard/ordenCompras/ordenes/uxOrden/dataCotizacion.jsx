import React, { useState } from 'react';
import { FaCircleCheck, FaCircleExclamation } from 'react-icons/fa6';
import ItemCotizacionCompras from './itemCotizacionCompras';
import * as actions from '../../../../../../store/action/action';

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/es"; // para español
import axios from 'axios';
import { useDispatch } from 'react-redux';

dayjs.extend(localizedFormat);
dayjs.locale("es");


export default function DataCotizacion({ orden }){
    let creadoFecha = dayjs(orden.createdAt).format("dddd, D [de] MMMM YYYY, h:mm A");
    let ordenDeCompra = orden.dayCompras ? dayjs(orden.dayCompras).format("dddd, D [de] MMMM YYYY, h:mm A") : null;
    let aprobadaCompra  = orden.daysFinish ? dayjs(orden.dayFinish).format("dddd, D [de] MMMM YYYY, h:mm A") : null;


    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    // 🔹 proyectos únicos de todos los items
    const proyectos = orden?.requisiciones ?? [];


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
                        <div className="circle">
                            <FaCircleExclamation className="icon" />
                        </div>
                        <h3>Aprobación</h3>
                        <span>{aprobadaCompra ? aprobadaCompra : `Pendiente`}</span>
                    </div>
                </div>
                <div className="dataCotizacionReal">
                    <div className="containerDataRealCotizacion">
                        <div className="topData">
                            {
                                orden.estadoPago == 'comprado' ?
                                    <div className="topLadeRight">
                                        <h3>Comprado</h3>
                                    </div>
                                :
                                    <div className="topLadeRight">
                                        <button>
                                            <span>Regresar a compras</span>
                                        </button>
                                        <button className="go" onClick={() => {
                                            !loading ? aprobarCompras() : null
                                        }}>
                                            <span>{loading ? 'Aprobando...' : 'Aprobar'}</span>
                                        </button>

                                    </div>
                            }
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
                                        <span>Total</span>
                                        <h1>$ {totalCotizacion ? new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(totalCotizacion).toFixed(0)) : 0} </h1>
                                        <span>{proyectos?.length} Proyectos</span>
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
                                            <th className="hidden">Cantidad</th>
                                            <th>Precio</th>
                                            <th>Total</th>
                                            {proyectos.map((proy) => (
                                                <th key={proy.id}>
                                                    {proy.id} <br />
                                                    {proy.nombre}
                                                </th>
                                            ))}

                    
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orden?.comprasCotizacionItems?.map((item, i) => (
                                            <ItemCotizacionCompras item={item} proyectos={proyectos}/>
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