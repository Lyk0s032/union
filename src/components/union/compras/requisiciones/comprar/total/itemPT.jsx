import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../../store/action/action';
import axios from 'axios';

export const sentItemIdss = new Set();


export default function ItemListPT({ productosTotal, materia, sumar }){
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);
    const { ids, materiaIds, itemsCotizacions, totalFaltanteProducto} = req;
    const [selected, setSelected] = useState(false)

    let cantidades = itemsCotizacions?.length ?  itemsCotizacions.filter(it => it.productoId === materia.id && ids.includes(it.requisicionId)) : null;
    let numero = cantidades?.length ? cantidades.reduce((acc, curr) => acc + Number(curr.cantidad), 0) : 0
    console.log('itemsCotizaciones', itemsCotizacions)
    console.log('cantidades', cantidades)
    console.log('numerooo', numero)
    const precioPromedio = materia.precios.reduce((acc, it) => {
        return acc + Number(it.valor);
    }, 0); 

    const cantidadAValorizar = materia.totalCantidad - materia.entregado;

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

    // const handleClick = (e) => {
    //     if (e.ctrlKey) {
    //         setSelected(!selected);

    //        const existe = materiaIds.find(m => m.productoId == materia.id);
    //         console.log('materiaaas', materiaIds)
    //         if (existe) {
    //             // Si ya existe, lo quitamos
    //             const nuevo = materiaIds.filter(m => m.productoId !== materia.id);
    //             console.log('Quitando elemento:', nuevo);
    //             dispatch(actions.limpiarIds(nuevo)); 
    //             quitando()
    //         } else {
    //             // Si no existe, lo agregamos (sin mutar el array original)
    //             dispatch(actions.getMateriasIds({productoId: materia.id, cantidad: cantidadToPrices}));
    //             console.log(materiaIds) 
    //             return sumandito()
            
    //         }

    //     } else {
    //         params.set('MP', materia.id);
    //         setParams(params);
    //         open();
    //     }
    // };

    // const handleDoubleClick = () => {
    //     // Por cada requisicionId, creamos o completamos el itemCotizacion

    //     const existe = materiaIds.find(m => m.productoId == materia.id);
        
    //     if (existe) {
    //         // Si ya existe, lo quitamos
    //         const nuevo = materiaIds.filter(m => m.materiaId !== materia.id);
    //         console.log('Quitando elemento:', nuevo);
    //         dispatch(actions.limpiarIds(nuevo));
    //         quitando()
    //     } else {
    //         // Si no existe, lo agregamos (sin mutar el array original)
    //         dispatch(actions.getMateriasIds({materiaId: materia.id, cantidad: cantidadToPrices}));
    //         console.log(materiaIds)
    //         sumandito()
        
    //     }
    //     ids.forEach(requisicionId => {
    //         const existe = itemsCotizacions.find(
    //             it =>
    //                 Number(it.productoId) === Number(materia.id) &&
    //                 Number(it.requisicionId) === Number(requisicionId)
    //         );

    //         // Si ya existe, solo mantenemos (o podrías sumar cantidades si quieres)
    //         if (!existe) {
    //             const objeto = {
    //                 productoId: materia.id,
    //                 requisicionId,
    //                 cantidad: materia.totalCantidad // o la lógica que definas
    //             };
    //             dispatch(actions.getItemsForCotizacion(objeto));
    //         } 
    //     });
    // };

   
    // const sumanditoParaProducto = () => {
    //     if(Number(materia.entrado >= Number(materia.totalCantidad))){
    //         console.log('ya esta comprado')
    //         return
    //     }else if(Number(materia.entregado) > 0 && Number(materia.entregado) < Number(materia.totalCantidad)){
    //         let cantidadPrice = Number(Number(cantidadToPrices) * Number(promedioUnidad)) 
    //         console.log('proyecto a sumar-------',materia.nombre, cantidadPrice) 
    //         sumar(cantidadPrice)
    //     }
    // } 
    // const sumandito = () => {
    //     if(Number(materia.entregado) >= Number(materia.totalCantidad)){
    //         console.log('completo')
    //     } else if(Number(materia.entregado) > 0 && Number(materia.entregado) < Number(materia.totalCantidad)){
    //             let cantidadPrice = Number(Number(cantidadToPrices) * Number(promedioUnidad)) 
    //             console.log('proyecto a sumar-------',materia.nombre, cantidadPrice) 
    //             console.log(cantidadPrice)
    //             sumar(cantidadPrice)
    //             let currently = cantidadPrice
    //             dispatch(actions.GetConsolidatoProyect(cantidadPrice))
            
    //     }else{

    //             let cantidadPrice = Number(Number(cantidadToPrices) * Number(promedioUnidad)) 
    //             console.log('proyecto a sumar-------',materia.nombre, cantidadPrice) 
    //             sumar(cantidadPrice)
    //             dispatch(actions.GetConsolidatoProyect(cantidadPrice))

    //     }
            
    // }
    // const quitando = () => {
    //     if(Number(materia.entregado) >= Number(materia.totalCantidad)){
    //         console.log('completo') 
    //     } else if(Number(materia.entregado) > 0 && Number(materia.entregado) < Number(materia.totalCantidad)){
    //         let cantidadPrice = Number(Number(cantidadToPrices) * Number(promedioUnidad)) 
    //         console.log('proyecto a sumar-------',materia.nombre, cantidadPrice) 
    //         sumar(-cantidadPrice)
    //     }else{
    //         let cantidadPrice = Number(Number(cantidadToPrices) * Number(promedioUnidad)) 
    //         console.log('proyecto a sumar-------',materia.nombre, cantidadPrice) 
    //         sumar(-cantidadPrice)
    //     } 
    // }


    console.log('productos total', productosTotal)
    let findMt2  = materia.unidad == 'mt2' ? productosTotal.filter(pt => pt.id == materia.id) : null;
    console.log('filtradoo', findMt2) 
    let cantidadToPrices = Number(Math.ceil(Number( Number(materia?.totalCantidad) / Number(materia.medida) )).toFixed(0))


    const medidaNombre = findMt2 && findMt2.length ? findMt2[0]?.productoCotizacion[0]?.medida : null;
    let ladoA =  findMt2 && findMt2.length ? findMt2[0]?.productoCotizacion[0]?.medida.split('X')[0] : null
    let ladoB = findMt2 && findMt2.length ? findMt2[0]?.productoCotizacion[0]?.medida.split('X')[1] : null
    let area = findMt2 && findMt2.length ? Number(ladoA) * Number(ladoB) : null;
    let cantidadToPricesMt2 = findMt2 && findMt2.length ? Number(Math.ceil(Number( Number(materia?.totalCantidad) / Number(area) )).toFixed(0)) : 0
    const cantidadPriceMt2 = Number(area) * Number(promedioUnidad);

    console.log('Precio mt2', cantidadPriceMt2, materia, findMt2)

    console.log('materiaa', materia)
    const yaEnviado = useRef(false);

    const [enviado, setEnviado] = useState(false)
    
    function enviarPrecioItem() {
        setEnviado(true)

        const entregado = Number(materia.entregado);
        const total = Number(materia.totalCantidad);
        console.log('total', total)
        // Si está completo, no suma nada
        if (entregado >= total) return;

        if(entregado > 0 &&  entregado < total){
            
            console.log('hola')
        }else{
            if(findMt2 && findMt2.length > 0){
                
                dispatch(actions.GetConsolidatoProyectProducto(Number(cantidadPriceMt2)));
                return yaEnviado.current = true; // marca como enviado

            }
            const cantidadPrice = Number(cantidadToPrices) * Number(promedioUnidad);
            console.log('cantidad price productoooo', cantidadPrice)
            // Envía el valor para SUMAR en el reducer
            dispatch(actions.GetConsolidatoProyectProducto(Number(cantidadPrice)));
            return yaEnviado.current = true; // marca como enviado
        }


    }

    useEffect(() => { 
        if (sentItemIdss.has(`${materia.id}-p`)) return;


         if(enviado){
            return null
        } else{
            sentItemIdss.add(`${materia.id}-p`);

            enviarPrecioItem()
        }
    }, [materia, productosTotal])
    return (
        <tr onContextMenu={(e) => {              // 👈 click derecho
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
                        <h3>{materia.nombre} <br />
                        {medidaNombre}</h3>
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
                    <span>$ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(materia.unidad == 'mt2' ? cantidadPriceMt2 / cantidadAValorizar : promedioUnidad).toFixed(0))}</span>
                </div>
            </td>
            <td>
                <div className="">
                    <span>$ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(materia.unidad == 'mt2' ? cantidadPriceMt2  : promedioUnidad * cantidadAValorizar).toFixed(0)) }</span>
                </div>
            </td>
        </tr>
    )
}