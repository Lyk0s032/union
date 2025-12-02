import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LeftNavProject from "./leftNav";
import DetallesProject from "./detalles";
import * as actions from './../../../../store/action/action';
import { useDispatch, useSelector } from "react-redux";
import MateriaProject from "./materia";

export default function Project(){
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const requisicion = useSelector(store => store.requisicion);
    const { productionItem, loadingProductionItem } = requisicion;

    console.log(productionItem, loadingProductionItem)

    useEffect(() => {
        dispatch(actions.axiosToGetItemProduction(true, params.get('project')))
    }, [params.get('project')])
    return (
        <div className="modal" style={{zIndex:5}} > 
            <div className="hiddenModal"></div>
            <div className="containerModal UXCOMPLETE">
                <div className="comprar"> 
                    <div className="leftNavUX">
                        <LeftNavProject />
                    </div>
                    {
                        loadingProductionItem || !productionItem ?

                            <div className="boxLoading">
                                <div className="itemCenter">
                                    <h1>Cargando</h1>
                                </div>
                            </div>
                        :
                        productionItem == 404 || productionItem == 'notrequest' ?
                            <div className="boxLoading">
                                <div className="itemCenter">
                                    <h1>Cargando</h1>
                                </div>
                            </div>
                        :
                            <div className="rightUx">
                                <button onClick={() => {
                                    params.delete('project')
                                    setParams(params);
                                }}>x</button>
                                {
                                    params.get('s') == 'detalles' ?
                                        <DetallesProject project={productionItem}/>
                                    :
                                        <MateriaProject project={productionItem} />
                                }
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}