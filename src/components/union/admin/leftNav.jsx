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
                        <h1>Producción</h1>
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
                                <li className={location.pathname == '/admin/comercial' || location.pathname == '/admin/comercial' ? 'Active' : null} onClick={() => {
                                    navigate('/admin/comercial')
                                }}>
                                    <div className="divideLi">
                                        <div className="leftOption">
                                            <MdDesignServices className="icon" />
                                            <span>Panel principal</span>
                                        </div>
                                        <FaChevronDown className="icon" />
                                        
                                    </div>
                                </li>
                                
                                <li className={location.pathname == '/admin/production' || location.pathname == '/admin/production/' ? 'Active' : null} onClick={() => {
                                    navigate('/admin/production/')
                                }}>
                                    <div className='divideLi'>
                                        <div className="leftOption">
                                            <MdOutlineAssignment className="icon" />
                                            <span>Producción</span>
                                        </div>
                                        <FaChevronDown className="icon" />

                                    </div>
                                </li>
                                <li className={location.pathname == '/admin/ordenCompras' || location.pathname == '/admin/ordenCompras/' ? 'Active' : null} onClick={() => {
                                    navigate('/admin/ordenCompras/')
                                }}>
                                    <div className='divideLi'>
                                        <div className="leftOption">
                                            <MdOutlineAssignment className="icon" />
                                            <span>Ordenes de compras</span>
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