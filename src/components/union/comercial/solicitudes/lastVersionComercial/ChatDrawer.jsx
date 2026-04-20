import React, { useState, useRef, useEffect } from "react";
import { 
    MdClose, 
    MdSend, 
    MdAttachFile,
    MdImage,
    MdInsertDriveFile,
    MdDelete,
    MdDownload,
    MdNavigateBefore,
    MdNavigateNext
} from "react-icons/md";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

export default function ChatDrawer({ isOpen, onClose, requerimiento, onSendMessage }) {
    const [message, setMessage] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [allChatImages, setAllChatImages] = useState([]);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            
            // Recolectar todas las imágenes del chat
            const images = [];
            if (requerimiento?.adjuntRequireds) {
                requerimiento.adjuntRequireds.forEach((msg, msgIndex) => {
                    const messageAttachments = msg.adjunts || msg.attachments || [];
                    messageAttachments.forEach((attachment, idx) => {
                        const attachmentUrl = attachment.adjunt || attachment.url;
                        const attachmentName = attachment.name || `Archivo ${idx + 1}`;
                        const isImage = attachmentUrl && (
                            attachmentUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ||
                            attachment.type?.startsWith('image/')
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

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        addFiles(files);
    };

    const addFiles = (files) => {
        const newAttachments = files.map(file => ({
            file,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
            name: file.name,
            size: file.size,
            type: file.type
        }));
        setAttachments(prev => [...prev, ...newAttachments]);
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

    const handleSend = () => {
        if (message.trim() || attachments.length > 0) {
            onSendMessage({
                message: message.trim(),
                attachments: attachments.map(a => a.file)
            });
            setMessage("");
            setAttachments([]);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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

    const getFileIcon = (type) => {
        if (type.startsWith('image/')) return <MdImage />;
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
                                const messageText = msg.mesagge || msg.message;
                                const messageAttachments = msg.adjunts || msg.attachments || [];
                                
                                return (
                                    <div key={index} className={`chat-message ${msg.user?.id === requerimiento.user?.id ? 'sent' : 'received'}`}>
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
                                            
                                            {messageText && (
                                                <div className="message-text">
                                                    {messageText}
                                                </div>
                                            )}

                                            {messageAttachments && messageAttachments.length > 0 && (
                                                <div className="message-attachments">
                                                    {messageAttachments.map((attachment, idx) => {
                                                        const attachmentUrl = attachment.adjunt || attachment.url;
                                                        const attachmentName = attachment.name || `Archivo ${idx + 1}`;
                                                        const isImage = attachmentUrl && (
                                                            attachmentUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ||
                                                            attachment.type?.startsWith('image/')
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
                                                                    <div className="attachment-file">
                                                                        <div className="file-icon">
                                                                            {getFileIcon(attachment.type || '')}
                                                                        </div>
                                                                        <div className="file-info">
                                                                            <span className="file-name">{attachmentName}</span>
                                                                            {attachment.size && (
                                                                                <span className="file-size">{formatFileSize(attachment.size)}</span>
                                                                            )}
                                                                        </div>
                                                                        <a 
                                                                            href={attachmentUrl} 
                                                                            download 
                                                                            className="file-download"
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            <MdDownload />
                                                                        </a>
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
                                                    {getFileIcon(attachment.type)}
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

                        <div className="chat-input-container">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                multiple
                                style={{ display: 'none' }}
                            />
                            <button 
                                className="attach-button"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <MdAttachFile />
                            </button>
                            
                            <input
                                type="text"
                                className="chat-input"
                                placeholder="Escribe un mensaje..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                            />
                            
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
