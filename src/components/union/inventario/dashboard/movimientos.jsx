import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/action/action';
import dayjs from 'dayjs';

export default function Movimientos(){
        const system = useSelector(store => store.system);
    
        const { porcentajes } = system;
    
        const lineas = porcentajes;
        console.log(lineas)
        const dispatch = useDispatch();
        useEffect(() => {
            dispatch(actions.axiosToGetPorcentajes(false))
        }, [])

    return (
        <div className="listResultsData">
            <div className="containerKits">
                <div className="dataFilters">
                    <div className="containerDataFilters">
                        <div className="divide">
                            <div className="tableData">
                                <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th></th>
                                            <th>Cantidad</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            lineas?.length ? 
                                                lineas.map((l, i) => {
                                                    return (
                                                        l.type == 'comercial' ?
                                                            <tr key={i+1}>
                                                                <td className="coding">
                                                                    <div className="code">
                                                                        <h3>{i+1}</h3>
                                                                    </div>
                                                                </td>
                                                                <td className="longer" > 
                                                                    <div className="titleNameKitAndData">
                                                                        <div className="extensionColor">
                                                                            <div className="boxColor"></div>
                                                                            <span>{dayjs(l.createdAt.split('T')[0]).format('DD [de] MMMM [del] YYYY ')}</span>
                                                                        </div>
                                                                        <div className="nameData">
                                                                            <h3>Lamina AX2</h3>
                                                                            <span>Ingreso</span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="middle" style={{fontSize:12}}>
                                                                    <span>15</span>
                                                                </td>
                                                            </tr>
                                                        : null
                                                    )
                                                })
                                            :null
                                        }

                                    </tbody>
                                </table>
                            </div>
                            <div className="ContainerResultFilter">
                                <div className="dataContainer">
                                    <div className="boxContainer">
                                        <div className="headerBox">
                                            <h3>Movimientos</h3>
                                        </div>
                                        <h3 className='h3'>152</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}