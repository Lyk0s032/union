import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../../store/action/action';

export default function GeneralLineas(){
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
                <div className="headerSeccion">
                    <h3>Líneas de porcentajes</h3>
                </div>
                <div className="dataFilters">
                    <div className="containerDataFilters">
                        <div className="divide">
                            <div className="tableData">
                                <table>
                                    <tbody>
                                        {
                                            lineas?.length ? 
                                                lineas.map((l, i) => {
                                                    return (
                                                        l.type == 'comercial' ?
                                                            <tr key={i+1}>
                                                                <td className="coding">
                                                                    <div className="code">
                                                                        <h3>{l.id}</h3>
                                                                    </div>
                                                                </td>
                                                                <td className="longer" > 
                                                                    <div className="titleNameKitAndData">
                                                                        <div className="extensionColor">
                                                                            <div className="boxColor"></div>
                                                                            <span>{dayjs(l.createdAt.split('T')[0]).format('DD [de] MMMM [del] YYYY ')}</span>
                                                                        </div>
                                                                        <div className="nameData">
                                                                            <h3>{l.name}</h3>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="middle" style={{fontSize:12}}>
                                                                    <span>{l.percentages ? l.percentages[0].distribuidor : 0}</span>
                                                                </td>
                                                                <td className="middle" style={{fontSize:12}}>{l.percentages ? l.percentages[0].final : 0}</td>
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
                                            <h3>Líneas en el sistema</h3>
                                        </div>
                                        <h3 className='h3'>{lineas?.length ? lineas.filter(li => li.type == 'comercial').length : 0}</h3>
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