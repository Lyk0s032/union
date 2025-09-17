import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/action/action';
import dayjs from 'dayjs';

export default function Movimientos(){
        const almacen = useSelector(store => store.almacen);
    
        const { movimientosBodega, loadingMovimientosBodega } = almacen;
    
        const dispatch = useDispatch();

        const [options, setOptions] = useState(null);
    return (
        <div className="listResultsData">
            <div className="containerKits">
                <div className="dataFilters">
                    {/* <div className="searchDataInput">
                        <input type="text" placeholder='Buscar materia prima'/>
                    </div> */}
                    <div className="containerDataFilters">
                        <div className="divide">
                            <div className="tableData">
                                <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th>MOVIMIENTO</th>

                                        </tr>
                                    </thead> 
                                    <tbody>
                                        {
                                            !movimientosBodega || loadingMovimientosBodega ? 
                                                <span>Cargando...</span>
                                            : 
                                            movimientosBodega?.length ? 
                                                movimientosBodega.map((pt, i) => {
                                                    return (
                                                            <tr key={i+1}>
                                                                <td className="coding">
                                                                    <div className="code">
                                                                        <h3>{pt.id}</h3>
                                                                    </div>
                                                                </td>
                                                                <td className="longer Almacen" > 
                                                                    <div className="titleNameKitAndData">
                                                                        <div className="extensionColor">
                                                                            <div className="boxColor"></div>
                                                                            <span>{dayjs(pt.createdAt.split('T')[0]).format('DD [de] MMMM [del] YYYY ')}</span>
                                                                        </div>
                                                                        <div className="nameData">
                                                                            <h3>
                                                                                {
                                                                                    pt.materium ?
                                                                                        `${pt.materium.description}`
                                                                                    : 'Sin nombre'
                                                                                }
                                                                            </h3>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                 <td className="middle Almacen" style={{fontSize:12}}>
                                                                    <span>{pt.cantidad > 0 ? `+ ${pt.cantidad}` : pt.cantidad < 0 ? `${pt.cantidad}` : 0 }</span>
                                                                </td>
                                                                <td className="middle Almacen" style={{fontSize:12}}>
                                                                    <span>{pt.tipoMovimiento}</span>
                                                                </td>

                                                            </tr>
                                                    )
                                                })
                                            :null
                                        }

                                    </tbody>
                                </table>
                            </div>
                            <div className="ContainerResultFilter">
                                {
                                    !options ?
                                        <div className="dataContainer">
                                            <div className="boxContainer">
                                                <div className="headerBox">
                                                    <h3>Productos</h3>
                                                </div>
                                                <h3 className='h3'>550</h3>
                                            </div>
                                            <div className="boxContainer">
                                                <div className="headerBox">
                                                    <h3>Opciones rápidas</h3>
                                                </div>
                                                <button onClick={() => setOptions('moveExistencias')}>
                                                    <span>¡Ingresar existencias!</span>
                                                </button><br />
                                                <button>
                                                    <span>¡Sacar existencias!</span>
                                                </button>
                                            </div>
                                            <div className="boxContainer">
                                                <div className="headerBox">
                                                    <h3>Preguntas que te podrían interesar</h3>
                                                </div>
                                                <button onClick={() => setOptions('questions')}>
                                                    <span>¡Vamos!</span>
                                                </button>
                                            </div>
                                        </div>
                                    : options == 'moveExistencias' ?
                                        <div className="dataContainer">
                                            <div className="moving">
                                                <div className="close">
                                                    <button onClick={() => setOptions(null)}>X</button>
                                                </div> 
                                                <div className="vector">
                                                    <img src="https://www.bindwise.com/blog/content/images/2018/06/invenotry-grow.gif" alt="" />
                                                    <h3>Moviendo existencias</h3>
                                                </div>

                                                <div className="confirmar">
                                                    <button>
                                                        <span>Confirmar</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    : options == 'questions' ?
                                        <div className="dataContainer">
                                            <div className="moving">
                                                <div className="close">
                                                    <button onClick={() => setOptions(null)}>X</button>
                                                </div> 
                                                <div className="vector"><br />
                                                    <h3>Preguntas express</h3>
                                                </div>

                                                <div className="questionsAsk">
                                                    <div className="itemQuestions">
                                                        <h3>¿Cúal es el producto con más movimientos?</h3>
                                                    </div>
                                                    <div className="itemQuestions">
                                                        <h3>¿10 Productos con menos existencias?</h3>
                                                    </div>
                                                    <div className="itemQuestions">
                                                        <h3>¿Cúales productos estan en negativo?</h3>
                                                    </div>
                                                    <div className="itemQuestions">
                                                        <h3>¿Cúales productos estan alerta?</h3>
                                                    </div>
                                                    <div className="itemQuestions">
                                                        <h3>¿Cúales productos estan en positivo?</h3>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    : null
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}