import React, { useState, useRef, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdOutlineImage, MdOutlineTextFields } from 'react-icons/md';
import { IoCloseSharp } from 'react-icons/io5';
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

    // 🎯 SISTEMA DE MENCIONES (@)
    const [mentionedUsers, setMentionedUsers] = useState([]); // Array de usuarios mencionados
    const [availableUsers, setAvailableUsers] = useState([]); // Lista de usuarios disponibles para mencionar
    const [showMentionsList, setShowMentionsList] = useState(false);
    const [mentionSearchQuery, setMentionSearchQuery] = useState('');
    const [cursorPosition, setCursorPosition] = useState(0);
    const textareaRef = useRef(null);

    // 🔍 OBTENER USUARIOS DISPONIBLES PARA MENCIONAR
    useEffect(() => {
        const fetchAvailableUsers = async () => {
            try {
                const response = await axios.get('/api/user/all');
                const users = response.data;
                
                // Filtrar: solo admins + el asesor del requerimiento, excluir al usuario actual
                const filteredUsers = users.filter(u => {
                    // Excluir al usuario que está escribiendo
                    if (u.id === user.user.id) return false;
                    
                    // Incluir admins
                    if (u.rango === 'admin') return true;
                    
                    // Incluir al asesor que creó el requerimiento (aunque no sea admin)
                    if (u.id === requerimiento.userId) return true;
                    
                    return false;
                });
                
                setAvailableUsers(filteredUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        
        fetchAvailableUsers();
    }, [user.user.id, requerimiento.userId]);

    // 🖱️ CERRAR LISTA DE MENCIONES AL HACER CLIC FUERA
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (textareaRef.current && !textareaRef.current.contains(event.target)) {
                setShowMentionsList(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files); // Convertir FileList a array
        setImages((prev) => [...prev, ...files]); // Agregar nuevas imágenes al array
    };

    // 🏷️ MANEJAR CAMBIOS EN EL TEXTAREA CON MENCIONES
    const handleTextChange = (e) => {
        const value = e.target.value;
        const cursorPos = e.target.selectionStart;
        
        setForm({
            ...form,
            message: value
        });
        setCursorPosition(cursorPos);
        
        // Detectar si se está escribiendo una mención (@)
        const textBeforeCursor = value.substring(0, cursorPos);
        const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
        
        if (mentionMatch) {
            setMentionSearchQuery(mentionMatch[1]);
            setShowMentionsList(true);
        } else {
            setShowMentionsList(false);
            setMentionSearchQuery('');
        }
    };

    // ✅ SELECCIONAR USUARIO PARA MENCIONAR
    const selectMentionUser = (selectedUser) => {
        const textarea = textareaRef.current;
        const textBeforeCursor = form.message.substring(0, cursorPosition);
        const textAfterCursor = form.message.substring(cursorPosition);
        
        // Remover el @ y la búsqueda parcial
        const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
        if (mentionMatch) {
            const beforeMention = textBeforeCursor.substring(0, mentionMatch.index);
            const newMessage = `${beforeMention}@${selectedUser.nombre} ${textAfterCursor}`;
            
            setForm({
                ...form,
                message: newMessage
            });
            
            // Agregar usuario a la lista de mencionados si no está ya
            if (!mentionedUsers.find(u => u.id === selectedUser.id)) {
                setMentionedUsers(prev => [...prev, selectedUser]);
            }
        }
        
        setShowMentionsList(false);
        setMentionSearchQuery('');
        
        // Enfocar textarea nuevamente
        setTimeout(() => {
            textarea.focus();
        }, 100);
    };

    // ❌ ELIMINAR MENCIÓN
    const removeMention = (userToRemove) => {
        // Remover de la lista de mencionados
        setMentionedUsers(prev => prev.filter(u => u.id !== userToRemove.id));
        
        // Remover del texto del mensaje
        const mentionPattern = new RegExp(`@${userToRemove.nombre}\\s?`, 'g');
        const newMessage = form.message.replace(mentionPattern, '');
        
        setForm({
            ...form,
            message: newMessage
        });
    };

    // 🔍 FILTRAR USUARIOS DISPONIBLES SEGÚN LA BÚSQUEDA
    const getFilteredUsers = () => {
        if (!mentionSearchQuery) return availableUsers;
        
        return availableUsers.filter(user =>
            user.nombre.toLowerCase().includes(mentionSearchQuery.toLowerCase())
        );
    };


    const handleMessage = async () => {
        if(!form.message) return dispatch(actions.HandleAlerta('Ingresa un mensaje'))
        setLoading(true)

        const formData = new FormData();

        formData.append('message', form.message);
        formData.append('reqId', form.requerimientoId);
        formData.append('userId', form.userId);
        
        // 🎯 AGREGAR ARRAY DE USUARIOS A NOTIFICAR
        // Incluir el dueño del requerimiento + usuarios mencionados
        const usersToNotify = [];
        
        // Siempre incluir al dueño del requerimiento (asesor)
        if (requerimiento.userId && requerimiento.userId !== user.user.id) {
            usersToNotify.push(requerimiento.userId);
        }
        
        // Agregar usuarios mencionados
        mentionedUsers.forEach(mentionedUser => {
            if (!usersToNotify.includes(mentionedUser.id) && mentionedUser.id !== user.user.id) {
                usersToNotify.push(mentionedUser.id);
            }
        });
        
        // Enviar el array como JSON string
        formData.append('userToNotify', JSON.stringify(usersToNotify));
        
        console.log('🔔 Usuarios a notificar:', usersToNotify);

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
            // Limpiar menciones después de enviar
            setMentionedUsers([]);
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
                                <h3>K</h3>
                            </div>
                        </div>
                        <div className="dataUserMessage">
                            <h3>Kevin Andrés Bolaños Orrego</h3>
                            <span>Escribiendo...</span>
                        </div>
                    </div>
                    <div className="rightUserMessage">
                        <span>
                            8 de Agosto, 10:30 AM
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
                                {/* 🏷️ MOSTRAR USUARIOS MENCIONADOS */}
                                {mentionedUsers.length > 0 && (
                                    <div className="mentionedUsersContainer" style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '8px',
                                        marginBottom: '10px',
                                        padding: '8px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '6px',
                                        border: '1px solid #e9ecef'
                                    }}>
                                        <span style={{ fontSize: '12px', color: '#6c757d', fontWeight: '500' }}>
                                            Menciones:
                                        </span>
                                        {mentionedUsers.map((mentionedUser) => (
                                            <div
                                                key={mentionedUser.id}
                                                className="mentionTag"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    backgroundColor: '#007bff',
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    cursor: 'pointer',
                                                    position: 'relative'
                                                }}
                                                onMouseEnter={(e) => {
                                                    const closeBtn = e.target.querySelector('.closeMention');
                                                    if (closeBtn) closeBtn.style.display = 'inline-flex';
                                                }}
                                                onMouseLeave={(e) => {
                                                    const closeBtn = e.target.querySelector('.closeMention');
                                                    if (closeBtn) closeBtn.style.display = 'none';
                                                }}
                                            >
                                                @{mentionedUser.nombre}
                                                <IoCloseSharp
                                                    className="closeMention"
                                                    style={{
                                                        marginLeft: '6px',
                                                        cursor: 'pointer',
                                                        display: 'none',
                                                        fontSize: '14px'
                                                    }}
                                                    onClick={() => removeMention(mentionedUser)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="writeMessage" style={{ position: 'relative' }}>
                                    <textarea 
                                        ref={textareaRef}
                                        name="" 
                                        id="" 
                                        placeholder='Comencemos... (Usa @ para mencionar usuarios)' 
                                        onChange={handleTextChange}
                                        value={form.message}
                                        onSelect={(e) => setCursorPosition(e.target.selectionStart)}
                                        onClick={(e) => setCursorPosition(e.target.selectionStart)}
                                        onKeyUp={(e) => setCursorPosition(e.target.selectionStart)}
                                    ></textarea>
                                    
                                    {/* 📋 LISTA DE MENCIONES DISPONIBLES */}
                                    {showMentionsList && (
                                        <div className="mentionsDropdown" style={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: '0',
                                            right: '0',
                                            backgroundColor: 'white',
                                            border: '1px solid #ddd',
                                            borderRadius: '6px',
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                            zIndex: 1000,
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                        }}>
                                            {getFilteredUsers().length > 0 ? (
                                                getFilteredUsers().map((availableUser) => (
                                                    <div
                                                        key={availableUser.id}
                                                        className="mentionOption"
                                                        style={{
                                                            padding: '10px 12px',
                                                            cursor: 'pointer',
                                                            borderBottom: '1px solid #f0f0f0',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px'
                                                        }}
                                                        onClick={() => selectMentionUser(availableUser)}
                                                        onMouseEnter={(e) => {
                                                            e.target.style.backgroundColor = '#f8f9fa';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.backgroundColor = 'white';
                                                        }}
                                                    >
                                                        <div style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#007bff',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: 'white',
                                                            fontSize: '12px',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {availableUser.nombre.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: '500', fontSize: '14px' }}>
                                                                {availableUser.nombre}
                                                            </div>
                                                            <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                                                {availableUser.rango}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{
                                                    padding: '12px',
                                                    textAlign: 'center',
                                                    color: '#6c757d',
                                                    fontSize: '14px'
                                                }}>
                                                    No se encontraron usuarios
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div><br />

                                <button onClick={() => {
                                    handleMessage()
                                }} disabled={loading}>
                                    <span>{loading ? 'Enviando...' : 'Enviar'}</span>
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