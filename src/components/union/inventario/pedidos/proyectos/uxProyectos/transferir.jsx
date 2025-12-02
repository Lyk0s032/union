import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../../store/action/action';
import axios from 'axios';

export default function Transferir({ item, itemToProject }){
    const [params, setParams] = useSearchParams();
    const tipoItem = !params.get('bodega') || params.get('bodega') == 1 || params.get('bodega') == 4 ? 'Materia Prima' : 'Producto'

    const [form, setForm] = useState({
        materiaId: item.itemType == 'materia' ? item.item.id : null,
        productoId: item.itemType != 'materia' ? item.item.id : null,
        cantidad: 0,
        tipoProducto: tipoItem, 
        tipo: 'TRANSFERENCIA',
        ubicacionOrigenId: tipoItem == 'Materia Prima' ? 1 : 2,
        ubicacionDestinoId: tipoItem == 'Materia Prima' ? 4 : 5,
        refDoc: 'TRANS1000', 
        cotizacionId: Number(params.get('proyecto')), 
        itemFisicoId: null,
        numPiezas: null, // Cantidad de items
        modoSeleccion: "PIEZAS_COMPLETAS",
        de: tipoItem == 'Materia Prima' ? 1 : 2,
        para: tipoItem == 'Materia Prima' ? 4 : 5,
        proyecto: Number(params.get('proyecto')),
        nota: '' 
    })
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null)
    const dispatch = useDispatch();

    const refresh = async () => {
        const tipo = !params.get('bodega') || params.get('bodega') == 1 || params.get('bodega') == 4 ? 'MP' : 'PT'
        let rutaMP = tipo == 'MP' ? params.get('move') : null
        let rutaPT = tipo == 'PT' ? params.get('move') : null
        dispatch(actions.axiosToGetItemInventarioPlus(false, rutaMP, params.get('bodega'), rutaPT))
        dispatch(actions.axiosToGetProject(false, params.get('proyecto')));
        
    }
    
    const definitivaSend = async () => {
        
        setLoading(true);
        let body = form
        console.log('transferencia',body)
        const sendRegister = await axios.post('/api/inventario/post/bodega/moviemitos/add', body)
        .then(res => {
            console.log(res);
            dispatch(actions.HandleAlerta('Transacción exitosa', 'positive'))
            setStatus(true)
            console.log('cumplio')
            return res.data
        })
        .then((res) => {
            refresh();
            return res;
        })
        .catch(err => {
            console.log('fallo')
            console.log(err);
            setStatus(false)
        })
        .finally(() => setLoading(false))

        return sendRegister
    }
    return (
        <div className="containerGive">
            <div className="inputDiv">
                {
                    loading ? 
                    <label htmlFor="">Transfiriendo</label>
                    :
                    <label htmlFor="">Cantidad a transferir</label>
                }
                <br />
                <input type="Number" placeholder='Ingresar cantidad aquí'
                onChange={(e) => {
                    setForm({
                        ...form,
                        cantidad: e.target.value
                    })
                }} 
                onKeyDown={(e) => {
                    if(e.code == 'Enter'){
                        if(!loading){
                            definitivaSend()
                        }
                    }
                }} />
            </div>
        </div>
    )
}