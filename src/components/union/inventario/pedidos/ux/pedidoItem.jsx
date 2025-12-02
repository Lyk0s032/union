import React, { useState } from 'react';
import * as actions from '../../../../store/action/action';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function PedidoItemAlmacen({ item }){

    console.log(item)
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const [loadingToAlmacen, setLoadingToAlmacen] = useState(false);
    const [loadingToAlmacenProject, setLoadingToAlmacenProject] = useState(false);

    const [form, setForm] = useState({
        cantidad: Math.abs(Number(item.cantidad)),
        bodegaId: item.materium ? 1 : 2,  
        materiaId: item.materium ? item.materiaId : null,
        productoId: item.materium ? null : item.productoId,
        tipo: 'ENTRADA',
        ubicacionOrigenId: item.materium ? 1 : 2,
        ubicacionDestinoId: item.materium ? 1 : 2,
        tipoProducto: item.materium ? 'Materia Prima' : 'Producto',
        refDoc: `ORDEN-${item.comprasCotizacionId}`,
        cotizacionId: null,
        numPiezas: Math.abs(Number(item.cantidad)),
        comprasCotizacionId: item.comprasCotizacionId
        
    })
    const [loading, setLoading] = useState(false);
    // const ingresarAlmacen = async () => {
    //     setLoadingToAlmacen(true)
    //     let body = {
    //         cantidad: item.cantidad,
    //         materiaId: item.materiaId,
    //         productoId: item.productoId,
    //         tipoProducto: item.materiaId ? 'Materia Prima' : 'Producto',
    //         tipo: 'ENTRADA',
    //         ubicacionOrigenId: item.materiaId ? 1 : 2,
    //         ubicacionDestinoId: item.materiaId ? 1 : 2,
    //         refDoc: item.id,
    //         cotizacionId: item.requisicionId

    //     }
    //     const send = await axios.post('api/inventario/post/bodega/addHowMany', body)
    //     .then(async res => {
    //         const sendToChange = await axios.get(`/api/requisicion/get/get/almacen/itemCotizacion/${item.id}`)
    //         return sendToChange
    //     }) 
    //     .then((res) => {
    //         dispatch(actions.axiosToGetOrdenAlmacen(false, params.get('pedido')))
    //         return res;
    //     })
    //     .catch(err => {
    //         console.log(err)
    //     })
    //     .finally(() => {
    //         setLoadingToAlmacen(false)
    //     })

    //     return send;
    // }

    const definitivaSend = async () => {
        let body = form
        console.log('body',body)
            
        // const sendRegister = await axios.post('/api/inventario/post/bodega/addHowMany', body)
        const sendRegisterThat = await axios.post('/api/inventario/post/bodega/moviemitos/add', body)
        .then(async (res) => {
            const sendToChange = await axios.get(`/api/requisicion/get/get/almacen/itemCotizacion/${item.id}`)
            return sendToChange
        })   
        .then(async (res) => {
            dispatch(actions.axiosToGetOrdenAlmacen(false, params.get('pedido')))
            return res.data
        })

        .catch(err => {
            console.log(err);
        })
        .finally(() => setLoading(false))
        return sendRegisterThat
    }

    const sendToProject = async () => {
        try{
            setLoadingToAlmacenProject(true)
            const sendFirst = await ingresarAlmacen()
            .then(async (res) => {
                let body = {
                    cantidad: item.cantidad,
                    materiaId: item.materiaId,
                    productoId: item.productoId,
                    tipoProducto: item.materiaId ? 'Materia Prima' : 'Producto',
                    tipo: 'TRANSFERENCIA',
                    ubicacionOrigenId: item.materiaId ? 1 : 2,
                    ubicacionDestinoId: item.materiaId ? 4 : 2,
                    refDoc: item.id,
                    cotizacionId: item.requisicionId

                }
                const send = await axios.post('api/inventario/post/bodega/addHowMany', body)
                .then(async res => {
                    const sendToChange = await axios.get(`/api/requisicion/get/get/almacen/itemCotizacion/${item.id}`)
                    return sendToChange
                }) 
                return send;
            })


        }catch(err){
            console.log(err);
            return ;
        }
    }
    return (
        <tr>
            <td className="longer"> 
                <div className="nameLonger">
                    <div className="letter">
                        <h3>{item.materiaId} </h3>
                    </div> 
                    <div className="name">
                        <h3>{item.materium?.description}</h3>
                        <span>{item.materium?.item}</span><br />
                    </div> 
                </div>
            </td>
            <td>
                <div>
                    <span>{item.cantidad}</span>
                </div>
            </td>
            <td>
                <div className=""> 
                    { 
                        item.estado == 'aprobado' ?
                        <button onClick={() => {
                            !loadingToAlmacen ? definitivaSend() : null
                        }}>
                            <span>{loadingToAlmacen ? 'Ingresando...' : 'Ingresar en almacén'}</span>
                        </button>
                        : 
                        <span style={{color: 'green'}}>Entregado</span>
                    }               
                </div>
            </td> 
            {/* <td>
                <div className="">
                    {
                        item.estado == 'aprobado' ?
                        <button onClick={() => {
                            sendToProject()
                        }}>
                            <span>Ingresar al proyecto</span>
                        </button>
                        : 
                        null
                    }

                </div>
            </td> */}
            <td>
                <div>
                    <span>{item.requisicion?.id} - {item.requisicion?.nombre}</span>
                </div>
            </td>
            
            
        </tr>
    )
}