import React from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import { MdDesignServices } from 'react-icons/md';
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
                <div className="topTitle">
                    <div className="container">
                        <h1>Compras</h1>
                    </div>
                
                </div>

                <div className="optionsLeftNav">
                    <div className="containerLeftNav">
                        <nav>
                            <ul>
                                <li className={location.pathname === '/compras' ||  location.pathname === '/compras/' ? 'Active' : null } onClick={() => {
                                        navigate('/compras')
                                    }}>
                                    <div className='divideLi'>
                                        <div className="leftOption">
                                            <MdDesignServices className="icon" />
                                            <span>Inicio</span>
                                        </div>
                                        {/* <FaChevronDown className="icon" /> */}
                                        
                                    </div>
                                </li>
                                {/* <li className={location.pathname === '/compras/requisiciones' ||  location.pathname === '/compras//requisiciones/' ? 'Active' : null } onClick={() => {
                                        navigate('/compras/requisiciones')
                                    }}>
                                    <div className='divideLi'>
                                        <div className="leftOption">
                                            <MdDesignServices className="icon" />
                                            <span>Requisiciones</span>
                                        </div>
                                        
                                    </div>
                                </li> */}
                                <li className={location.pathname === '/compras/pv' ||  location.pathname === '/compras/pv/' ? 'Active' : null } onClick={() => {
                                    navigate('/compras/pv')
                                }}>
                                    <div className='divideLi'>
                                        <div className="leftOption">
                                            <MdDesignServices className="icon" />
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
                                            <MdDesignServices className="icon" />
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
                                            <MdDesignServices className="icon" />
                                            <span>Lista de producto terminado</span>
                                        </div>
                                        {/* <FaChevronDown className="icon" /> */}
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