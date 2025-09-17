import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../../store/action/action';
import axios from 'axios';

export default function ItemListMP({ materia }){
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);
    const { ids, materiaIds } = req;
    const [selected, setSelected] = useState(false)

    const open = () => {
        dispatch(actions.gettingItemRequisicion(true))
        let body = {
            mpId: materia.materiaId,
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
        if(e.ctrlKey){
            setSelected(!selected)
            dispatch(actions.getMateriasIds(materia.materiaId))
        }else{
            params.set('MP', 'show');
            setParams(params);
            open()
        }
    } 
    return (
        <tr onClick={handleClick} className={selected ? 'Active' : null}>
            <td className="longer">
                <div className="nameLonger">
                    <div className="letter">
                        <h3>{materia.materiaId}</h3>
                    </div> 
                    <div className="name">
                        <h3>{materia.nombre}</h3>
                        <span>{materia.medida} {materia.unidad}</span><br />

                        <span>Parcialmente comprado</span>
                    </div> 
                </div>
            </td>
            <td className='hidden'>
                <div className="">
                    <span>36000 KG</span>
                </div>
            </td>
            <td>
                <div className="">
                    <span><strong>(15)</strong> - {materia.entregado} / {materia.totalCantidad}</span>
                </div>
            </td> 
            <td>
                <div className="">
                    <span>$ 350.000</span>
                </div>
            </td>
            <td>
                <div className="">
                    <span>$ 350.000</span>
                </div>
            </td>
        </tr>
    )
}