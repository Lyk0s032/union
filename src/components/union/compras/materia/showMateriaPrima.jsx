import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AddPrice from './addPrice';
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import General from './general';
import { MdArrowBack } from 'react-icons/md';
import ItemAddPrice from './itemAddPrice';

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
                <div className="loading">
                    <div className="dataLoading">
                        <span>Presiona Esc para cancelar</span>
                        <h1>Cargando...</h1>
                    </div>
                </div>
            </div>
        </div>
        : prima == 404 || prima == 'notrequest' ? 
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
            <div className="containerShow">  {console.log(prima)}
                <div className="topProvider"> 
                    <div className="divideTop">
                        <button onClick={() => {
                            params.delete('prima');
                            setParams(params);
                        }}>
                            <MdArrowBack className="icon" />
                        </button>
                        <div className="title">
                            <div className="divideThat">
                                <div className="letter">
                                    <h3>{prima.id}</h3>
                                </div>
                                <div className="dataThis">
                                    <span>{prima.item}</span>
                                    <h3>{prima.description}</h3>
                                </div>
                            </div>
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
                                    <li className={show == 'analisis' ? 'Active' : null} onClick={() => setShow('analisis')}>
                                        <div>
                                            <span>Analisis</span>
                                        </div>
                                    </li>
                                    
                                </ul>
                            </nav>
                        </div>
                        <div className="containerShow">
                            {
                                !show || show == 'general' ?
                                <>
                                    <General prima={prima} />
                                    <AddPrice prima={prima}/>
                                </>
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