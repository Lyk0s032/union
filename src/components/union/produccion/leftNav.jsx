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
                                <li className={location.pathname == '/produccion' || location.pathname == '/produccion/' ? 'Active' : null} onClick={() => {
                                    navigate('/produccion')
                                }}>
                                    <div>
                                        <span>Kit's</span>
                                    </div>
                                </li>
                                <li className={location.pathname == '/produccion/lineas' || location.pathname == '/produccion/lineas/' ? 'Active' : null} onClick={() => {
                                    navigate('lineas/')
                                }}>
                                    <div>
                                        <span>Lineas</span>
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