import React, { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdOutlineImage, MdOutlineTextFields } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from './../../../../store/action/action';
import axios from 'axios';

export default function ResponseMessage({ close , requerimiento }){
    const [data, setData] = useState('text')
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const [loading, setLoading] = useState(false);    
    const [form, setForm] = useState({
        message: '',
        images: [],
        requerimientoId: requerimiento.id,
        userId: user.user.id
    })
    const [imagenes, setImages] = useState([]);
    const dispatch = useDispatch();

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files); // Convertir FileList a array
        setImages((prev) => [...prev, ...files]); // Agregar nuevas imágenes al array
    };


    const handleMessage = async () => {
        if(!form.message) return dispatch(actions.HandleAlerta('Ingresa un mensaje'))
        setLoading(true)


        const formData = new FormData();

        formData.append('message', form.message);
        formData.append('reqId', form.requerimientoId);
        formData.append('userId', form.userId);

        if (imagenes && imagenes.length > 0) {
            imagenes.forEach((img) => {
                formData.append('images', img); // "images" debe coincidir con el nombre en tu backend
            });
        }

        const sendMessage = await axios.post('/api/kit/requerimientos/post/add/message', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((res) => {
            dispatch(actions.axiosToGetRequerimiento(false, requerimiento.id))
            console.log(res.data)
            close()
        })
        .catch(err => {
            console.log(err);
            dispatch(actions.HandleAlerta('No hemos logrado enviar este mensaje', 'mistake'))
        })
        .finally(() => setLoading(false))
        return sendMessage;
    }
    return (
        <div className="messangeAndAdj">
            <div className="containerMessageUser">
                <div className="titleMessage Me">
                    <div className="leftMessageUser">
                        <div className="letter">
                            <div className="circle">
                                <h3>{user.user.name.split('')[0]}</h3>
                            </div>
                        </div>
                        <div className="dataUserMessage">
                            <h3>{user.user.name}</h3>
                            <span>Escribiendo...</span>
                        </div>
                    </div>
                    <div className="rightUserMessage">
                        <span>
                            Fecha
                        </span>
                    </div>
                </div>
                <div className="messegeContainerUser Me">
                    <div className="leftFilterMessage">
                        <nav>
                            <ul>
                                <li className={data == 'text' ? 'Active' : null} onClick={() => setData('text')}>
                                    <div className="text Active">
                                        <MdOutlineTextFields className="icon Active" />
                                    </div>
                                </li>
                                <li className={data == 'image' ? 'Active' : null}  onClick={() => setData('image')}>
                                    <div>
                                        <MdOutlineImage className="icon" />
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    {
                        data == 'text' ?
                            <div className="rightMessageContainer">
                                <div className="writeMessage">
                                    <textarea name="" id="" placeholder='Comencemos...' onChange={(e) => {
                                        setForm({
                                            ...form,
                                            message: e.target.value
                                        })
                                    }} value={form.message}></textarea>
                                </div><br />

                                 <button onClick={() => {
                                    handleMessage()
                                 }}>
                                    <span>Enviar</span>
                                </button>
                            </div>
                        : data == 'image' ?
                                <div className="rightMessageContainer">
                                    {
                                        imagenes?.length ? 
                                            <div className="containerImages Edit">
                                                
                                                    {
                                                        imagenes.map((r, index) => {
                                                            return (
                                                                <div className="image">
                                                                    <img src={URL.createObjectURL(r)} alt={`preview-${index}`} key={index}   
                                                                    onClick={() => {
                                                                        setImages((prev) => prev.filter((_, i) => i !== index));
                                                                    }}/>
                                                                    </div>
                                                            )
                                                        })
                                                    }
                                                
                                                <div className="image File">
                                                    <input type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageChange} />
                                                </div>

                                            </div>
                                    : 
                                        <div className="messageNotiSmall">
                                            <div className="containerThis">
                                                <h3>Selecciona imagen</h3>
                                                <input type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageChange} />

                                            </div>
                                        </div>
                                    }
                                </div>
                        :null
                    }
                    
                   
                </div>
            </div>
        </div>
    )
}