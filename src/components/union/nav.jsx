import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Nav(){
    const navigate = useNavigate();
    return (
        <div className="navigation">
            <div className="containerNav">
                <div className="logo">
                    <img src="https://metalicascosta.com.co/assets/img/logo_metalicas_costa.png" alt="" />
                </div>
                <div className="optionsGeneral">
                    <nav>
                        <ul>
                            <li onClick={() => navigate('/compras')}>
                                <div>
                                    <span>Compras</span>
                                </div>
                            </li>
                            <li onClick={() => navigate('/produccion')}>
                                <div>
                                    <span>Producción</span>
                                </div>
                            </li>
                            {/* <li onClick={() => navigate('/comercial')}>
                                <div>
                                    <span>Comercial</span>
                                </div>
                            </li> */}
                        </ul>
                    </nav>
                </div>
                <div className="user">
                    <div className="containerUser">
                        <nav>
                            <ul>
                                <li>
                                    <div>
                                        <span>P</span>
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