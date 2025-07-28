import React, { useEffect } from 'react';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos, MdOutlineArrowOutward, MdOutlineOpenInNew } from "react-icons/md";
import * as actions from '../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import CotizacionItemProduccion from './itemCotizacion';
import { useSearchParams } from 'react-router-dom';
import DocumentCotizacion from '../production copy/cotizacion/cotizacion';
export default function GeneralProduction(){
    
    const dispatch = useDispatch();
    const administracion = useSelector(store => store.admin);
    const [params, setParams] = useSearchParams();
    const { cotizacionesProduccion, loadingCotizacionesProduccion } = administracion;
    
    useEffect(() => {
        dispatch(actions.axiosToGetCotizacionesProduccion(false))
    }, []) 

    return (
            <div className="divideMiddleData">
                    <div className="containerDivide">
                        {/* <div className="leftDivideLogs">
                            <div className="boxLogs">
                                <div className="headerBox">
                                    <h3>
                                        Historial últimos kit's
                                    </h3>
                                    
                                    <button>
                                        <MdOutlineOpenInNew className="icon" />
                                    </button>
                                </div>
                                <div className="containerListsLogs">
                                    <table>
                                        <tbody>
                                            <tr  className="itemLog">
                                                <td className='short'>
                                                    <div className="coding">
                                                        <h3>132</h3>
                                                    </div>
                                                </td>
                                                <td className='longer'>
                                                    <div className="nameData">
                                                        <h3>Pedestal 2x1 17x2x5</h3>
                                                        <span>17 de Julio del 2025</span>
                                                    </div>
                                                </td>
                                                <td className='short'>
                                                    <div className="btn">
                                                        <button>
                                                            <MdOutlineArrowOutward className="icon" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr  className="itemLog">
                                                <td className='short'>
                                                    <div className="coding">
                                                        <h3>132</h3>
                                                    </div>
                                                </td>
                                                <td className='longer'>
                                                    <div className="nameData">
                                                        <h3>Pedestal 2x1 17x2x5</h3>
                                                        <span>17 de Julio del 2025</span>
                                                    </div>
                                                </td>
                                                <td className='short'>
                                                    <div className="btn">
                                                        <button>
                                                            <MdOutlineArrowOutward className="icon" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr  className="itemLog">
                                                <td className='short'>
                                                    <div className="coding">
                                                        <h3>132</h3>
                                                    </div>
                                                </td>
                                                <td className='longer'>
                                                    <div className="nameData">
                                                        <h3>Pedestal 2x1 17x2x5</h3>
                                                        <span>17 de Julio del 2025</span>
                                                    </div>
                                                </td>
                                                <td className='short'>
                                                    <div className="btn">
                                                        <button>
                                                            <MdOutlineArrowOutward className="icon" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="boxLogs">
                                <div className="headerBox">
                                    <h3>
                                        Historial últimos Productos
                                    </h3>
                                    
                                    <button>
                                        <MdOutlineOpenInNew className="icon" />
                                    </button>
                                </div>
                                <div className="containerListsLogs">
                                    <table>
                                        <tbody>
                                            <tr  className="itemLog">
                                                <td className='short'>
                                                    <div className="coding">
                                                        <h3>132</h3>
                                                    </div>
                                                </td>
                                                <td className='longer'>
                                                    <div className="nameData">
                                                        <h3>Pedestal 2x1 17x2x5</h3>
                                                        <span>17 de Julio del 2025</span>
                                                    </div>
                                                </td>
                                                <td className='short'>
                                                    <div className="btn">
                                                        <button>
                                                            <MdOutlineArrowOutward className="icon" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr  className="itemLog">
                                                <td className='short'>
                                                    <div className="coding">
                                                        <h3>132</h3>
                                                    </div>
                                                </td>
                                                <td className='longer'>
                                                    <div className="nameData">
                                                        <h3>Pedestal 2x1 17x2x5</h3>
                                                        <span>17 de Julio del 2025</span>
                                                    </div>
                                                </td>
                                                <td className='short'>
                                                    <div className="btn">
                                                        <button>
                                                            <MdOutlineArrowOutward className="icon" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr  className="itemLog">
                                                <td className='short'>
                                                    <div className="coding">
                                                        <h3>132</h3>
                                                    </div>
                                                </td>
                                                <td className='longer'>
                                                    <div className="nameData">
                                                        <h3>Pedestal 2x1 17x2x5</h3>
                                                        <span>17 de Julio del 2025</span>
                                                    </div>
                                                </td>
                                                <td className='short'>
                                                    <div className="btn">
                                                        <button>
                                                            <MdOutlineArrowOutward className="icon" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div> */}
                        <div className="rigthOtheInformationLists"  style={{width:'100%'}}>
                            <div className="listDataPrincipal">
                                <div className="headerTitle" >
                                    <h3>Pedidos de producción</h3>
                                </div>
                                <div className="dataTableTask">
                                    <div className="containerDataTask">
                                        <div className="tableData">
                                            <table>
                                            <tbody>
                                                {
                                                    !cotizacionesProduccion || loadingCotizacionesProduccion ?
                                                        <div className="notFound">
                                                            <h3>Cargando</h3>
                                                        </div>

                                                    : cotizacionesProduccion == 404 || cotizacionesProduccion == 'notrequest' ?
                                                        <div className="notFound">
                                                            <h3>No hay proyectos por el momento</h3>
                                                        </div>
                                                    : cotizacionesProduccion?.length ?
                                                        cotizacionesProduccion.map((r, i) => {
                                                        return (
                                                                <CotizacionItemProduccion item={r} key={i+1} />
                                                        )
                                                        })
                                                    :
                                                        <div className="notFound">
                                                            <h3>No hay proyectos por el momento</h3>
                                                        </div>
                                                }
                                            </tbody>
                                        </table>
                                        </div>

                                    </div>
                                </div>
                                {
                                    params.get('watch') == 'cotizacion' ?
                                        <DocumentCotizacion />
                                    : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
    )
}