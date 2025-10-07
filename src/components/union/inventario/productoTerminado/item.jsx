import React, { useEffect } from 'react';
import DataProducto from './dataProducto';
import DataBodegas from './dataBodegas';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';

export default function ItemAlmacen(){
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const almacen = useSelector(store => store.almacen);

    const { item, loadingItem } = almacen;
    
    useEffect(() => {
        dispatch(actions.axiosToGetItemMateriaPrima(true, params.get('item')));
    }, [params.get('item')])

    console.log(item, loadingItem)
    return (
        <div className="modal">
            <div className="containerModal Complete">
                {
                    params.get('item') == '' || !params.get('item') ?
                        <div className="messageModal">
                            <h4>Not found</h4>
                        </div> 
                    : 
                    !item && loadingItem ?
                        <div className="messageModal">
                            <h4>Cargando....</h4>
                        </div> 
                    :

                    item == 'notrequest' || item == 404 ?
                        <div className="messageModal">
                            <h4>No hemos logrado cargar esto</h4>
                        </div> 
                    :
                    !item ? null : 
                    <div className="almacenDashProduct"> 
                        <div className="topProductoData">
                            <div className="leftInforProduct">
                                <DataProducto item={item} />
                            </div>
                            <div className="rightBtn">
                                <button onClick={() => {
                                    params.delete('show')
                                    params.delete('who')
                                    params.delete('item')
                                    setParams(params);

                                }}>x</button>
                            </div>
                        </div>
                        <div className="dataProductoInformation">
                            <div className="containerData">
                                <DataBodegas item={item}/>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}