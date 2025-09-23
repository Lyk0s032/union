import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from 'xlsx'; // <-- 1. IMPORTA LA LIBRERÍA
import axios from 'axios';

export default function ShowRequisicion(){
    const [params, setParams] = useSearchParams();
    const [show, setShow] = useState(null);

    const dispatch = useDispatch();

    const mt = useSelector(store => store.requisicion);
    const { requisicion, loadingRequisicion } = mt;
    
     // --- 2. CREA LA FUNCIÓN PARA EXPORTAR ---
    const handleExportToExcel = () => {
        // --- PREPARAR DATOS PARA LA PRIMERA HOJA: KITS ---
        const kitsData = requisicion.resumenKits.map(r => ({
            'Código Kit': r.id,
            'Nombre': r.nombre,
            
            'Cantidad': r.cantidad,
        }));
        const kitsWorksheet = XLSX.utils.json_to_sheet(kitsData);

        // --- PREPARAR DATOS PARA LA SEGUNDA HOJA: MATERIA PRIMA ---
        const materiaPrimaData = requisicion.cantidades.map(r => {
            let cantidadAPedir = '';
            if (r.unidad === 'mt2') {
                const area = Number(r.medidaOriginal.split('X')[0]) * Number(r.medidaOriginal.split('X')[1]);
                cantidadAPedir = r.cantidad / area < 0.5 ? 1 : Math.round(r.cantidad / area);
            } else if (r.unidad === 'mt' || r.unidad === 'kg') {
                cantidadAPedir = r.cantidad / Number(r.medidaOriginal) < 0.5 ? 1 : (r.cantidad / Number(r.medidaOriginal));
            } else {
                cantidadAPedir = r.cantidad / r.medidaOriginal;
            }

            return {
                'Código Item': r.id,
                'Nombre': r.nombre,
                'cguno' : r.cguno,
                'Medida de Compra': `${r.medidaOriginal} ${r.unidad}`,
                'Medida de Consumo (Total)': r.cantidad % 1 === 0 ? r.cantidad : r.cantidad.toFixed(3),
                'Cantidad a Pedir': cantidadAPedir,
            };
        });
        const materiaPrimaWorksheet = XLSX.utils.json_to_sheet(materiaPrimaData);

        // --- CREAR EL ARCHIVO Y DESCARGAR ---
        // Crear un nuevo libro de trabajo
        const workbook = XLSX.utils.book_new();
        // Añadir las hojas con sus nombres
        XLSX.utils.book_append_sheet(workbook, kitsWorksheet, "Resumen de Kits");
        XLSX.utils.book_append_sheet(workbook, materiaPrimaWorksheet, "Materia Prima Requerida");
        // Descargar el archivo
        XLSX.writeFile(workbook, `Requisicion_${requisicion.requisicion.id}.xlsx`);
    };

    const sendCS = async (estado) => {
        if(!estado) return dispatch(actions.HandleAlerta('No hemos logrado hacer esto.', 'mistake'))
        // Caso contrario, avanzamos
        let body = {
            reqId: requisicion.requisicion.id,
            state: estado
        }
        const send = await axios.put('/api/requisicion/put/estado', body)
        .then(() => {
            dispatch(actions.HandleAlerta('¡Perfecto!', 'positive'))
            dispatch(actions.axiosToGetRequisicion(false, params.get('requisicion')))
            dispatch(actions.axiosToGetRequisicions(false))

        })
        .catch(() => {
            dispatch(actions.HandleAlerta('No hemos logrado hacer esto.', 'mistake'))
        })

        return send;
    }
    useEffect(() => {
        dispatch(actions.axiosToGetRequisicion(true, params.get('requisicion')))
    }, [params.get('requisicion')])
    return ( 
        !requisicion || loadingRequisicion ?
        <div className="showProveedor">
            <div className="containerShow">
                <h1>Loading</h1>
            </div>
        </div>
        :
        <div className="showProveedor">
            <div className="containerShow">
                <div className="topProvider"> 
                    <div className="divideTop">
                        <button onClick={() => {
                            params.delete('requisicion');
                            setParams(params);
                        }}>
                            <span>Volver</span>
                        </button>
                        <div className="title">
                            <h3>Nro. {requisicion.requisicion.id} - {requisicion.requisicion.nombre}</h3>
                        </div>
                    </div>
                </div>
                <div className="bodyProvider">
                    
                    <div className="containerBodyProvider">
                        <div className="topRequisicion">
                            <button onClick={handleExportToExcel}>
                                <span>Descargar excel</span>
                            </button>


                            <div className="optionsRequisicion">
                                    <span>Estado</span>
                                    <h3>
                                        {requisicion.requisicion.estado.toUpperCase()}
                                    </h3>
                                    {
                                        requisicion.requisicion.estado == 'pendiente' ?
                                            <nav>
                                                <ul>
                                                    <li onClick={() => sendCS('comprando')}>Comprar</li>
                                                </ul>
                                            </nav>
                                        :
                                        requisicion.requisicion.estado == 'comprando' ?
                                            <nav>
                                                <ul>
                                                    <li onClick={() => sendCS('pendiente')}>Regresar a pendiente</li>
                                                    <li onClick={() => sendCS('cumplido')}>Finalizar</li>

                                                </ul>
                                            </nav>
                                        :null
                                    }
                                    
                            </div>
                        </div>

                        <div className="requisicionDocument">
                            <div className="topHeader"> {console.log(requisicion)}
                                <div className="topTitle">
                                    <h1>{Number(21719) + requisicion.requisicion.cotizacion.id} - {requisicion.requisicion.cotizacion.name}</h1>
                                    <span style={{fontSize:12, color: 'white'}}>{requisicion.requisicion.cotizacion.client.nombre}</span>
                                </div>
                                <div className="fechaDiv">
                                    <div className="left">
                                        
                                        <span>Fecha</span><br />
                                        <strong>{requisicion.requisicion.fecha.split('T')[0]}</strong>
                                    </div>
                                    <div className="right">
                                        <span>Fecha necesaria</span><br />
                                        <strong>{requisicion.requisicion.fechaNecesaria.split('T')[0]}</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="bodyDocument">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th></th>
                                            <th></th>
                                            <th>Cantidad a pedir</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            requisicion.resumenKits && requisicion.resumenKits.length ?
                                                requisicion.resumenKits.map((r,i) => {
                                                    return (
                                                        <tr key={i+1}>
                                                            <td>
                                                                <div className='about'>
                                                                    <span>Código Kit: {r.id}</span><br />
                                                                    
                                                                    <strong>{r.nombre}</strong>
                                                                </div>
                                                            </td>
                                                            <td>
                                                            </td>
                                                            <td>
                                                                
                                                            </td>
                                                            <td>
                                                                <div className="price">
                                                                    <span>{r.cantidad}</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            :
                                            null
                                        }
                                        
                                    </tbody>
                                </table><br /><br />
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Medida Original</th>
                                            <th>M. consumo</th>
                                            <th>Cantidad a pedir</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            requisicion.cantidades && requisicion.cantidades.length ?
                                                requisicion.cantidades.map((r,i) => {
                                                    return (
                                                        <tr key={i+1}>
                                                            <td>
                                                                <div className='about'>
                                                                    <span>Item Codigo: {r.id}</span><br />
                                                                    <span>CGUNO: {r.cguno}</span><br />
                                                                    <strong>{r.nombre}</strong>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="price">
                                                                    <span>{r.medidaOriginal} {r.unidad}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="price">
                                                                    <span>
                                                                        {
                                                                            Number(r.cantidad) % 1 === 0 ?
                                                                            r.cantidad
                                                                            : r.cantidad.toFixed(3)
                                                                        }
                                                                    </span>
                                                                </div> 
                                                            </td>
                                                            <td>
                                                                <div className="price">
                                                                    {
                                                                        r.unidad == 'mt2' ?
                                                                            
                                                                            <span>
                                                                                {r.cantidad / Number(Number(r.medidaOriginal.split('X')[0]) * Number(r.medidaOriginal.split('X')[1])) < 0.5 ? 1 : Math.round(r.cantidad / Number(Number(r.medidaOriginal.split('X')[0]) * Number(r.medidaOriginal.split('X')[1])) )}
                                                                            </span>
                                                                        : r.unidad == 'mt' ?
                                                                            <span>{r.cantidad / Number(r.medidaOriginal) < 0.5 ? 1 : r.cantidad / Number(r.medidaOriginal)} </span> 
                                                                        
                                                                        : r.unidad == 'kg' ?
                                                                            <span>{r.cantidad / Number(r.medidaOriginal) < 0.5 ? 1 : r.cantidad / Number(r.medidaOriginal)} </span> 

                                                                        : <span>{r.cantidad / r.medidaOriginal} </span>

                                                                    
                                                                    }

                                                                    
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            :
                                            null
                                        }
                                        
                                    </tbody>
                                </table>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
