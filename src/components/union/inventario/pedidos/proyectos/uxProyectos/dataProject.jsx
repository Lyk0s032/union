import React, { useState } from 'react';
import { FaCircleCheck, FaCircleExclamation } from 'react-icons/fa6';
import * as actions from '../../../../../store/action/action';

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/es"; // para español
import axios from 'axios';
import { useDispatch } from 'react-redux';
import ItemNecesidadProyecto from './itemNecesidas';

dayjs.extend(localizedFormat);
dayjs.locale("es");


export default function DataProject({ proyecto }){

    return (
        <div className="DataCotizacionCompras">
            <div className="TopGeneralInformation">
                <div className="lineProgress">
                    <div className="itemHere">
                        <div className="circle">
                            <FaCircleCheck className="icon Active" />
                        </div>
                        <h3 className='Active'>Cotización creada</h3>
                        <span>Fecha aquí </span>
                    </div>

                    <div className="itemHere">
                        <div className="circle">
                            <FaCircleCheck className="icon Active" />
                        </div>
                        <h3 className='Active'>Cotización aprobada</h3>
                        <span>Fecha aquí </span>
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
                                        <span>Cotización número: {proyecto.id}</span><br /><br />
                                        <h3>{proyecto.name}</h3>
                                        <br />
                                        <span>Cliente</span>
                                        <h4>{proyecto.client?.nombre}</h4>
                                        <span>NIT: {proyecto.client?.nit}</span> 

                                    </div>
                                    
                                </div>
                                <div className="lade Right">
                                    <div className="price">
                                        <span>Estado</span>
                                        <h1>{proyecto.state}</h1>
                                        <span>Información limitada para almacén</span>
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
                                            <th>Cantidades</th>
                                        </tr>
                                    </thead>
                                    <tbody> {console.log(proyecto.cotizacion_compromisos)}
                                        {
                                            proyecto.cotizacion_compromisos?.map((item, i) => {
                                                return (
                                                    <ItemNecesidadProyecto item={item} key={i+1} />
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}