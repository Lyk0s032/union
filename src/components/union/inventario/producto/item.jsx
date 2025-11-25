import React, { useEffect } from 'react';
import DataProducto from './dataProducto';
import DataBodegas from './dataBodegas';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineClose } from 'react-icons/md';

export default function ItemAlmacen(){
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const almacen = useSelector(store => store.almacen);

    const { item, loadingItem } = almacen;
    
    useEffect(() => {
            const tipo = !params.get('bodega') || params.get('bodega') == 1 || params.get('bodega') == 4 ? 'MP' : 'PT'
            let rutaMP = tipo == 'MP' ? params.get('item') : null
            let rutaPT = tipo == 'PT' ? params.get('item') : null
            console.log('rutaaa mp', tipo)
            dispatch(actions.axiosToGetItemInventarioPlus(true, rutaMP, params.get('bodega'), rutaPT))
    }, [params.get('item'),  params.get('bodega')])

    console.log(item, loadingItem)
    return (
        <div className="modal">
            <div className="containerModal Complete">
                {
                    params.get('item') == '' || !params.get('item') ?
                        <div className="messageModalAlmacen">
                            <div className="boxDatica">
                                <span>Presiona Escape para cerrar</span>
                                <h3>Ups! No hemos logrado encontrar esto. <br />Intentalo más tarde...</h3>
                            </div>
                        </div> 
                    : 
                    !item || loadingItem ?
                        <div className="messageModalAlmacen">
                            <div className="boxDatica">
                                <span>Estamos ordenando tu información</span>
                                <h3>Espera un momento...</h3>
                            </div>
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

                                }}>
                                    <MdOutlineClose className="icon" />
                                </button>
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