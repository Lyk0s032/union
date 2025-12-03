import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { data, useSearchParams } from 'react-router-dom';
import * as actions from '../../../../../store/action/action';
import axios from 'axios';

export default function ItemListMP({ materia, sumar, productosTotal}){
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);
    const { ids, materiaIds, itemsCotizacions } = req;
    const [selected, setSelected] = useState(false)

    let cantidades = itemsCotizacions?.length ?  itemsCotizacions.filter(it => it.productoId === materia.id && ids.includes(it.requisicionId)) : null;
    let numero = cantidades?.length ? cantidades .reduce((acc, curr) => acc + Number(curr.cantidad), 0) : 0

    const precioPromedio = materia.precios.reduce((acc, it) => {
        return acc + Number(it.valor);
    }, 0); 



    console.log('productoo,', materia)
    const promedioUnidad = precioPromedio / materia.precios.length;
    const open = () => {
        dispatch(actions.gettingItemRequisicion(true))
        let body = {
            mpId: materia.id,
            ids: ids
        }
        const send = axios.post('/api/requisicion/get/materiales/producto/', body)
        .then((res) => {
            dispatch(actions.getItemRequisicion(res.data));
        }).catch(err => {
            console.log(err);
            dispatch(actions.getItemRequisicion(404));
        })

        return send
    }

    const handleClick = (e) => {
        if (e.ctrlKey) {
            setSelected(!selected);

           const existe = materiaIds.find(m => m.productoId == materia.id);
            console.log('materiaaas', materiaIds)
            if (existe) {
                // Si ya existe, lo quitamos
                const nuevo = materiaIds.filter(m => m.productoId !== materia.id);
                console.log('Quitando elemento:', nuevo);

                dispatch(actions.limpiarIds(nuevo)); 

                if(materia.unidad == 'estatico'){
                    return quitando()
                }else{
                    const findMt2Producto = productosTotal.find(i => i.id == materia.id)
                    const dataProducto = findMt2Producto ? findMt2Producto.productoCotizacion[0] : null
                    const medidaA = Number(dataProducto.medida.split('X')[0])
                    const medidaB = Number(dataProducto.medida.split('X')[1])
                    const medidaTotal = Number(medidaA * medidaB)
                    return quitando(medidaTotal)
                }
            } else {
                // SI es un producto terminado normal, ejecutamos normal
                if(materia.unidad == 'estatico'){
                    dispatch(actions.getMateriasIds({productoId: materia.id, cantidad: cantidadToPrices}));
                    console.log(materiaIds)
                    
                    return sumandito()
                }else{
                    const findMt2Producto = productosTotal.find(i => i.id == materia.id)
                    const dataProducto = findMt2Producto ? findMt2Producto.productoCotizacion[0] : null
                    const medidaA = Number(dataProducto.medida.split('X')[0])
                    const medidaB = Number(dataProducto.medida.split('X')[1])
                    const medidaTotal = Number(medidaA * medidaB)

                    dispatch(actions.getMateriasIds({productoId: materia.id, cantidad: medidaTotal}));
                    return sumandito(medidaTotal)

                }
                // // Si no existe, lo agregamos (sin mutar el array original)
                // dispatch(actions.getMateriasIds({productoId: materia.id, cantidad: cantidadToPrices}));
                // console.log(materiaIds)
                
                // console.log('ver datos de supercifie', materiaIds)
                // return sumandito()
            
            }

        } else {
            params.set('MP', materia.id);
            setParams(params);
            open();
        }
    };

    const handleDoubleClick = () => {
        // Por cada requisicionId, creamos o completamos el itemCotizacion

        const existe = materiaIds.find(m => m.productoId == materia.id);
        
        if (existe) {
            // Si ya existe, lo quitamos
            const nuevo = materiaIds.filter(m => m.materiaId !== materia.id);
            console.log('Quitando elemento:', nuevo);
            dispatch(actions.limpiarIds(nuevo));
            quitando()
        } else {
            // Si no existe, lo agregamos (sin mutar el array original)
            dispatch(actions.getMateriasIds({materiaId: materia.id, cantidad: cantidadToPrices}));
            console.log(materiaIds)
            sumandito()
        
        }
        ids.forEach(requisicionId => {
            const existe = itemsCotizacions.find(
                it =>
                    Number(it.productoId) === Number(materia.id) &&
                    Number(it.requisicionId) === Number(requisicionId)
            );

            // Si ya existe, solo mantenemos (o podrías sumar cantidades si quieres)
            if (!existe) {
                const objeto = {
                    productoId: materia.id,
                    requisicionId,
                    cantidad: materia.totalCantidad // o la lógica que definas
                };
                dispatch(actions.getItemsForCotizacion(objeto));
            } 
        });
    };

    let cantidadToPrices = Number(Math.ceil(Number( Number(materia?.totalCantidad) / Number(materia.medida) )).toFixed(0))

    const sumanditoParaProducto = () => {
        if(Number(materia.entrado >= Number(materia.totalCantidad))){
            console.log('ya esta comprado')
            return
        }else if(Number(materia.entregado) > 0 && Number(materia.entregado) < Number(materia.totalCantidad)){
            let cantidadPrice = Number(Number(cantidadToPrices) * Number(promedioUnidad)) 
            console.log('proyecto a sumar-------',materia.nombre, cantidadPrice) 
            sumar(cantidadPrice)
        }
    } 
    const sumandito = (cantidad) => {
        if(Number(materia.entregado) >= Number(materia.totalCantidad)){
            console.log('completo')
        } else if(Number(materia.entregado) > 0 && Number(materia.entregado) < Number(materia.totalCantidad)){
                let cantidadPrice = Number(Number(cantidadToPrices) * Number(promedioUnidad)) 
                console.log('proyecto a sumar-------',materia.nombre, cantidadPrice) 
                console.log(cantidadPrice)
                sumar(cantidadPrice)
            
        }else{

                let cantidadPrice = Number(Number(cantidad ? cantidad : cantidadToPrices) * Number(promedioUnidad)) 
                console.log('proyecto a sumar-------',materia.nombre, cantidadPrice) 
                sumar(cantidadPrice)
        }
            
    }
    const quitando = (cantidad) => {
        if(Number(materia.entregado) >= Number(materia.totalCantidad)){
            console.log('completo') 
        } else if(Number(materia.entregado) > 0 && Number(materia.entregado) < Number(materia.totalCantidad)){
            let cantidadPrice = Number(cantidad ? Number(cantidad) * Number(promedioUnidad) : (Number(cantidadToPrices)) * Number(promedioUnidad)) 
            console.log('proyecto a sumar-------',materia.nombre, cantidadPrice) 
            sumar(cantidad ? cantidad : -cantidadPrice)
        }else{
            let cantidadPrice = Number(cantidad ? Number(cantidad) * Number(promedioUnidad) : (Number(cantidadToPrices)) * Number(promedioUnidad)) 
            sumar(-cantidadPrice)
        } 
    }
    return (
        <tr onClick={handleClick} onContextMenu={(e) => {              // 👈 click derecho
            e.preventDefault();              // evita que salga el menú del navegador
            // handleDoubleClick();             // llamas tu función
        }}
       className={ materiaIds.find(m => m.productoId == materia.id)  ? 'Active' : null}>
            <td className="longer"> 
                <div className="nameLonger">
                    <div className="letter">
                        <h3>{materia.id}</h3>
                    </div> 
                    <div className="name">
                        <h3>{materia.nombre}</h3>
                        <span>Producto terminado</span><br />

                        <span>
                            {
                                Number(materia.entregado) > 0 && Number(materia.entregado) < Number(materia.totalCantidad) ?
                                <span>
                                    Parcialmente comprado
                                </span>
                                : Number(materia.entregado) >= Number(materia.totalCantidad) ? 
                                <span style={{color: 'green'}}>Comprado</span>
                                : 
                                <span>Pendiente</span>
                            }
                        </span><br /><br />
                    </div> 
                </div>
            </td>
            <td className='hidden'>
               
            </td>
            <td>
                <div className=""> 
                    <span><strong>({numero ? numero : 0})</strong> - {materia.entregado} / {materia.totalCantidad}</span>
                </div>
            </td> 
            <td>
                <div className="">
                    <span>$ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(promedioUnidad).toFixed(0))}</span>
                </div>
            </td>
            <td>
                <div className="">
                    <span>$ {numero ? new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(promedioUnidad* numero).toFixed(0)) : new Intl.NumberFormat('es-CO', {currency:'COP'}).format(promedioUnidad)}</span>
                </div>
            </td>
        </tr>
    )
}