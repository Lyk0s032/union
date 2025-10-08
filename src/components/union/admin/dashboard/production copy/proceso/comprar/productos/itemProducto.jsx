import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../../../../store/action/action';
import axios from 'axios';

export default function ItemListMP({ materia }){
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

            if (existe) {
                // Si ya existe, lo quitamos
                const nuevo = materiaIds.filter(m => m.productoId !== materia.id);
                console.log('Quitando elemento:', nuevo);
                dispatch(actions.limpiarIds(nuevo));
            } else {
                // Si no existe, lo agregamos (sin mutar el array original)
            
                dispatch(actions.getMateriasIds({productoId: materia.id}));
            }

        } else {
            params.set('MP', materia.id);
            setParams(params);
            open();
        }
    };

    const handleDoubleClick = () => {
        // Por cada requisicionId, creamos o completamos el itemCotizacion
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
    return (
        <tr 
        
        onClick={handleClick} onContextMenu={(e) => {              // 👈 click derecho
            e.preventDefault();              // evita que salga el menú del navegador
            handleDoubleClick();             // llamas tu función
        }}
       className={ materiaIds.find(m => m.productoId == materia.id)  ? 'Active' : null}>
            <td className="longer"> 
                <div className="nameLonger">
                    <div className="letter">
                        <h3>{materia.id} </h3>
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