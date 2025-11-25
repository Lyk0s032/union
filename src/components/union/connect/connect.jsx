import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';

export default function Connect(){
    const [enlazar, setEnlazar] = useState(null);

    return (
        <div className="connectModal">
            <div className="containerConnectModal">
                <div className="headerModal">
                    <div className="title">
                        <h3>Conexión al CRM</h3>
                        <span>Estado de conexión actual</span>
                    </div>
                    <button>
                        <MdClose className='icon' />
                    </button>
                </div>
                <div className="bodyModal">
                    <div className="containerBodyToConnect">
                        {
                            !enlazar ?
                                <div className="messageBox">
                                    <h1>No hay ningún enlace al CRM</h1>
                                    <span>Haz clic en el botón para comenzar a enlanzar</span> <br /><br />
                                    <button onClick={() => setEnlazar(true)}>
                                        <span>Enlazar</span>
                                    </button>
                                </div>
                            : 
                                <div className="messageBox">
                                    <h1>¡Perfecto! Empecemos</h1>
                                    <span>Ingresa el número de teléfono que tienes registrado en el CRM</span> <br /><br />
                                    <div className="inputDiv">
                                        <input type="text" placeholder='Escribe aquí' />
                                    </div><br />
                                    <button>
                                        <span>Enlazar</span>
                                    </button>
                                    <button className="later" onClick={() => setEnlazar(null)}>
                                        <span>Cancelar</span>
                                    </button>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}