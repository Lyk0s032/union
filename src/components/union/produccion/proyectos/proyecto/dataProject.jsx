import React, { useEffect, useState } from 'react';
import { FaCircleCheck, FaCircleExclamation } from 'react-icons/fa6';
import * as actions from '../../../../store/action/action';

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/es"; // para español
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import ItemProjectNecesidad from './itemNecesidad';
import MoveModalRigth from './moveModalRight';

dayjs.extend(localizedFormat);
dayjs.locale("es");

// función calcular
function calcTotal(project) {
  if (!project || !Array.isArray(project.necesidadProyectos)) return 0;

  return project.necesidadProyectos.reduce((total, req) => {
    // convertir cantidad a número (sin toFixed)
    const cantidad = Number(req.cantidadComprometida || 0);

    // precio del kit (campo valor)
    let precio = 0;
    if (req.kit?.priceKits?.length > 0) {
      precio = Number(req.kit.priceKits[0].valor || 0);
    }

    // precio del producto (campo valor)
    if (req.producto?.productPrices?.length > 0) {
      precio = Number(req.producto.productPrices[0].valor || 0);
    }

    // **IMPORTANTE**: retornar el acumulador
    return total + (cantidad * precio);
  }, 0);
}


export default function DataProject({ project }){
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    console.log(project)

    const compromiso = project?.necesidadProyectos?.reduce(
        (acc, item) => acc + Number(item.cantidadComprometida),
        0
    );  
    
    const entregada = project?.necesidadProyectos?.reduce(
        (acc, item) => acc + Number(item.cantidadEntregada),
        0
    );  

    const avance = entregada > 0 ? Number(Number(entregada / compromiso) * 100).toFixed(0) : 0

    const [valor, setValor] = useState(0);
    const [itemsSeleccionados, setItemsSeleccionados] = useState([]);

    // recalcula cuando cambie `project`
    useEffect(() => {
        setValor(calcTotal(project));
    }, [project]);

    // Función para manejar la selección de items con Ctrl
    const handleToggleSeleccion = (itemId) => {
        setItemsSeleccionados(prev => {
            if (prev.includes(itemId)) {
                return prev.filter(id => id !== itemId);
            } else {
                return [...prev, itemId];
            }
        });
    };

    // Función para reemplazar item
    const handleReemplazar = async () => {
        if (itemsSeleccionados.length !== 1) return;
        
        const itemId = itemsSeleccionados[0];
        // TODO: Implementar lógica de reemplazo
        console.log('Reemplazar item:', itemId);
        dispatch(actions.HandleAlerta('Funcionalidad de reemplazo en desarrollo', 'info'));
    };

    return (
        <div className="DataCotizacionCompras">
            <div className="TopGeneralInformation">
                {/* <div className="lineProgress">
                    <div className="itemHere">
                        <div className="circle">
                            <FaCircleCheck className="icon Active" />
                        </div>
                        <h3 className='Active'>Cotización creada</h3>
                        <span>Fecha aquí </span>
                    </div>

                    <div className="itemHere">
                        <div className="circle">
                            <FaCircleCheck className="icon Active" />
                        </div>
                        <h3 className='Active'>Cotización aprobada</h3>
                        <span>Fecha aquí </span>
                    </div>


                    

                    <div className="itemHere">
                        <div className="circle">
                            <FaCircleExclamation className="icon" />
                        </div>
                        <h3>Entregado</h3>
                        <span>Pendiente</span>
                    </div>
                </div> */}
                <div className="dataCotizacionReal">
                    <div className="containerDataRealCotizacion">
                        <div className="topData">
                            <div className="divideCotizacion">
                                <div className="lade">
                                    <div className="itemBig">
                                        <span>Cotización número: {Number(project.cotizacionId + Number(21719))}</span><br /><br />
                                        <h3>{project.nombre}</h3>
                                        <br />
                                        <span>Coca cola</span>
                                        <h4>{project?.cotizacion?.client?.email}</h4>
                                        <span>NIT: {project?.cotizacion?.client?.nit}</span> 
                                    </div>
                                    
                                </div>
                                <div className="lade Right">
                                    <div className="price">
                                        <span>Estado</span>
                                        <h1>{avance} %</h1>
                                        <span>Avance del proyecto hasta el momento</span>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="topData">
                            <div className="divideCotizacion">
                                <div className="lade">
                                    <div className="price">
                                        <span>Precio promedio del proyecto</span>
                                        <h1>$ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(valor ? valor : 0)}</h1>
                                    </div>
                                    
                                </div>
                                <div className="lade Right">
                                    
                                    
                                </div>
                            </div>
                        </div>
                        <div className="tableDataItems">
                            {itemsSeleccionados.length === 1 && (
                                <div style={{
                                    marginBottom: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <button
                                        onClick={handleReemplazar}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#2f8bfd',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Reemplazar
                                    </button>
                                </div>
                            )}
                            <div className="listaMP">
                                <table>
                                    <thead> 
                                        <tr>
                                            <th>Item</th>
                                            <th>Necesidad</th>
                                            <th>Progreso</th>
                                            <th>Corte</th>
                                            <th>Tuberia</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            project?.necesidadProyectos?.length ?
                                                project.necesidadProyectos.map((r, i) => {
                                                    return (
                                                        <ItemProjectNecesidad 
                                                            item={r} 
                                                            key={r.id || i+1}
                                                            isSelected={itemsSeleccionados.includes(r.id)}
                                                            onToggleSeleccion={handleToggleSeleccion}
                                                        />

                                                    )
                                                })
                                            : null
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                params.get('add') ?
                    <MoveModalRigth />
                : null
            }
        </div>
    )
}