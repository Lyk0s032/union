import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../../../../store/action/action';
import axios from 'axios';

export default function GetAllItemsProvider({ seleccionador }){
    const req = useSelector(store => store.requisicion);
    const [params, setParams] = useSearchParams();

    const { ids, materia, ordenCompra } = req; 
    const dispatch = useDispatch();

    const proveedorId = ordenCompra ? ordenCompra.proveedorId : 1 // convertir a número

    const materiasFiltradas = materia ? materia.filter((m) =>
        m.precios?.some((p) => Number(p.proveedorId) === proveedorId)
    ) : null
    

    const open = (id) => {
        dispatch(actions.gettingItemRequisicion(true))
        let body = {
            mpId: id,
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

    const openProduct = (id) => {
        dispatch(actions.gettingItemRequisicion(true))
        let body = {
            mpId: id,
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
    // Necesitamos filtrar la materia.
    // Una vez filtrada, buscamos en el array de precios
    // Si existe un precio, que contenga un proveedor con el mismo ID que params.get('orden')
    // Los mostramos. 
    return (
        <div className="allItemsProviders">
            <div className="titleData">
                <div className="zoneTitle">
                    <h1>Materia prima necesitada que el proveedor puede suministrar</h1>
                    <span>Esta lista de materia prima, esta basada en la necesidad de la requisición</span>
                </div>
            </div>
            <div className="listOptionsMateria">
                {materiasFiltradas && materiasFiltradas.length > 0 ? (
                    materiasFiltradas.map((m) => (
                    <div key={m.id} className='item' onClick={() => {
                        if(m.tipo == 'producto'){
                            openProduct(m.id)
                        } else{
                            open(m.id)
                        } 
                    }}> 
                        <span>Código: {m.id}</span>
                        <h3>{m.nombre}</h3> 
                        <span>Cantidad total: {Number(m.totalCantidad - m.entregado).toFixed(2)} {m.unidad}</span>
                        <span>{m.state}</span>
                        <br />
 
                    </div>
                    ))
                ) : (
                    <p>No hay materias para este proveedor.</p>
                )}
            </div>
        </div>
    )
}