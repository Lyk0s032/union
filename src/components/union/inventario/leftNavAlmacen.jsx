import React from 'react';
import { MdDesignServices, MdNetworkCheck, MdOutlineAssignment, MdPeople, MdWindow } from 'react-icons/md';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FaChevronDown } from "react-icons/fa6";

export default function LeftNav(){
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();
    const location = useLocation();
    const add = (val) => {
        params.set('add', val)
        setParams(params);
    }
    return (
        <div className="leftNav UX">
            <div className="containerLeftNavBig">
                <div className="topTitle">
                    <div className="container">
                        <h1>Almacen</h1>
                    </div>
                    {/* <div className="options">
                        <nav>
                            <ul>
                                <li onClick={() => add('categoria')}>
                                    <span>Categorías</span>
                                </li>
                                <li onClick={() => add('linea')}>
                                    <span>Líneas</span>
                                </li>
                                <li onClick={() => add('extension')}>
                                    <span>Extensiones</span>
                                </li>
                            </ul>
                        </nav>
                    </div> */}
                </div>

                <div className="optionsLeftNav">
                    <div className="containerLeftNav">
                        <nav>
                            <ul>
                                {/* <li className={location.pathname == '/produccion' || location.pathname == '/produccion/' ? 'Active' : null} onClick={() => {
                                    navigate('/produccion')
                                }}>
                                    <div className="divideLi">
                                        <div className="leftOption">
                                            <MdWindow className="icon" />
                                            <span>Zona principal</span>
                                        </div>

                                        <FaChevronDown className="icon" />
                                    </div> 
                                </li> */}
                                <li className={location.pathname == '/inventario' || location.pathname == '/inventario/' ? 'Active' : null} onClick={() => {
                                    navigate('/inventario')
                                }}>
                                    <div className="divideLi">
                                        <div className="leftOption">
                                            <MdDesignServices className="icon" />
                                            <span>Principal</span>
                                        </div>
                                        <FaChevronDown className="icon" />
                                        
                                    </div>
                                </li>

                                <li className={location.pathname == '/inventario/pedidos' || location.pathname == '/inventario/pedidos/' ? 'Active' : null} onClick={() => {
                                    navigate('/inventario/pedidos')
                                }}>
                                    <div className="divideLi">
                                        <div className="leftOption">
                                            <MdDesignServices className="icon" />
                                            <span>Pedidos</span>
                                        </div>
                                        <FaChevronDown className="icon" />
                                        
                                    </div>
                                </li>
                                <li className={location.pathname == '/inventario/bodegas' || location.pathname == '/inventario/bodegas' ? 'Active' : null} onClick={() => {
                                    navigate('/inventario/bodegas')
                                }}>
                                    <div className="divideLi">
                                        <div className="leftOption">
                                            <MdDesignServices className="icon" />
                                            <span>Bodegas</span>
                                        </div>
                                        <FaChevronDown className="icon" />
                                        
                                    </div>
                                </li>
                                <li className={location.pathname == '/produccion/lineas' || location.pathname == '/produccion/lineas/' ? 'Active' : null} onClick={() => {
                                    navigate('lineas/')
                                }}>
                                    <div className='divideLi'>
                                        <div className="leftOption">
                                            <MdOutlineAssignment className="icon" />
                                            <span>Lineas</span>
                                        </div>
                                        <FaChevronDown className="icon" />

                                    </div>
                                </li>
                                {/* <li className={location.pathname == '/produccion/lineas' || location.pathname == '/produccion/lineas/' ? 'Active' : null} onClick={() => {
                                    navigate('lineas/')
                                }}>
                                    <div className='divideLi'>
                                        <div className="leftOption">
                                            <MdNetworkCheck className="icon" />
                                            <span>Zona de producción</span>
                                        </div>
                                        <FaChevronDown className="icon" />
                                    </div>
                                </li>
                                <li className={location.pathname == '/produccion/lineas' || location.pathname == '/produccion/lineas/' ? 'Active' : null} onClick={() => {
                                    navigate('lineas/')
                                }}>
                                    <div className='divideLi'>
                                        <div className="leftOption">
                                            <MdPeople className="icon" /> 
                                            <span>Equipo</span>
                                        </div>
                                        <FaChevronDown className="icon" />

                                    </div>
                                </li> */}

                                {/* <li onClick={() => {
                                    navigate('/compras/mp')
                                }}>
                                    <div>
                                        <span>Lista de precios</span>
                                    </div>
                                </li> */}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}