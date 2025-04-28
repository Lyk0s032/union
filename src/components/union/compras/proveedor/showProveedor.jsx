import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import GeneralPv from './general';
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';

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
                <h1>Loading</h1>
            </div>
        </div>
        :
        <div className="showProveedor">
        {console.log(provider)}
            <div className="containerShow">
                <div className="topProvider">
                    <div className="divideTop">
                        <button onClick={() => {
                            params.delete('provider');
                            setParams(params);
                        }}>
                            <span>Volver</span>
                        </button>
                        <div className="title">
                            <h3>{provider.nombre}</h3>
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
                                    <li className={show == 'price' ? 'Active' : null} onClick={() => setShow('price')}>
                                        <div>
                                            <span>Actualizar precio</span>
                                        </div>
                                    </li>

                                </ul>
                            </nav>
                        </div>
                        <div className="containerShow">
                            {
                                !show || show == 'general' ?
                                    <GeneralPv provider={provider} />
                                :  null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}