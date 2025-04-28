import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SelectKits from "./selectKits";
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from "react-redux";
import CotizacionDescription from "./cotizacionDescription";

export default function ModalNewCotizacion(){
    const [params, setParams] = useSearchParams();
 
    const cotizacions = useSelector(store => store.cotizacions);
    const { cotizacion, loadingCotizacion } = cotizacions;
    const dispatch = useDispatch();
    useEffect(() => {
        // dispatch(actions.getKit(null))
    }, [params.get('w')])
    return (
        <div className="modal"> 
            <div className="containerModal Complete">
                <div className="topBigModal">
                    <h3>Nueva cotización</h3>
                    <button onClick={() => {
                        params.delete('w');
                        setParams(params);
                        dispatch(actions.getCotizacion(null))
                    }}>X</button>
                </div>
                <div className="bodyModalBig">
                    <div className="page">
                        {
                            !cotizacion && loadingCotizacion ?
                                <h1>Cargando</h1>
                            : !cotizacion && !loadingCotizacion ? 
                                <CotizacionDescription />
                            : <SelectKits />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}