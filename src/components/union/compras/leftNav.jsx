import React from 'react';
import { BsPlusCircle } from 'react-icons/bs';
import { FaChevronDown } from 'react-icons/fa6';
import { MdDesignServices, MdFormatListBulleted, MdNetworkPing, MdOutlineAddBox, MdOutlineDashboard, MdOutlineExtension, MdOutlineFolder, MdOutlineNetworkPing, MdOutlineStoreMallDirectory, MdStorefront } from 'react-icons/md';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

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
                <div className="topTitlee">
                    <div className="container">
                        <h1>Compras</h1>
                    </div>
                </div><br />

                <div className="optionsLeftNav">
                    <div className="containerLeftNav">
                        <nav>
                            <ul>
                                <li className={location.pathname === '/compras' ||  location.pathname === '/compras/' ? 'Active' : null } onClick={() => {
                                        navigate('/compras')
                                    }}>
                                    <div className='divideLi'>
                                        <div className="leftOption">
                                            <MdOutlineDashboard className="icon" />
                                            <span>Inicio</span>
                                        </div>
                                        {/* <FaChevronDown className="icon" /> */}
                                        
                                    </div>
                                </li>
                                <li className={location.pathname === '/compras/requisiciones' ||  location.pathname === '/compras//requisiciones/' ? 'Active' : null } onClick={() => {
                                        navigate('/compras/requisiciones')
                                    }}>
                                    <div className='divideLi'>
                                        <div className="leftOption">
                                            <MdFormatListBulleted className="icon" />
                                            <span>Requisiciones</span>
                                        </div>
                                        
                                    </div>
                                </li>
                                <li className={location.pathname === '/compras/pv' ||  location.pathname === '/compras/pv/' ? 'Active' : null } onClick={() => {
                                    navigate('/compras/pv')
                                }}>
                                    <div className='divideLi'>
                                        <div className="leftOption">
                                            <MdStorefront className="icon" />
                                            <span>Proveedores</span>
                                        </div>
                                        {/* <FaChevronDown className="icon" /> */}
                                        
                                    </div>
                                </li>
                                <li onClick={() => {
                                    navigate('/compras/mp')
                                }} className={location.pathname === '/compras/mp' ||  location.pathname === '/compras/mp/' ? 'Active' : null }>
                                    <div className='divideLi'>
                                        <div className="leftOption">
                                            <MdOutlineAddBox className="icon" />
                                            <span>Lista de materia prima</span>
                                        </div>
                                        {/* <FaChevronDown className="icon" /> */}
                                        
                                    </div>
                                </li>
                                <li onClick={() => {
                                    navigate('/compras/pt')
                                }} className={location.pathname === '/compras/pt' ||  location.pathname === '/compras/pt/' ? 'Active' : null }>
                                    <div className='divideLi'>
                                        <div className="leftOption">
                                            <MdOutlineStoreMallDirectory className="icon" />
                                            <span>Lista de producto terminado</span>
                                        </div>
                                        {/* <FaChevronDown className="icon" /> */}
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>


                <div className="topTitlee">
                   <div className="optioness Relative">
                        <nav>
                            <ul>
                                <li onClick={() => {
                                    add('categoria')
                                }}>
                                    <div className="extension">
                                        <div className="divideIcons">
                                            <MdOutlineFolder className="icon" />
                                            <span>Categorias</span>
                                        </div>
                                        <BsPlusCircle className="icon"  />
                                    </div>
                                </li>
                                <li onClick={() => {
                                    add('linea')
                                }} >
                                    <div className="extension">
                                        <div className="divideIcons">
                                            <MdOutlineNetworkPing className="icon" />
                                            <span>Líneas</span>
                                        </div>
                                        <BsPlusCircle className="icon"  />
                                    </div>
                                </li>
                                <li onClick={() => {
                                    add('extension')
                                }}>
                                    <div className="extension">
                                        <div className="divideIcons">
                                            <MdOutlineExtension className="icon" />
                                            <span>Extensiones</span>
                                        </div>
                                        <BsPlusCircle className="icon"  />
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}