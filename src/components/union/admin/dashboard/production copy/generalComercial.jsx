import React, { useEffect } from 'react';
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos, MdOutlineArrowOutward, MdOutlineOpenInNew } from "react-icons/md";
import * as actions from '../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import CotizacionItemGeneral from './itemCotizacion';
import DocumentCotizacion from './cotizacion/cotizacion';
import { useSearchParams } from 'react-router-dom';

export default function GeneralComercial(){
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
                                    <h3>Proyectos por aprobar</h3>
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
                                                                        <CotizacionItemGeneral item={r} />
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