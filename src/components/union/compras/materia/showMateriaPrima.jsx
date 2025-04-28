import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AddPrice from './addPrice';
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import General from './general';

export default function ShowMateriaPrima(){
    const [params, setParams] = useSearchParams();
    const [show, setShow] = useState(null);

    const dispatch = useDispatch();

    const mt = useSelector(store => store.prima);
    const { prima, loadingPrima } = mt;
    

    useEffect(() => {
        dispatch(actions.axiosToGetPrima(true, params.get('prima')))
    }, [params.get('prima')])
    return (
        !prima || loadingPrima ?
        <div className="showProveedor">
            <div className="containerShow">
                <h1>Loading</h1>
            </div>
        </div>
        :
        <div className="showProveedor">
            <div className="containerShow">
                <div className="topProvider"> 
                    <div className="divideTop">
                        <button onClick={() => {
                            params.delete('prima');
                            setParams(params);
                        }}>
                            <span>Volver</span>
                        </button>
                        <div className="title">
                            <h3>{prima.item} - {prima.description}</h3>
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
                                    <General prima={prima} />
                                : show == 'price' ?
                                    <AddPrice prima={prima}/>
                                : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}