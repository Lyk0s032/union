import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../store/action/action';
import dayjs from 'dayjs';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import ItemProyecto from './itemProyecto';

export default function ListProyectos({ proyectos }){
    
    
    const dispatch = useDispatch();
    const [options, setOptions] = useState(null);
    const [productos, setProducto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [params, setParams] = useSearchParams();


    return (
        <div className="listResultsData">
            <div className="containerKits">
                <div className="dataFilters">
                    <div className="searchDataInput">
                        {/* <input type="text" placeholder='Buscar proyecto' /> */}
                    </div>
                    <div className="containerDataFilters">
                        <div className="divide">
                                <div className="tableData">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                </tr>
                                            </thead> 
                                            <tbody> 
                                                {
                                                    proyectos?.map((proyect, i) => {
                                                        return (
                                                            <ItemProyecto proyecto={proyect} key={i+1} />    
                                                        )
                                                    })
                                                }

                                            </tbody>
                                        </table>
                                </div>
                                    <div className="ContainerResultFilter">
                                            <div className="dataContainer">
                                                    <div className="boxContainer">
                                                        <div className="headerBox">
                                                            <h3>Solicitudes</h3>
                                                        </div>
                                                        <h3 className='h3'>{proyectos?.length}</h3>
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