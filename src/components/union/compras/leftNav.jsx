import React from 'react';
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
        <div className="leftNav">

            <div className="containerLeftNavBig">
                <div className="topTitle">
                    <div className="container">
                        <h1>Compras</h1>
                    </div>
                    <div className="options">
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
                    </div>
                </div>

                <div className="optionsLeftNav">
                    <div className="containerLeftNav">
                        <nav>
                            <ul>
                                <li className={location.pathname === '/compras' ||  location.pathname === '/compras/' ? 'Active' : null } onClick={() => {
                                        navigate('/compras')
                                    }}>
                                    <div>
                                        <span>Requisiciones</span>
                                    </div>
                                </li>
                                <li className={location.pathname === '/compras/pv' ||  location.pathname === '/compras/pv/' ? 'Active' : null } onClick={() => {
                                    navigate('/compras/pv')
                                }}>
                                    <div>
                                        <span>Proveedores</span>
                                    </div>
                                </li>
                                <li onClick={() => {
                                    navigate('/compras/mp')
                                }} className={location.pathname === '/compras/mp' ||  location.pathname === '/compras/mp/' ? 'Active' : null }>
                                    <div>
                                        <span>Lista de Matería prima</span>
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