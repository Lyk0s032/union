import axios from 'axios';
import React, { useState } from 'react';

export default function Login(){
    const [state, setState] = useState(null);
    const [email, setEmail] = useState(null);   // Estado de Email
    const [password, setPassword] = useState(null); // Estado de password

    const [message, setMessage] = useState({
        type: null,
        message:null
    });

    const [loading, setLoading] = useState(false);

    const showState = (val) => {
        setState(val)
    }
    const changeMessage = (type, message) => {
        setMessage({
            type: type ? type : null,
            message: message ? message : null
        })
    }
    const validateEmail = async (email) => {
        // Validamos el email
        if(!email) return changeMessage('negative', 'Ingresa una dirección de correo electrónico.')
        // Caso contrario, enviamos la petición de busqueda
        // Creamos el JSON
        const body = {
            email
        }
        const searchValidation = await axios.post('/api/users/validate', body)
        .then((res) => {
            if(res.status == 404) return changeMessage('negative', 'Esta dirección de correo, no existe')
            if(res.status == 200){
                showState('password')
                setMessage(null, null)
            } 
        })
        .catch(err => {
            if(err.status == 404) return changeMessage('negative', 'Esta dirección de correo, no existe')
            console.log(err);
            changeMessage('negative', 'Ha ocurrido un error, intentalo más tarde')
        })

        return searchValidation
    }

    const signIn = async(req, res) => {
        if(!password) return changeMessage('negative', 'No puedes dejar la contraseña vacia.');
        setLoading(true);

        let body = {
            phone: email,
            password: password 
        }
        const login = await axios.post('/api/users/sign', body)
        .then((res) => {  
            changeMessage(null, null)
            setLoading(false) 
            changeMessage('positive','Logueado')
            if(res && res.status == 200){
                console.log(res.data);
                window.localStorage.setItem("loggedPeople", JSON.stringify(res.data.data));
               return res.data
            }
        })
        .then((data) => {
            // dispatch(actions.AxiosAuthUser(data.data, true));
        })
        .catch(err => {
            setLoading(false)
            if(err.status == 404){
                return changeMessage('negative','No hemos encontrado este usuario')
            }else if(err.status == 401){
                changeMessage('negative', 'La contraseña no es valida');
            }else{
                changeMessage('negative','Mensaje generico')
            }

        })
        
        return login
    }
    return ( 
        <div className="loginComponent">
            <div className="containerLogin">
                <div className="boxLogin">
                    <div className="containerBoxLogin">
                        <div className="logo">
                            <img src="https://metalicascosta.com.co/assets/img/logo_metalicas_costa.png" alt="" />
                        </div>
                        {
                            !state ?
                            <div className="titleMessage">
                                <h3>Iniciar sesión</h3>
                                <span>Hagamos del trabajo, algo que nos apasione</span>
                            </div>
                            :
                            <div className="titleMessage">
                                <h3>Ingresa tu contraseña</h3>
                                <span>Recuerda que tu contraseña, es algo privado.</span>
                            </div>
                        }
                        <div className="form">
                            <div className="containerForm">
                                {
                                    !state ?
                                    <div className="inputDiv Email">
                                        <input id="email" type="text" placeholder='Escribe tu email' onChange={(e) => {
                                            setEmail(e.target.value)
                                        }} onKeyDown={(evt) => {
                                            if(evt.code == 'Enter'){
                                                validateEmail(email)
                                            }
                                        }} value={email}/>
                                    </div> 
                                    : null
                                }
                                {
                                     state == 'password' ?
                                    <div  className="inputDiv Password">
                                        <input id="password" type="password" placeholder='Escribe tu contraseña'
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                        }}
                                       defaultValue={password} value={password} />
                                    </div>
                                    : null
                                }
                                
                                <div className="buttonGo">
                                    {
                                        state == 'password' ?
                                        <button className="change" onClick={() => setState(null)}>
                                            <span>Cambiar de email </span>
                                        </button>
                                        :null  
                                    }
                                    {
                                        !state ?
                                        <button className='next' onClick={() => validateEmail(email)}>
                                            <span>Siguiente</span>
                                        </button>
                                        :
                                        <button className='next' onClick={() => signIn()}>
                                            <span>¡Vamos!</span>
                                        </button>
                                        
                                    }   
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                message && message.message ? 
                <div className="mistake">
                    <div className="containerMistake">
                        <div className="text">
                            <span>{message.message}</span>
                        </div>
                    </div>
                </div>
                :null
            }
        </div>
    )
}