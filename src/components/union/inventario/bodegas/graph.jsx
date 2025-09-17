import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/action/action';
import Grafica from './grafica';

export default function Graph(){
    const almacen = useSelector(store => store.almacen);
        
    const { movimientosBodega, loadingMovimientosBodega } = almacen;
    const [options, setOptions] = useState(null);

    const dispatch = useDispatch();
      // 1. Estado para guardar los valores de los filtros
      const [filtros, setFiltros] = useState({
          fechaInicio: '',
          fechaFin: '',
          categoriaId: '',
          lineaId: '',
          extensionId: ''
      });
      const [productos, setProductos] = useState([]);
      const [cargando, setCargando] = useState(false);
  
      const handleChange = (e) => {
          setFiltros({
              ...filtros,
              [e.target.name]: e.target.value
          });
      };
      
    const ahora = dayjs().format('YYYY-MM-DD')
    const atras =  dayjs(ahora).subtract(6, 'month').format('YYYY-MM-DD');   
    return (
        <div className="listResultsData">
            <div className="containerKits">
                <div className="headerSeccion">
                    <h3>Kit's</h3>
                </div>
                <div className="topDataKits">
                    <div className="divide">
                        <div className="leftGraph">
                            <Grafica datos={movimientosBodega} loading={loadingMovimientosBodega} /> 
                        </div>
                        <div className="rightDataGraph">
                            <div className="containerDataRightGraph">
                                <div className="box">
                                    <div className="headerBox">
                                        <h3>Kit's creados</h3>
                                    </div>
                                    <h3 className='h3'>1</h3>
                                </div>
                                <div className="box">
                                    <div className="headerBox">
                                        <h3>Kit's en completos</h3>
                                    </div>
                                    <h3 className='h3'>3</h3>
                                </div>
                                <div className="box">
                                    <div className="headerBox">
                                        <h3>Kits en Desarrollo</h3>
                                    </div>
                                    <h3 className='h3'>5</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="dataFilters">
                    <div className="filtersOptions">
                        <div className="containerFiltersOption">
                            <div className="time">
                                <label htmlFor="">Fecha inicio</label><br />
                                <input type="date"  name="fechaInicio" value={filtros.fechaInicio} onChange={handleChange} />
                            </div>
                            <div className="time">
                                <label htmlFor="">Fecha fin</label><br />
                                <input type="date" name="fechaFin" value={filtros.fechaFin} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}