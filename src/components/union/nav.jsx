import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as actions from '../store/action/action';
import { hasPermission } from './acciones';

export default function Nav(){
    const navigate = useNavigate();

    const usuario = useSelector(store => store.usuario);
    
    const { user } = usuario;
    const dispatch = useDispatch();
    const logged = () => {
        localStorage.removeItem('loggedPeople');
        dispatch(actions.GET_USER(null))
    }
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
                            {
                                hasPermission(user.user, 'cotizar_distribuidor') && (
                                    <li onClick={() => navigate('/comercial')}>
                                        <div>
                                            <span>Comercial</span>
                                        </div>
                                    </li>
                                )
                            } 
                        </ul>
                    </nav> 
                </div>
                <div className="user">
                    <div className="containerUser">
                        <nav>
                            <ul> 
                                <li>
                                    <div>
                                        <h3 className="person">
                                            {user.user.name}
                                        </h3>
                                        <button onClick={() => logged()}>
                                            <span>Cerrar sesión</span>
                                        </button>
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