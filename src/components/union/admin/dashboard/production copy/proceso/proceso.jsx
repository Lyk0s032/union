import React, { useEffect } from 'react';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos, MdOutlineArrowOutward, MdOutlineOpenInNew } from "react-icons/md";
import * as actions from '../../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import DocumentCotizacion from '../cotizacion/cotizacion';
import CotizacionItemGeneral from '../itemCotizacion';
import CotizacionItemProceso from './itemProceso';

export default function EnProcesoComercial(){
    const dispatch = useDispatch()
    const [params, setParams] = useSearchParams();
    const admin = useSelector(store => store.admin)
    const { cotizaciones, loadingCotizaciones } = admin;

    useEffect(() => {
            dispatch(actions.axiosToGetCotizacionesAdmin(true))
    }, [])
    return (
            <div className="divideMiddleData">
                    <div className="containerDivide">
                        <div className="rigthOtheInformationLists" style={{width:'100%'}}>
                            <div className="listDataPrincipal">
                                <div className="headerTitle" >
                                    <h3>Proyectos en proceso de compra</h3>
                                </div>
                                <div className="dataTableTask">
                                    <div className="containerDataTask">
                                    {
                                        !cotizaciones || loadingCotizaciones ?
                                            <div className="notFound">
                                                <h3>No hay proyectos por el momento</h3>
                                            </div>
                                        :
                                        cotizaciones == 404 || cotizaciones == 'notrequest' ?
                                            <div className="notFound">
                                                <h3>No hay proyectos por el momento</h3>
                                            </div>
                                        :
                                            <div className="tableData">
                                                <table>
                                                    <tbody>
                                                        {
                                                            cotizaciones?.length ?
                                                                cotizaciones.map((r) => {
                                                                    return (
                                                                        r.state == 'comprando' || r.state == 'aprobada' ?
                                                                            <CotizacionItemProceso item={r} />
                                                                        :null
                                                                    )
                                                                })
                                                            :null
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                    }
                                        
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
                </div>
    )
}