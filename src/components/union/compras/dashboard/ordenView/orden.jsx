import React, { useEffect, useRef } from 'react';
import { AiOutlineDownload, AiOutlineExclamation } from 'react-icons/ai';
import { MdOutlineCheck } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';


import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/es"; // para español
import axios from 'axios';
import PdfDocument from './documentPdf';
import { PDFDownloadLink } from '@react-pdf/renderer';

dayjs.extend(localizedFormat);
dayjs.locale("es");


export default function Orden(){
    const [params, setParams] = useSearchParams();

    const btn = useRef(null);
    const factura = useRef(null);
    const dispatch = useDispatch();
    const admin = useSelector(store => store.admin);
    const { ordenCompras, loadingOrdenCompras, ordenesCompras } = admin;

    const closeComprar = () => {
        params.delete('orden')
        setParams(params);
    } 


    const OrdenesTotal = ordenCompras?.comprasCotizacionItems?.reduce((acc, curr) => {
            return acc + Number(curr.precioTotal);
        // 3. Si no coincide, simplemente retornamos el acumulador sin cambios.
    }, 0);

    let creadoFecha = dayjs(ordenCompras?.createdAt).format("dddd, D [de] MMMM YYYY, h:mm A");
    let ordenDeCompraTime = ordenCompras?.dayCompras ? dayjs(ordenCompras.dayCompras).format("dddd, D [de] MMMM YYYY, h:mm A") : null;
    let aprobadaCompra  = ordenCompras?.daysFinish ? dayjs(ordenCompras.daysFinish).format("dddd, D [de] MMMM YYYY, h:mm A") : null;
    
 {console.log('ordeen', ordenCompras)}
    useEffect(() => {
        dispatch(actions.axiosToGetOrdenComprasAdmin(true, params.get('orden')))
    }, [params.get('orden')])

    return (
        <div className="ordenView">
            {
                !ordenCompras || loadingOrdenCompras ?
                    <div className="containerView">
                        <div className="dataHereMessage">
                            <div className="messageHere">
                                <span>Presiona Esc. Para salir</span>
                                <h3>Cargando...</h3>
                            </div>
                        </div>
                    </div>
                : ordenCompras == 404 || ordenCompras == 'notrequest' ?
                    <div className="containerView">
                        <div className="dataHereMessage">
                            <div className="messageHere">
                                <span>Presiona Esc. Para salir</span>
                                <h3>Ups. No hemos encontrado esto.</h3>
                            </div>
                        </div>
                    </div>
                :
                    <div className="containerView">
                        <div className="headerView">
                            <div className="divideZone">
                                <button onClick={() => {
                                    params.delete('orden');
                                    setParams(params);
                                }}>
                                     <span>x</span>
                                </button>
                                <div className="dataCoti">
                                    <PDFDownloadLink 
                                        document={
                                            <PdfDocument 
                                                ordenCompras={ordenCompras} 
                                                creadoSFecha={creadoFecha} 
                                                ordenDeCompraTime={ordenDeCompraTime} 
                                                aprobadaCompra={aprobadaCompra} 
                                                OrdenesTotal={OrdenesTotal}
                                            />
                                        } 
                                        fileName={`orden-compra-${ordenCompras.proveedor.nombre}.pdf`}
                                    >
                                        {({ loading }) => (
                                            <button style={{ 
                                                marginLeft: '10px', 
                                                padding: '5px 10px',
                                                fontSize: '14px',
                                            }}>
                                                <AiOutlineDownload className='icon' style={{fontSize:18, verticalAlign:'bottom'}} />
                                                <span style={{marginLeft:5}}>{loading ? 'Generando...' : 'Descargar PDF'}</span>
                                            </button>
                                        )}
                                    </PDFDownloadLink>
                                </div>
                                
                            </div>
                        </div>
                        <div className="containerScrollBody">
                            <div className="containerScroll">
                                <div className="titletThat">
                                    <span className='code'>Código: {ordenCompras.id}</span><br />
                                    <span>{ordenCompras.name}</span><br />
                                </div><br />
                                <div className="containerBarraContenido">
                                    <span>Estado</span>
                                    <div className="divideStates">
                                        <div className={"boxLadeCircle Active"}>
                                            <div className="circle">
                                                <MdOutlineCheck className='icon' />
                                            </div>
                                            <div className="dataText">
                                                <h3>Preorden</h3>
                                                <span>{creadoFecha}</span>
                                            </div>
                                        </div>
                                        <div className={ordenCompras.dayCompras ? "boxLadeCircle Active" : "boxLadeCircle"}>
                                            <div className="circle">
                                                <AiOutlineExclamation className="icon" />
                                            </div> 
                                            <div className="dataText">
                                                <h3>Orden de compra</h3>
                                                <span>
                                                    {
                                                        !ordenCompras.estadoPago ?
                                                            'Pendiente'
                                                        :
                                                        ordenDeCompraTime
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <div className={aprobadaCompra ? "boxLadeCircle Active" : "boxLadeCircle"}>
                                            <div className="circle">
                                                <AiOutlineExclamation className="icon" />
                                            </div>
                                            <div className="dataText">
                                                <h3>Aprobada</h3>
                                                <span>
                                                    {
                                                        aprobadaCompra ?
                                                        aprobadaCompra
                                                        : 'pendiente'
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="titleDiv">
                                    <span>Proveedor</span>
                                    <h3>{ordenCompras.proveedor.nombre}</h3>
                                    <strong>NIT: </strong> <span>{ordenCompras.proveedor.nit}</span><br /><br />
                                    <span>{ordenCompras.fecha.split('T')[0]}</span>
                                </div>
                                {
                                    ordenCompras.comprasCotizacionItems && ordenCompras.comprasCotizacionItems.length ?
                                        <div className="itemsOrden">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>Cantidad</th>
                                                        <th>Precio</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        ordenCompras.comprasCotizacionItems?.map((item, i) => {
                                                            return (
                                                                <tr>
                                                                    <td className="largeThis">
                                                                        <div className="divideThis">
                                                                            <div className="letter">
                                                                                <h3> {console.log('iteem chitio', item)}
                                                                                    {item.materiaId ? item.materiaId : null}
                                                                                    {item.productoId ? item.productoId : null}
                                                                                </h3>
                                                                            </div>
                                                                            <div className="data">
                                                                                <h3>
                                                                                    {item.materium?.description}
                                                                                    {item.producto?.item}

                                                                                </h3>
                                                                                <span>
                                                                                    {item.materium?.item}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <span>{item.cantidad}</span>
                                                                    </td>
                                                                    <td>
                                                                        <span>$ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(item.precioTotal)}</span>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                    
                                                </tbody>
                                            </table>

                                            <div className="note" style={{marginTop:30}}>
                                                <span style={{color: 'black', fontSize:12}}>Nota</span><br />
                                                <span style={{fontSize:14, color: '#666'}}>{ordenCompras.description}</span>
                                            </div>
                                        </div>
                                    : null
                                }

                                <div className="titleDiv Lade">
                                    <div className="price">
                                        <span>Precio</span>
                                        <h1>$ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(OrdenesTotal)}</h1>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
            }
        </div> 
    )
}