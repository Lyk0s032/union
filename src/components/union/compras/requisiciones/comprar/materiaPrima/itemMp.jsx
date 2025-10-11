import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../../store/action/action';
import axios from 'axios';

export default function ItemListMP({ materia }){
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);
    const { ids, materiaIds, itemsCotizacions } = req;
    const [selected, setSelected] = useState(false)

    let cantidades = itemsCotizacions?.length ?  itemsCotizacions.filter(it => it.materiumId === materia.id && ids.includes(it.requisicionId)) : null;
    let numero = cantidades?.length ? cantidades .reduce((acc, curr) => acc + Number(curr.cantidad), 0) : 0

    const precioPromedio = materia.precios.reduce((acc, it) => {
        return acc + Number(it.valor);
    }, 0); 

    console.log(itemsCotizacions)
    const promedioUnidad = precioPromedio / materia.precios.length;
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

    const handleClick = (e) => {
        if (e.ctrlKey) {
            setSelected(!selected);

            const existe = materiaIds.find(m => m.materiaId == materia.id);

            if (existe) {
                // Si ya existe, lo quitamos
                const nuevo = materiaIds.filter(m => m.materiaId !== materia.id);
                console.log('Quitando elemento:', nuevo);
                dispatch(actions.limpiarIds(nuevo));
            } else {
                // Si no existe, lo agregamos (sin mutar el array original)
            
                dispatch(actions.getMateriasIds({materiaId: materia.id}));
                console.log(materiaIds)
                console.log('Anexado')

            }

        } else {
            params.set('MP', materia.id);
            setParams(params);
            open();
        }
    }; 


    const m = materia;
    let productoLados = 1;
    
    if (materia.unidad == 'mt2') {
        const [ladoA, ladoB] = m.medida.split('X').map(Number);
        if (!isNaN(ladoA) && !isNaN(ladoB)) {
            productoLados = ladoA * ladoB;

        } 
    }else{
        productoLados = materia.medida
    }  
    return (
        <tr className={ materiaIds.find(m => m.materiaId == materia.id)  ? 'Active' : null}
        
        onClick={handleClick} onContextMenu={(e) => {              // 👈 click derecho
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
                                <span> {console.log(materia)} {console.log(Number(materia.totalCantidad / productoLados))}
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
                    <span>$ {numero ? new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(promedioUnidad* numero).toFixed(0)) : new Intl.NumberFormat('es-CO', {currency:'COP'}).format(promedioUnidad)}</span>
                </div>
            </td>
        </tr>
    )
}