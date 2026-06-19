import React, { useState, useRef, useEffect } from "react";
import { 
    MdClose, 
    MdSend, 
    MdAttachFile,
    MdImage,
    MdInsertDriveFile,
    MdDelete,
    MdDownload,
    MdPerson,
    MdNavigateBefore,
    MdNavigateNext,
    MdPictureAsPdf,
    MdDescription,
    MdTableChart
} from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { useSelector } from 'react-redux';
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const getAuthHeader = () => {
    try {
        const token = JSON.parse(localStorage.getItem('loggedPeople'));
        return token ? { authorization: `Bearer ${token}` } : {};
    } catch {
        return {};
    }
};

const getUserDisplayName = (user) => {
    const fullName = [user?.name, user?.lastName].filter(Boolean).join(' ').trim();
    return fullName || user?.nombre || 'Usuario';
};

const getUserFirstName = (user) => {
    const fullName = user?.name || user?.nombre || 'Usuario';
    return fullName.split(' ')[0];
};

const MENTION_TRIGGER_REGEX = /@([^\s@]*)$/;

export default function ChatDrawer({ isOpen, onClose, requerimiento, onSendMessage }) {
    const usuario = useSelector(store => store.usuario);
    const currentUser = usuario?.user;
    
    
    const [message, setMessage] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [allChatImages, setAllChatImages] = useState([]);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    // 🎯 SISTEMA DE MENCIONES (@) - Estados
    const [mentionedUsers, setMentionedUsers] = useState([]); // Array de usuarios mencionados
    const [allMentionableUsers, setAllMentionableUsers] = useState([]); // Usuarios cargados del API
    const [availableUsers, setAvailableUsers] = useState([]); // Lista filtrada para mostrar
    const [showMentionsList, setShowMentionsList] = useState(false);
    const [mentionSearchQuery, setMentionSearchQuery] = useState('');
    const [cursorPosition, setCursorPosition] = useState(0);
    const inputRef = useRef(null);
    const mentionsContainerRef = useRef(null);

    const getOwnerId = () =>  3;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            console.log('=== REQUERIMIENTO DATA ===');
            console.log('Requerimiento completo:', requerimiento);
            console.log('adjuntRequireds:', requerimiento?.adjuntRequireds);
            if (requerimiento?.adjuntRequireds && requerimiento.adjuntRequireds.length > 0) {
                console.log('Primer mensaje:', requerimiento.adjuntRequireds[0]);
            }
            
            // Recolectar todas las imágenes del chat
            const images = [];
            if (requerimiento?.adjuntRequireds) {
                requerimiento.adjuntRequireds.forEach((msg, msgIndex) => {
                    const messageAttachments = msg.adjunts || msg.attachments || [];
                    messageAttachments.forEach((attachment, idx) => {
                        const attachmentUrl = attachment.adjunt || attachment.url;
                        const attachmentName = attachment.name || `Archivo ${idx + 1}`;
                        const isImage = attachmentUrl && (
                            attachmentUrl.match(/\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i) ||
                            attachment.type?.startsWith('image/') ||
                            attachmentName.match(/\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i)
                        );
                        if (isImage) {
                            images.push({
                                url: attachmentUrl,
                                name: attachmentName,
                                messageIndex: msgIndex,
                                attachmentIndex: idx
                            });
                        }
                    });
                });
            }
            setAllChatImages(images);
        }
    }, [isOpen, requerimiento?.adjuntRequireds]);

    // Efecto para manejar navegación con teclado
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!imageModalOpen) return;
            
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                navigatePrevious();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                navigateNext();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closeImageModal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [imageModalOpen, currentImageIndex, allChatImages]);

    const filterMentionableUsers = (users) => {
        const ownerId = getOwnerId();
        return users.filter(u => {
            if (u.rango === 'admin') return true;
            if (ownerId && u.id === ownerId) return true;
            return false;
        });
    };

    const searchMentionableUsers = (users, searchQuery = '') => {
        if (!searchQuery.trim()) return users;

        const query = searchQuery.toLowerCase();
        return users.filter(user =>
            getUserDisplayName(user).toLowerCase().includes(query)
        );
    };

    const loadMentionableUsers = async () => {
        try {
            const response = await axios.get('/api/users/getAll', { headers: getAuthHeader() });
            return filterMentionableUsers(response.data || []);
        } catch (error) {
            console.error('Error al cargar usuarios para menciones:', error);
            return [];
        }
    };

    // 🔍 OBTENER USUARIOS DISPONIBLES PARA MENCIONAR
    useEffect(() => {
        const loadInitialUsers = async () => {
            if (isOpen && requerimiento) {
                const users = await loadMentionableUsers();
                setAllMentionableUsers(users);
                setAvailableUsers(users);
            }
        };

        loadInitialUsers();
    }, [isOpen, requerimiento?.userId, requerimiento?.user?.id]);

    useEffect(() => {
        if (showMentionsList) {
            setAvailableUsers(searchMentionableUsers(allMentionableUsers, mentionSearchQuery));
        }
    }, [allMentionableUsers]);

    // 🖱️ CERRAR LISTA DE MENCIONES AL HACER CLIC FUERA
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mentionsContainerRef.current && !mentionsContainerRef.current.contains(event.target)) {
                setShowMentionsList(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        addFiles(files);
    };

    const addFiles = (files) => {
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB en bytes
        
        const validFiles = [];
        const rejectedFiles = [];
        
        files.forEach(file => {
            if (file.size > MAX_FILE_SIZE) {
                rejectedFiles.push(file.name);
            } else {
                validFiles.push({
                    file,
                    preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
                    name: file.name,
                    size: file.size,
                    type: file.type
                });
            }
        });
        
        // Mostrar alerta si hay archivos rechazados
        if (rejectedFiles.length > 0) {
            alert(`❌ Los siguientes archivos superan el límite de 10MB y no se pueden adjuntar:\n\n${rejectedFiles.join('\n')}`);
        }
        
        // Agregar solo archivos válidos
        if (validFiles.length > 0) {
            setAttachments(prev => [...prev, ...validFiles]);
        }
    };

    const removeAttachment = (index) => {
        setAttachments(prev => {
            const updated = [...prev];
            if (updated[index].preview) {
                URL.revokeObjectURL(updated[index].preview);
            }
            updated.splice(index, 1);
            return updated;
        });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        addFiles(files);
    };

    // 🏷️ MANEJAR CAMBIOS EN EL INPUT CON MENCIONES
    const handleMessageChange = (e) => {
        const value = e.target.value;
        const cursorPos = e.target.selectionStart;

        setMessage(value);
        setCursorPosition(cursorPos);

        // Auto-ajustar altura del textarea
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
        }

        const textBeforeCursor = value.substring(0, cursorPos);
        const mentionMatch = textBeforeCursor.match(MENTION_TRIGGER_REGEX);

        if (mentionMatch) {
            const searchQuery = mentionMatch[1];
            setMentionSearchQuery(searchQuery);
            setShowMentionsList(true);
            setAvailableUsers(searchMentionableUsers(allMentionableUsers, searchQuery));
        } else {
            setShowMentionsList(false);
            setMentionSearchQuery('');
        }
    };

    // ✅ SELECCIONAR USUARIO PARA MENCIONAR
    const selectMentionUser = (selectedUser) => {
        const input = inputRef.current;
        const textBeforeCursor = message.substring(0, cursorPosition);
        const textAfterCursor = message.substring(cursorPosition);
        
        // 🎯 Usar solo el primer nombre (sin espacios)
        const firstName = getUserFirstName(selectedUser);

        const mentionMatch = textBeforeCursor.match(MENTION_TRIGGER_REGEX);
        if (mentionMatch) {
            const beforeMention = textBeforeCursor.substring(0, mentionMatch.index);
            const newMessage = `${beforeMention}@${firstName} ${textAfterCursor}`;
            
            setMessage(newMessage);
            
            // Agregar usuario a la lista de mencionados si no está ya
            if (!mentionedUsers.find(u => u.id === selectedUser.id)) {
                setMentionedUsers(prev => [...prev, {
                    ...selectedUser,
                    displayName: firstName // Guardar solo el primer nombre
                }]);
            }
        }
        
        setShowMentionsList(false);
        setMentionSearchQuery('');
        
        // Enfocar input nuevamente y posicionar cursor
        setTimeout(() => {
            input.focus();
            const newCursorPosition = beforeMention.length + firstName.length + 2; // +2 por "@" y " "
            input.setSelectionRange(newCursorPosition, newCursorPosition);
            setCursorPosition(newCursorPosition);
        }, 10);
    };

    // ❌ ELIMINAR MENCIÓN
    const removeMention = (userToRemove) => {
        // Remover de la lista de mencionados
        setMentionedUsers(prev => prev.filter(u => u.id !== userToRemove.id));
        
        // Obtener el primer nombre para eliminar del texto
        const firstName = userToRemove.displayName || getUserFirstName(userToRemove);
        
        // Remover del texto del mensaje
        const mentionPattern = new RegExp(`@${firstName}\\s?`, 'g');
        const newMessage = message.replace(mentionPattern, '');
        
        setMessage(newMessage);
    };


    const handleSend = () => {
        // Permitir envío si hay mensaje O si hay archivos adjuntos
        if (message.trim() || attachments.length > 0) {
            // 🎯 CREAR ARRAY DE USUARIOS A NOTIFICAR
            const usersToNotify = [];
            
            const ownerId = getOwnerId();
            if (ownerId) {
                usersToNotify.push(ownerId);
            }
            
            // Agregar usuarios mencionados (evitando duplicados)
            mentionedUsers.forEach(mentionedUser => {
                if (!usersToNotify.includes(mentionedUser.id)) {
                    usersToNotify.push(mentionedUser.id);
                    console.log('🏷️ Usuario mencionado agregado:', mentionedUser.id, mentionedUser.displayName);
                }
            });
            
            console.log('🔔 Array final de usuarios a notificar desde ChatDrawer:', usersToNotify);
            console.log('📝 Mensaje completo con menciones:', message);
            console.log('👥 Usuarios mencionados:', mentionedUsers);
            console.log('📎 Adjuntos:', attachments.length);
            
            onSendMessage({
                message: message.trim() || ' ', // Enviar espacio si no hay mensaje pero hay adjuntos
                attachments: attachments.map(a => a.file),
                userToNotify: usersToNotify // Array garantizado con el usuario del requerimiento
            });
            
            // Limpiar estado después de enviar
            setMessage("");
            setAttachments([]);
            setMentionedUsers([]);
            
            // Resetear altura del textarea
            if (inputRef.current) {
                inputRef.current.style.height = 'auto';
            }
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    // Resuelve el nombre final del archivo incluyendo extensión
    const resolveFileName = (name, url) => {
        if (name && name.includes('.')) return name;
        const match = url?.match(/\.([a-zA-Z0-9]+)(?:\?|#|$)/);
        if (match) return `${name || 'archivo'}.${match[1]}`;
        return name || 'archivo';
    };

    // Descarga a través del proxy del backend → sin problemas de CORS ni de browser
    const downloadFile = (url, fileName) => {
        if (!url) return;
        const finalName = resolveFileName(fileName, url);
        const apiBase = (axios.defaults.baseURL || '').replace(/\/$/, '');
        const proxyUrl = `${apiBase}/api/download?url=${encodeURIComponent(url)}&name=${encodeURIComponent(finalName)}`;
        const a = document.createElement('a');
        a.href = proxyUrl;
        a.download = finalName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const formatDate = (dateString) => {
        const date = dayjs(dateString);
        const now = dayjs();
        const diffDays = now.diff(date, 'day');

        if (diffDays === 0) {
            return date.format('HH:mm');
        } else if (diffDays === 1) {
            return 'Ayer ' + date.format('HH:mm');
        } else if (diffDays < 7) {
            return date.format('dddd HH:mm');
        } else {
            return date.format('DD/MM/YYYY HH:mm');
        }
    };

    // 🏷️ RENDERIZAR MENSAJE CON MENCIONES RESALTADAS
    const renderMessageWithMentions = (messageText) => {
        if (!messageText) return '';

        // Regex para encontrar menciones (@NombreUsuario)
        const mentionRegex = /@([^\s@]+)/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = mentionRegex.exec(messageText)) !== null) {
            // Agregar texto antes de la mención
            if (match.index > lastIndex) {
                parts.push(messageText.slice(lastIndex, match.index));
            }

            // Agregar la mención resaltada
            parts.push(
                <span
                    key={match.index}
                    style={{
                        backgroundColor: '#e3f2fd',
                        color: '#1565c0',
                        padding: '2px 6px',
                        borderRadius: '12px',
                        fontSize: '0.9em',
                        fontWeight: '500',
                        border: '1px solid #bbdefb'
                    }}
                >
                    @{match[1]}
                </span>
            );

            lastIndex = match.index + match[0].length;
        }

        // Agregar texto restante
        if (lastIndex < messageText.length) {
            parts.push(messageText.slice(lastIndex));
        }

        return parts.length > 1 ? parts : messageText;
    };

    // 🎨 CREAR UN PREVIEW DE TEXTO CON MENCIONES PARA MOSTRAR DEBAJO DEL TEXTAREA
    const renderInputPreview = () => {
        if (!message || !/@[^\s@]+/.test(message)) return null;
        
        return (
            <div style={{
                fontSize: '12px',
                color: '#6b7280',
                marginTop: '4px',
                padding: '4px 8px',
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
            }}>
                <strong>Vista previa:</strong> {renderMessageWithMentions(message)}
            </div>
        );
    };

    const getFileIcon = (type, fileName = '') => {
        if (type?.startsWith('image/')) return <MdImage />;
        
        // Detectar por tipo MIME
        if (type?.includes('pdf')) return <MdPictureAsPdf />;
        if (type?.includes('word') || type?.includes('document')) return <MdDescription />;
        if (type?.includes('excel') || type?.includes('spreadsheet')) return <MdTableChart />;
        
        // Detectar por extensión de archivo
        const lowerFileName = fileName.toLowerCase();
        if (lowerFileName.endsWith('.pdf')) return <MdPictureAsPdf />;
        if (lowerFileName.endsWith('.doc') || lowerFileName.endsWith('.docx')) return <MdDescription />;
        if (lowerFileName.endsWith('.xls') || lowerFileName.endsWith('.xlsx')) return <MdTableChart />;
        
        return <MdInsertDriveFile />;
    };

    const openImageModal = (imageUrl) => {
        const imageIndex = allChatImages.findIndex(img => img.url === imageUrl);
        if (imageIndex !== -1) {
            setCurrentImageIndex(imageIndex);
            setImageModalOpen(true);
        }
    };

    const closeImageModal = () => {
        setImageModalOpen(false);
    };

    const navigateNext = () => {
        if (currentImageIndex < allChatImages.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const navigatePrevious = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="chat-drawer-overlay" onClick={onClose} />
            <div className={`chat-drawer ${isOpen ? 'open' : ''}`}>
                <div className="chat-drawer-header">
                    <div className="chat-header-content">
                        <h3>Mensajes y Adjuntos</h3>
                        <p className="chat-subtitle">{requerimiento?.nombre}</p>
                    </div>
                    <button className="chat-close-button" onClick={onClose}>
                        <MdClose />
                    </button>
                </div>

                <div 
                    className={`chat-drawer-body ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {isDragging && (
                        <div className="drop-zone-overlay">
                            <MdAttachFile />
                            <p>Suelta los archivos aquí</p>
                        </div>
                    )}

                    {(!requerimiento?.adjuntRequireds || requerimiento.adjuntRequireds.length === 0) ? (
                        <div className="chat-empty-state">
                            <div className="empty-icon">💬</div>
                            <h4>No hay mensajes aún</h4>
                            <p>Inicia la conversación enviando un mensaje o adjuntando archivos</p>
                        </div>
                    ) : (
                        <div className="chat-messages">
                            {requerimiento.adjuntRequireds.map((msg, index) => {
                                console.log(`Mensaje ${index}:`, msg);
                                const messageText = msg.mesagge || msg.message;
                                const messageAttachments = msg.adjunts || msg.attachments || [];
                                console.log(`- Texto: "${messageText}"`);
                                console.log(`- Adjuntos:`, messageAttachments);
                                
                                const isSentByCurrentUser = msg.user?.id === currentUser?.user?.id;
                                
                                return (
                                    <div key={index} className={`chat-message ${isSentByCurrentUser ? 'sent' : 'received'}`}>
                                        <div className="message-avatar">
                                            <div className="avatar-circle">
                                                {msg.user?.name ? msg.user.name.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                        </div>
                                        <div className="message-content-wrapper">
                                            <div className="message-header">
                                                <span className="message-author">
                                                    {msg.user?.name} {msg.user?.lastName}
                                                </span>
                                                <span className="message-time">
                                                    {formatDate(msg.createdAt)}
                                                </span>
                                            </div>
                                            
                                            {messageText && messageText.trim() && (
                                                <div className="message-text">
                                                    {renderMessageWithMentions(messageText)}
                                                </div>
                                            )}

                                            {messageAttachments && messageAttachments.length > 0 && (
                                                <div className="message-attachments">
                                                    {messageAttachments.map((attachment, idx) => {
                                                        console.log(`  - Adjunto ${idx}:`, attachment);
                                                        const attachmentUrl = attachment.adjunt || attachment.url;
                                                        
                                                        // Obtener nombre del archivo
                                                        let attachmentName = attachment.name || `Archivo ${idx + 1}`;
                                                        
                                                        // Si no tiene extensión, intentar extraerla de la URL
                                                        if (!attachmentName.includes('.') && attachmentUrl) {
                                                            const urlMatch = attachmentUrl.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
                                                            if (urlMatch) {
                                                                attachmentName = `${attachmentName}.${urlMatch[1]}`;
                                                            }
                                                        }
                                                        
                                                        // Mejorar detección de imágenes
                                                        const isImage = attachmentUrl && (
                                                            attachmentUrl.match(/\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i) ||
                                                            attachment.type?.startsWith('image/') ||
                                                            attachmentName.match(/\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i)
                                                        );
                                                        
                                                        return (
                                                            <div key={idx} className="attachment-item">
                                                                {isImage ? (
                                                                    <div 
                                                                        className="attachment-image"
                                                                        onClick={() => openImageModal(attachmentUrl)}
                                                                        style={{ cursor: 'pointer' }}
                                                                    >
                                                                        <img src={attachmentUrl} alt={attachmentName} />
                                                                    </div>
                                                                ) : (
                                                                    <div 
                                                                        className="attachment-file"
                                                                        onClick={() => downloadFile(attachmentUrl, attachmentName)}
                                                                        style={{ cursor: 'pointer' }}
                                                                    >
                                                                        <div className="file-icon">
                                                                            {getFileIcon(attachment.type || '', attachmentName)}
                                                                        </div>
                                                                        <div className="file-info">
                                                                            <span className="file-name">{attachmentName}</span>
                                                                            {attachment.size && (
                                                                                <span className="file-size">{formatFileSize(attachment.size)}</span>
                                                                            )}
                                                                        </div>
                                                                        <button 
                                                                            className="file-download"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                downloadFile(attachmentUrl, attachmentName);
                                                                            }}
                                                                        >
                                                                            <MdDownload />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {requerimiento?.state !== 'finish' && requerimiento?.state !== 'cancel' && (
                    <div className="chat-drawer-footer">
                        {attachments.length > 0 && (
                            <div className="attachments-preview">
                                {attachments.map((attachment, index) => (
                                    <div key={index} className="preview-item">
                                        {attachment.preview ? (
                                            <div className="preview-image">
                                                <img src={attachment.preview} alt={attachment.name} />
                                            </div>
                                        ) : (
                                            <div className="preview-file">
                                                <div className="preview-file-icon">
                                                    {getFileIcon(attachment.type, attachment.name)}
                                                </div>
                                            </div>
                                        )}
                                        <div className="preview-info">
                                            <span className="preview-name">{attachment.name}</span>
                                            <span className="preview-size">{formatFileSize(attachment.size)}</span>
                                        </div>
                                        <button 
                                            className="preview-remove"
                                            onClick={() => removeAttachment(index)}
                                        >
                                            <MdDelete />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 🏷️ MOSTRAR USUARIOS MENCIONADOS */}
                        {mentionedUsers.length > 0 && (
                            <div className="mentioned-users-container" style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '8px',
                                marginBottom: '10px',
                                padding: '8px 12px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '8px',
                                border: '1px solid #e9ecef',
                                margin: '0 12px'
                            }}>
                                <span style={{ fontSize: '12px', color: '#6c757d', fontWeight: '500' }}>
                                    Menciones:
                                </span>
                                {mentionedUsers.map((mentionedUser) => {
                                    const displayName = mentionedUser.displayName || mentionedUser.name || mentionedUser.nombre || 'Usuario';
                                    return (
                                        <div
                                            key={mentionedUser.id}
                                            className="mention-tag"
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
                                                const closeBtn = e.currentTarget.querySelector('.close-mention');
                                                if (closeBtn) closeBtn.style.display = 'inline-flex';
                                            }}
                                            onMouseLeave={(e) => {
                                                const closeBtn = e.currentTarget.querySelector('.close-mention');
                                                if (closeBtn) closeBtn.style.display = 'none';
                                            }}
                                        >
                                            @{displayName}
                                            <IoCloseSharp
                                                className="close-mention"
                                                style={{
                                                    marginLeft: '6px',
                                                    cursor: 'pointer',
                                                    display: 'none',
                                                    fontSize: '14px'
                                                }}
                                                onClick={() => removeMention(mentionedUser)}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="chat-input-container" style={{ position: 'relative' }}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                multiple
                                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                                style={{ display: 'none' }}
                            />
                            <button 
                                className="attach-button"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <MdAttachFile />
                            </button>
                            
                            <div ref={mentionsContainerRef} style={{ flex: 1, position: 'relative' }}>
                                <textarea
                                    ref={inputRef}
                                    className="chat-input"
                                    placeholder="Escribe un mensaje... (Usa @ para mencionar usuarios) o adjunta archivos"
                                    value={message}
                                    onChange={handleMessageChange}
                                    onSelect={(e) => setCursorPosition(e.target.selectionStart)}
                                    onClick={(e) => setCursorPosition(e.target.selectionStart)}
                                    onKeyUp={(e) => setCursorPosition(e.target.selectionStart)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#3b82f6';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#d1d5db';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                    rows={1}
                                    style={{
                                        minHeight: '40px',
                                        maxHeight: '120px',
                                        resize: 'none',
                                        overflow: 'auto',
                                        fontFamily: 'inherit',
                                        fontSize: '14px',
                                        lineHeight: '1.4',
                                        padding: '10px 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        backgroundColor: '#ffffff',
                                        color: '#374151',
                                        outline: 'none',
                                        transition: 'border-color 0.2s, box-shadow 0.2s'
                                    }}
                                />
                                
                                {/* 🎨 VISTA PREVIA DEL MENSAJE CON MENCIONES */}
                                {renderInputPreview()}
                                
                                {/* 📋 LISTA DE MENCIONES DISPONIBLES */}
                                {showMentionsList && (
                                    <div className="mentions-dropdown" style={{
                                        position: 'absolute',
                                        bottom: '100%',
                                        left: '0',
                                        right: '0',
                                        backgroundColor: '#fff',
                                        border: '2px solid #007bff',
                                        borderRadius: '8px',
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        zIndex: 9999,
                                        boxShadow: '0 -4px 12px rgba(0,0,0,0.25)',
                                        marginBottom: '4px'
                                    }}>
                                        <div style={{
                                            padding: '8px 12px',
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            Mencionar usuario (@)
                                        </div>
                                        
                                        {availableUsers && availableUsers.length > 0 ? (
                                            availableUsers.map((availableUser) => {
                                                const firstName = getUserFirstName(availableUser);
                                                const fullName = getUserDisplayName(availableUser);
                                                return (
                                                    <div
                                                        key={availableUser.id}
                                                        className="mention-option"
                                                        style={{
                                                            padding: '10px 12px',
                                                            cursor: 'pointer',
                                                            borderBottom: '1px solid #f0f0f0',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            transition: 'background-color 0.2s',
                                                            backgroundColor: 'white'
                                                        }}
                                                        onClick={() => {
                                                            console.log('🖱️ Usuario seleccionado:', availableUser);
                                                            selectMentionUser(availableUser);
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'white';
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
                                                            {firstName.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: '500', fontSize: '14px' }}>
                                                                @{firstName}
                                                            </div>
                                                            <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '2px' }}>
                                                                {fullName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div style={{
                                                padding: '12px',
                                                textAlign: 'center',
                                                color: '#6c757d',
                                                fontSize: '14px'
                                            }}>
                                                {availableUsers === null ? 'Cargando usuarios...' : 'No se encontraron usuarios'}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            <button 
                                className={`send-button ${(message.trim() || attachments.length > 0) ? 'active' : ''}`}
                                onClick={handleSend}
                                disabled={!message.trim() && attachments.length === 0}
                            >
                                <MdSend />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {imageModalOpen && allChatImages.length > 0 && (
                <div className="image-modal-overlay" onClick={closeImageModal}>
                    <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="image-modal-close" onClick={closeImageModal}>
                            <MdClose />
                        </button>
                        
                        {allChatImages.length > 1 && (
                            <>
                                <button 
                                    className="image-modal-nav image-modal-prev" 
                                    onClick={navigatePrevious}
                                    disabled={currentImageIndex === 0}
                                >
                                    <MdNavigateBefore />
                                </button>
                                
                                <button 
                                    className="image-modal-nav image-modal-next" 
                                    onClick={navigateNext}
                                    disabled={currentImageIndex === allChatImages.length - 1}
                                >
                                    <MdNavigateNext />
                                </button>
                            </>
                        )}
                        
                        <div className="image-modal-image-container">
                            <img 
                                src={allChatImages[currentImageIndex].url} 
                                alt={allChatImages[currentImageIndex].name}
                                className="image-modal-image"
                            />
                        </div>
                        
                        <div className="image-modal-info">
                            <span className="image-modal-name">
                                {allChatImages[currentImageIndex].name}
                            </span>
                            {allChatImages.length > 1 && (
                                <span className="image-modal-counter">
                                    {currentImageIndex + 1} / {allChatImages.length}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
