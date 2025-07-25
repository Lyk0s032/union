import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import General from './general';
import AddPrice from './addPrice';

export default function ShowProductoTerminado(){
    const [params, setParams] = useSearchParams();
    const [show, setShow] = useState(null);

    const dispatch = useDispatch();

    const mt = useSelector(store => store.prima);
    const { producto, loadingProducto } = mt;

    useEffect(() => {
        dispatch(actions.axiosToGetProducto(true, params.get('producto')))
    }, [params.get('producto')])
    return (
        !producto || loadingProducto ?
        <div className="showProveedor">
            <div className="containerShow">
                <h1>Loading</h1>
            </div> 
        </div>
        :
        producto == 404 || producto == 'notrequest' ?
            <h1>No hemos encontrado esto.</h1>
        :
        <div className="showProveedor">
            <div className="containerShow">
                <div className="topProvider"> 
                    <div className="divideTop">
                        <button onClick={() => {
                            params.delete('producto');
                            setParams(params);
                        }}>
                            <span>Volver</span>
                        </button>
                        <div className="title">
                            <h3>{producto.item} - {producto.description}</h3>
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
                                    <General prima={producto} />
                                : show == 'price' ?
                                    <AddPrice prima={producto}/>
                                : null 
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}