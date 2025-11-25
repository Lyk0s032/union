import axios from 'axios';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as actions from './../../../store/action/action';
import { useDispatch } from 'react-redux';

export default function DataProducto({ item }){
    const [params, setParams] = useSearchParams();
    const [add, setAdd] = useState(false);
    const [valor, setValor] = useState(0)
    const dispatch = useDispatch();

    const tipoItem = !params.get('bodega') || params.get('bodega') == 1 || params.get('bodega') == 4 ? 'Materia Prima' : 'Producto'
    const [form, setForm] = useState({
        cantidad: 1,
        bodegaId: tipoItem == 'Materia Prima' ? 1 : 2,  
        materiaId: item.itemType == 'materia' ? item.item.id : null,
        productoId: item.itemType != 'materia' ? item.item.id : null,
        tipo: 'ENTRADA',
        ubicacionOrigenId: item.itemType == 'materia' ? 1 : 2,
        ubicacionDestinoId: item.itemType == 'materia' ? 1 : 2,
        tipoProducto: item.itemType == 'materia' ? 'Materia Prima' : 'Producto',
        refDoc: 'ENT-2025-11-17 100',
        cotizacionId: null,
        numPiezas: 1,
        comprasCotizacionId: null
        
    })
    const [loading, setLoading] = useState(false);
 
    const getDataBodegasAxios = async () => {

        const tipo = !params.get('bodega') || params.get('bodega') == 1 || params.get('bodega') == 3 ? 'MP' : 'PT'
        let rutaMP = tipo == 'MP' ? params.get('item') : null
        let rutaPT = tipo == 'PT' ? params.get('item') : null
         
        dispatch(actions.axiosToGetItemInventarioPlus(false, rutaMP, params.get('bodega'), rutaPT))

        // if(!params.get('bodega') || params.get('bodega') == 1 || params.get('bodega') == 4){
        //     if(params.get('show') == 'Bodega' || !params.get('show')){
        //         dispatch(actions.axiosToGetItemMateriaPrimaBodega(false, params.get('item'), posible))
        //     }else if(params.get('show' == 'Proyecto')){
        //         dispatch(actions.axiosToGetItemMateriaPrimaBodegaProyecto(false, params.get('item'), params.get('who')))
        //     }
        // }else{
        //     if(params.get('show') == 'Bodega' || !params.get('show')){
        //         dispatch(actions.axiosToGetItemProductoTerminadoBodega(false, params.get('item'), params.get('who')))
        //     }
        // }
    }
    const handleAddMateria = async () => {
        setLoading(true)
        await definitivaSend(form)
        setLoading(false)
    }
 
    const definitivaSend = async (array) => {
        const arrayMapa = [array];
        arrayMapa.map(async data => {
            let body = data
            console.log('body',body)
            
            // const sendRegister = await axios.post('/api/inventario/post/bodega/addHowMany', body)
            const sendRegisterThat = await axios.post('/api/inventario/post/bodega/moviemitos/add', body)
            
            .then(async (res) => {
                await getDataBodegasAxios()
                return res.data
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => setLoading(false))

            return sendRegisterThat
        })
    }
    return (
        <div className="dataProducto">
            <div className="containerProductoData">
                <div className="topInfoProductoHere">
                    <div className="topAvance">
                        <div className="letra">
                            <h3>{item.item.id}</h3>
                        </div>
                        <div className="dataResult">
                            <h3>{item.itemType == 'materia' ? item.item.description : item.item.item}</h3>
                            <span>{item.itemType == 'materia' ? 'Materia prima' : 'Producto terminado'}</span>
                            {
                                item.item.medida ?
                                    <div>
                                        <strong style={{fontSize:12}}>Medida: </strong> <span>{item.item.medida} {item.item.unidad}</span>
                                    </div>
                                : null
                            }
                        </div>
                    </div>
                    {
                        item.item.medida ? 
                        <div className="dataDescription">
                            <strong>Descripción</strong><br /> 
                            <span>{item.item.description ? item.item.description : null} </span>
                            <br /><br />
                            {
                                add ? 
                                <div className="inputDiv">
                                    <label htmlFor="">Ingresa Cantidad {form.tipoMovimiento}</label><br />
                                    <input type="text" onBlur={() => setAdd(false)} onChange={(e) => {
                                        let medidaData = item.item.unidad == 'mt2' ? Number(Number(item.item.medida.split('X')[0]) * Number(item.item.medida.split('X')[1])) : item.item.medida
                                        setForm({
                                            ...form,
                                            cantidad: Number(e.target.value) >= 0 ? Math.abs(e.target.value) : Number(Math.abs(e.target.value) * Number(medidaData)),
                                            numPiezas: Number(e.target.value) >= 0 ? Math.abs(e.target.value) : Number(Math.abs(e.target.value) * Number(medidaData)) ,
                                            tipo: Number(e.target.value) >= 0 ? 'ENTRADA' : 'SALIDA'
                                        })
                                        setValor(e.target.value)
                                    }} onKeyDown={(e) => {
                                        if(e.code == 'Enter'){ 
                                             handleAddMateria()
                                        }
                                    }}/>

                                    {loading ? 'Haciendo movimiento' : null}
                                    
                                </div>
                                :
                                <button onClick={() => setAdd(true)}>
                                    <span>Hacer movimientos</span>
                                </button>
                            }
                            <br />
                        </div>
                        :
                        <div className="dataDescription">
                            <strong>Descripción</strong><br />
                            <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque explicabo, aliquam deserunt, itaque culpa illum dignissimos tenetur officiis voluptatum harum delectus repudiandae dicta aperiam hic deleniti dolorum in consequuntur? Cupiditate.</span>
                            <br /><br />
                            <button>
                                <span>Hacer movimientos</span>
                            </button><br />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}