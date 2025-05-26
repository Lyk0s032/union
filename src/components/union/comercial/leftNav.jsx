import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

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
                        <h1>Comercial</h1>
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
                        {console.log(location.pathname)}
                <div className="optionsLeftNav">
                    <div className="containerLeftNav">
                        <nav>
                            <ul>
                                <li className={location.pathname === '/comercial' ||  location.pathname === '/comercial/' ? 'Active' : null } onClick={() => {
                                        navigate('/comercial/')
                                    }}>
                                    <div>
                                        <span>Cotizaciones</span>
                                    </div>
                                </li>
                                <li className={location.pathname === '/comercial/galeria' ||  location.pathname === '/comercial/galeria/' ? 'Active' : null }  onClick={() => {
                                        navigate('/comercial/galeria')
                                    }}>
                                    <div>
                                        <span>Galería</span>
                                    </div>
                                </li>
                                
                                <li className={location.pathname === '/comercial/clients' ||  location.pathname === '/comercial/clients/' ? 'Active' : null } onClick={() => {
                                    navigate('/comercial/clients')
                                }}>
                                    <div>
                                        <span>Clientes</span>
                                    </div>
                                </li>
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