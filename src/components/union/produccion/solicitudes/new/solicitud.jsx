import React, { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdOutlineImage, MdOutlineTextFields } from 'react-icons/md';
import ResponseMessage from './responseMessage';
import * as actions from './../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import AdjuntMessage from '../mensajeAdjunto';
import axios from 'axios';
import NewKit from './newKit';

export default function Solicitud(open){
    const [imagenes, setImages] = useState(null);
    const [write, setWrite] = useState(null);

    const dispatch = useDispatch();
    const noti = useSelector(store => store.noti);
    const { requerimiento , loadingRequerimiento } = noti;
    const [permiso, setPermiso] = useState(null);
    const [create, setCreate] = useState(null);
    const [data, setData] = useState('image')
    
    const closeWrite = () => {
        setWrite(false);
    }

    const newReq = async () => {
        // Caso contrario, avanzo
        let body = {
            reqId: requerimiento.id
        }

        const sendPetion = await axios.put('/api/kit/requerimiento/put/read', body)
        .then(res => {
            dispatch(actions.axiosToGetRequerimientos(false))
            close()
        })
        .catch(err => {
            console.log(err)
        }) 
        return sendPetion
    }
    const changePermiso = () => {
        if(!permiso){
            setPermiso(true)
        }
    }

    const closeNewKit = () => {
        setCreate(null)
    }
    useEffect(() => {
        if(permiso){
            if(!requerimiento.leidoProduccion){
                newReq()
            }
        }
    }, [permiso])

    useEffect(() => {
        setCreate(null)
    }, [requerimiento])
    return (
        <div className="containerRightNoti">
            {
                !requerimiento || loadingRequerimiento ?
                <div className="boxNotiRight">
                    <h1>Cargando</h1>
                </div>
                : !requerimiento || requerimiento == 404 || requerimiento == 'notrequest' ?
                <div className="boxNotiRight">
                    <h1>No hemos logrado cargar esto</h1>
                </div>
                :
                <div className="boxNotiRight"> {changePermiso()}
                    <div className="titleNoti">
                        <div className="solicitud">
                            <span></span>
                            <span>{requerimiento.createdAt.split('T')[0]}</span>
                        </div>
                        <div className="data">
                            <div className="leftData">
                                <h3>{requerimiento.nombre}</h3>
                                <h4>@{`${requerimiento.user.name} ${requerimiento.user.lastName}`}</h4>
                            </div>
                            <div className="rightData">
                                <strong>KIT</strong><br />
                                {
                                    requerimiento.state == 'finish' ? null :
                                    <button onClick={() => {
                                        if(create == 'kit' || create == 'producto'){
                                            return setCreate(null)
                                        }
                                        if(requerimiento.tipo == 'kit'){
                                            setCreate('kit')
                                        }
                                         
                                    }}>{ create ? 'Cancelar' : 'Crear'}</button>
                                }
                            </div> 
                        </div>
                    </div>
                    <div className="containerDataSolicitud">
                        <div className="description">
                            <strong>Detalles</strong>
                            <h3>{requerimiento.description}</h3>
                        </div>
                        {
                            create == 'kit' ?
                            <div className="create">
                                <NewKit close={closeNewKit} requerimiento={requerimiento} />
                            </div>
                            : null
                        }
                        <div className="messangeAndAdj">
                            {
                                requerimiento.adjuntRequireds?.length ?
                                    requerimiento.adjuntRequireds.map((req, i) => {
                                        return (
                                            <AdjuntMessage message={req} key={i+1} />
                                        )
                                    })
                                : null
                            }
                            {
                                requerimiento.state == 'finish' || requerimiento.state == 'cancel' ?
                                    null
                                : !write ?
                                <div className="plusNewMessage">
                                
                                    <button onClick={() => {
                                        setWrite(true)
                                    }}>
                                        <AiOutlinePlus className="icon" />
                                    </button>
                                </div>
                                :
                                    <ResponseMessage requerimiento={requerimiento} close={closeWrite} />
                            }
                        </div><br /><br /><br />

                        <div className="lastOption">
                            {
                                requerimiento.kit && requerimiento.state == 'finish' ?
                                    <div className="kitCreado">
                                        <h3>¡Tu kit esta listo!</h3>
                                        <div className="data">
                                            <span>Código y nombre</span>
                                            <h3><span>{requerimiento.kit.id}</span><br />{requerimiento.kit.name}</h3>
                                        </div>
                                    </div>
                                : null
                            }
                           {
                            requerimiento.state == 'finish' ?
                                <h3>Este pedido ya finalizo</h3>
                            
                            : requerimiento.state == 'cancel' ?
                                <h1>Esta solicitud se cancelo</h1>
                            :
                                null
                            //  <button className="cancels">
                            //     <span>Cancelar pedido</span>
                            // </button>
                           }
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}