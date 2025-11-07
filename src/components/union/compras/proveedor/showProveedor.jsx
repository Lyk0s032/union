import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import GeneralPv from './general';
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import ListaProductosProveedor from './ListaProductosProveedor';
import { MdArrowBack } from 'react-icons/md';
import GraphProviderPrices from '../materia/analisis/graphPricesProvider';
import GraphProviderPricesProducto from '../productoTerminado/analisis/graphPriceProducto';

export default function ShowProveedor(){
    const [params, setParams] = useSearchParams();
    const [show, setShow] = useState(null);
    const dispatch = useDispatch();

    const mt = useSelector(store => store.provider);
    const { provider, loadingProvider } = mt;

    useEffect(() => {
        dispatch(actions.axiosToGetProvider(true, params.get('provider')))
    }, [params.get('provider')])
    return (
        !provider || loadingProvider ?
            <div className="showProveedor">
                <div className="containerShow">
                    <div className="loading">
                        <div className="dataLoading">
                            <span>Presiona Esc para cancelar</span>
                            <h1>Cargando...</h1>
                        </div>
                    </div>
                </div>
            </div>
        : provider == 404 || provider == 'notrequest' ? 
            <div className="showProveedor">
                <div className="containerShow">
                    <div className="loading">
                        <div className="dataLoading">
                            <span>Presiona Esc para cancelar</span>
                            <h1>No hemos encontrado esto</h1>
                        </div>
                    </div>
                </div>
            </div>
        :
        <div className="showProveedor">
            <div className="containerShow">
                <div className="topProvider">
                    <div className="divideTop">
                        <button onClick={() => {
                            params.delete('provider');
                            setParams(params);
                        }}>
                            <MdArrowBack className="icon" />
                        </button>

                        <div className="title">
                            <h3>{provider.nombre}</h3>
                            <span>NIT: {provider.nit}</span>    
                        </div>
                    </div>
                </div>
                <div className="bodyProvider">
                    <div className="containerBodyProvider">
                        <div className="navigationBody">
                            <nav>
                                <ul>
                                    <li className={!show || show == 'general' ? 'Active' : null} onClick={() => setShow('general')}>
                                        <div>
                                            <span>General</span>
                                        </div>
                                    </li>
                                    <li className={show == 'items' ? 'Active' : null} onClick={() => setShow('items')}>
                                        <div>
                                            <span>Ver productos</span>
                                        </div>
                                    </li>

                                </ul>
                            </nav>
                        </div>
                        <div className="containerShow">
                            {
                                !show || show == 'general' ?
                                    <GeneralPv provider={provider} />
                                :  show == 'items' ?
                                    <ListaProductosProveedor provider={provider} />
                                : null
                            }

                            {
                                params.get('prima') ?
                                    <GraphProviderPrices  />
                                : params.get('producto') ?
                                    <GraphProviderPricesProducto />    
                                : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}