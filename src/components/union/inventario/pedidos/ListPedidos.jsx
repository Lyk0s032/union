import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/action/action';
import dayjs from 'dayjs';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import ItemPedido from './itemPedido';

export default function ListPedidos({ ordenes }){
    const almacen = useSelector(store => store.almacen);
    
    const { productosBodega, loadingProductosBodega } = almacen;
    
    const dispatch = useDispatch();
    const [options, setOptions] = useState(null);
    const [productos, setProducto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [params, setParams] = useSearchParams();


    const searchKitsWithFunction = async (query) => {
        
        if(!query || query == '') return setProducto(null);
        setLoading(true);
        setProducto(null);

        const search = await axios.get('api/inventario/get/bodegas/items/query/search', {
            params: { 
                query: query,
                bodegaId: params.get('bodega') ? params.get('bodega') : 1
             },
        })
        .then((res) => {
            console.log(res.data)
            setProducto(res.data)
        })
        .catch(err => {
            console.log(err);
            setProducto(null)
            return null
        })
        .finally(() => setLoading(false))
        return search
    }
    return (
        <div className="listResultsData">
            <div className="containerKits">
                <div className="dataFilters">
                    <div className="searchDataInput">
                        {/* <input type="text" placeholder='Buscar materia prima' onChange={(e) => {
                            searchKitsWithFunction(e.target.value);
                        }}/> */}
                    </div>
                    <div className="containerDataFilters">
                        <div className="divide">
                                <div className="tableData">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th></th>
                                                    <th>Cantidad</th>
                                                    <th></th>

                                                </tr>
                                            </thead> 
                                            <tbody> 
                                                {
                                                    ordenes.map((orden, i) => {
                                                        return (
                                                            <ItemPedido key={i+1} orden={orden}/>    
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                </div>
                                    <div className="ContainerResultFilter">
                                            <div className="dataContainer">
                                                    <div className="boxContainer">
                                                        <div className="headerBox">
                                                            <h3>Solicitudes</h3>
                                                        </div>
                                                        <h3 className='h3'>{ordenes?.length}</h3>
                                                    </div>
                                            </div>
                                    </div>
                                
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}