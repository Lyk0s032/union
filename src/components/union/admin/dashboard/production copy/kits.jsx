import React from 'react';
import KitItemGeneral from './itemCotizacion';

export default function GeneralKits(){
    return (
        <div className="listResultsData">
            <div className="containerKits">
                <div className="headerSeccion">
                    <h3>Kit's</h3>
                </div>
                <div className="topDataKits">
                    <div className="divide">
                        <div className="leftGraph">
                            <h1>Aquí va la gráfica</h1>
                        </div>
                        <div className="rightDataGraph">
                            <div className="containerDataRightGraph">
                                <div className="box">
                                    <div className="headerBox">
                                        <h3>Kit's creados</h3>
                                    </div>
                                    <h3 className='h3'>740</h3>
                                </div>
                                <div className="box">
                                    <div className="headerBox">
                                        <h3>Kit's en completos</h3>
                                    </div>
                                    <h3 className='h3'>735</h3>
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
                                <label htmlFor="">Selecciona una fecha</label><br />
                                <input type="date" />
                            </div>
                            <div className="categoriums">
                                <div className="inputDiv">
                                    <label htmlFor="">Categorías</label><br />
                                    <select name="" id="">
                                        <option value="">Seleccionar</option>
                                    </select>
                                </div>
                                <div className="inputDiv">
                                    <label htmlFor="">Línea</label><br />
                                    <select name="" id="">
                                        <option value="">Seleccionar</option>
                                    </select>
                                </div>
                                <div className="inputDiv">
                                    <label htmlFor="">Extensión</label><br />
                                    <select name="" id="">
                                        <option value="">Seleccionar</option>
                                    </select>
                                </div>    
                            
                            </div>
                        </div>
                    </div>
                    <div className="containerDataFilters">
                        <div className="divide">
                            <div className="tableData">
                                <table>
                                    <tbody>
                                        <KitItemGeneral />
                                        <KitItemGeneral />
                                        <KitItemGeneral />
                                        <KitItemGeneral />
                                    </tbody>
                                </table>
                            </div>
                            <div className="ContainerResultFilter">
                                <div className="dataContainer">
                                    <div className="boxContainer">
                                        <div className="headerBox">
                                            <h3>Resultados</h3>
                                        </div>
                                        <h3 className='h3'>251</h3>
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