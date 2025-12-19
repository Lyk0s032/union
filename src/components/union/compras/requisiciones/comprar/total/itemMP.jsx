import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../../store/action/action';
import axios from 'axios';

export const sentItemIds = new Set();

export default function ItemListMP({ materia, sumar }){
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);
    const { ids, materiaIds, itemsCotizacions, totalFaltante } = req;
    const [selected, setSelected] = useState(false)

    let cantidades = itemsCotizacions?.length ?  itemsCotizacions.filter(it => it.materiumId === materia.id && ids.includes(it.requisicionId)) : null;
    let numero = cantidades?.length ? cantidades .reduce((acc, curr) => acc + Number(curr.cantidad), 0) : 0

    const precioPromedio = materia.precios.reduce((acc, it) => {
        return acc + Number(it.valor);
    }, 0); 

    const m = materia;
    let productoLados = 1; 
    if (materia.unidad == 'mt2') {
        const [ladoA, ladoB] = m.medida.split('X').map(Number);
        if (!isNaN(ladoA) && !isNaN(ladoB)) {
            productoLados = ladoA * ladoB;

        }
    }else if(materia.unidad == 'kg'){
        productoLados = materia.medida / materia.medida
    }else{
        productoLados = materia.medida
    }  
    let cantidadToPrices = Number(Math.ceil(Number( Number(materia?.totalCantidad) / Number(productoLados) )).toFixed(0))


    const promedioUnidad = materia.unidad == 'kg' ? Number(Number(precioPromedio / materia.precios.length) / Number(materia.medida)) : Number(precioPromedio / materia.precios.length);
    const open = () => {
        dispatch(actions.gettingItemRequisicion(true))
        let body = {
            mpId: materia.id,
            ids: ids
        }
        const send = axios.post('/api/requisicion/get/materiales/materia/', body)
        .then((res) => {
            dispatch(actions.getItemRequisicion(res.data));
        }).catch(err => {
            console.log(err);
            dispatch(actions.getItemRequisicion(404));
        })

        return send
    }

    const sumandito = () => {
            if(Number(materia.entregado) >= Number(materia.totalCantidad)){
                console.log('completo')
            } else if(Number(materia.entregado) > 0 && Number(materia.entregado) < Number(materia.totalCantidad)){
                    let cantidadPrice = Number(Number(cantidadToPrices) * Number(promedioUnidad)) 
                    console.log('proyecto a sumar-------',materia.nombre, cantidadPrice) 
                    console.log(cantidadPrice)
                    sumar(cantidadPrice)
                    let currently = cantidadPrice
                    dispatch(actions.GetConsolidatoProyect(cantidadPrice))
                
            }else{
    
                    let cantidadPrice = Number(Number(cantidadToPrices) * Number(promedioUnidad)) 
                    console.log('proyecto a sumar-------',materia.nombre, cantidadPrice) 
                    sumar(cantidadPrice)
                    let toTotal = Number(totalFaltante) + Number(cantidadPrice)

                    console.log('price to cantidad', cantidadPrice )
                    console.log('item to total', toTotal)
                    console.log('item faltante', totalFaltante)
                    dispatch(actions.GetConsolidatoProyect(Number(cantidadPrice)))
            }
                
        }

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
            const cantidadPrice = Number(cantidadToPrices) * Number(promedioUnidad);
            console.log('cantidad price', cantidadPrice)
            // Envía el valor para SUMAR en el reducer
            dispatch(actions.GetConsolidatoProyect(Number(cantidadPrice)));
            return yaEnviado.current = true; // marca como enviado
        }


    }

    useEffect(() => { 
        if (sentItemIds.has(`${materia.id}-m`)) return;


        if(enviado){
            return null
        } else{
            sentItemIds.add(`${materia.id}-m`);

            enviarPrecioItem()
        }
    }, [materia])

        console.log('valor falnte', totalFaltante) 
    return (
        <tr className={ materiaIds.find(m => m.materiaId == materia.id)  ? 'Active' : null}
         onContextMenu={(e) => {              // 👈 click derecho
      e.preventDefault();              // evita que salga el menú del navegador
  }}
       > 
            <td className="longer"> 
                <div className="nameLonger">
                    <div className="letter">
                        <h3>{materia.id} </h3>
                    </div> 
                    <div className="name">
                        <h3>{materia.nombre} </h3>
                        <span> {Number(productoLados)} {materia.unidad} </span><br />

                        <span>
                            {
                                Number(materia.entregado) >= Number(materia.totalCantidad / productoLados) ? 
                                <span style={{color: 'green'}}>Comprado</span>
                                :
                                Number(materia.entregado) > 0 && Number(materia.entregado) < Number(materia.totalCantidad) ?
                                <span> 
                                    Parcialmente comprado
                                </span>
                                
                                : 
                                <span>Pendiente</span>
                            }
                        </span><br /><br />
                    </div> 
                </div>
            </td>

            <td className='hidden'>
                <div className="">
                    <span>{Number(materia.totalCantidad).toFixed(2)} {materia.unidad}</span>
                </div>
            </td>
            
            <td>
                <div className="" > 
                    <span><strong>({numero ? numero : 0})</strong> - {materia.entregado} /  {Number(Math.ceil(Number( Number(materia.totalCantidad) / Number(productoLados) )).toFixed(0))}</span>
                </div>
            </td> 
            <td>
                <div className="">
                    <span>$ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(promedioUnidad).toFixed(0))}</span>
                </div>
            </td>
            <td>
                <div className="">
                    <span>
                        $ 
                        {numero ? 
                            new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(promedioUnidad * numero).toFixed(0)) 
                        : 
                            new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(promedioUnidad * cantidadToPrices).toFixed(0))}</span>
                </div>
            </td>
        </tr>
    )
}