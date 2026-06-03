import React, { useState } from 'react';
import { MdClose, MdCheckCircle, MdContentCopy } from 'react-icons/md';
import './confirmCopyRecipe.css';

export default function ConfirmCopyRecipe({ 
    isOpen, 
    onClose, 
    onConfirm, 
    sourceKit, 
    targetKit,
    loading 
}) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay-confirm" onClick={loading ? undefined : onClose}>
            <div className="modal-content-confirm" onClick={(e) => e.stopPropagation()}>
                {!loading ? (
                    <>
                        <div className="modal-header-confirm">
                            <h2>Confirmar Clonación de Receta</h2>
                            <button 
                                className="close-button-confirm" 
                                onClick={onClose}
                                disabled={loading}
                            >
                                <MdClose />
                            </button>
                        </div>
                        
                        <div className="modal-body-confirm">
                            <div className="warning-box">
                                <MdContentCopy className="warning-icon" />
                                <p>
                                    Esta acción <strong>reemplazará toda la receta actual</strong> del KIT con la receta del KIT seleccionado.
                                </p>
                            </div>

                            <div className="kits-comparison">
                                <div className="kit-box source-kit">
                                    <h3>KIT de Referencia (Copiar desde)</h3>
                                    <div className="kit-details">
                                        <p className="kit-id">ID: #{sourceKit?.id}</p>
                                        <p className="kit-name">{sourceKit?.name}</p>
                                    </div>
                                </div>

                                <div className="arrow-container">
                                    <div className="arrow-icon">→</div>
                                </div>

                                <div className="kit-box target-kit">
                                    <h3>KIT Actual (Copiar hacia)</h3>
                                    <div className="kit-details">
                                        <p className="kit-id">ID: #{targetKit?.id}</p>
                                        <p className="kit-name">{targetKit?.name}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="info-box">
                                <ul>
                                    <li>Se copiarán todas las materias primas y sus cantidades</li>
                                    <li>Se copiarán los segmentos (áreas) del KIT de referencia</li>
                                    <li>El contenido actual será reemplazado completamente</li>
                                    <li>Esta acción no se puede deshacer</li>
                                </ul>
                            </div>
                        </div>

                        <div className="modal-footer-confirm">
                            <button 
                                className="cancel-button-confirm" 
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="confirm-button-confirm" 
                                onClick={onConfirm}
                                disabled={loading}
                            >
                                <MdCheckCircle /> Confirmar Clonación
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="loading-state-confirm">
                        <div className="data-transfer-animation">
                            <div className="source-box">
                                <div className="box-content">
                                    <MdContentCopy />
                                    <p>#{sourceKit?.id}</p>
                                </div>
                            </div>
                            
                            <div className="transfer-line">
                                <div className="data-packets">
                                    <div className="packet"></div>
                                    <div className="packet"></div>
                                    <div className="packet"></div>
                                </div>
                            </div>
                            
                            <div className="target-box">
                                <div className="box-content">
                                    <MdContentCopy />
                                    <p>#{targetKit?.id}</p>
                                </div>
                            </div>
                        </div>
                        
                        <h3 className="loading-title">Clonando receta...</h3>
                        <p className="loading-subtitle">
                            Copiando materias primas y segmentos del KIT #{sourceKit?.id} al KIT #{targetKit?.id}
                        </p>
                        
                        <div className="copy-progress-bar">
                            <div className="copy-progress-fill"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
