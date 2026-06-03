import React, { useState, useEffect } from 'react';
import { MdClose, MdSearch } from 'react-icons/md';
import axios from 'axios';
import './searchKitToCopy.css';

export default function SearchKitToCopy({ isOpen, onClose, onSelectKit, currentKitId }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [kits, setKits] = useState([]);
    const [loading, setLoading] = useState(false);

    // Búsqueda en tiempo real con debounce
    useEffect(() => {
        // Si no hay término de búsqueda, limpiamos los resultados
        if (!searchTerm.trim()) {
            setKits([]);
            return;
        }

        // Debounce: esperar 500ms después de que el usuario deje de escribir
        const timeoutId = setTimeout(async () => {
            setLoading(true);
            
            try {
                const response = await axios.get(`/api/kit/get/s/search/`, {
                    params: { query: searchTerm }
                });
                
                if (response.status === 200 && response.data) {
                    // Filtrar el kit actual para que no se pueda copiar a sí mismo
                    const filteredKits = response.data.filter(kit => kit.id !== currentKitId);
                    setKits(filteredKits);
                } else {
                    setKits([]);
                }
            } catch (error) {
                console.error('Error buscando kits:', error);
                setKits([]);
            } finally {
                setLoading(false);
            }
        }, 500);

        // Cleanup: cancelar el timeout si el usuario sigue escribiendo
        return () => clearTimeout(timeoutId);
    }, [searchTerm, currentKitId]);

    const handleSelectKit = (kit) => {
        onSelectKit(kit);
        handleClose();
    };

    const handleClose = () => {
        setSearchTerm('');
        setKits([]);
        setSearched(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay-copy" onClick={handleClose}>
            <div className="modal-content-copy" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-copy">
                    <h2>Buscar KIT de Referencia</h2>
                    <button className="close-button-copy" onClick={handleClose}>
                        <MdClose />
                    </button>
                </div>
                
                <div className="modal-body-copy">
                    <p className="modal-description">
                        Busca un KIT existente para copiar su receta (cantidades de materia prima).
                    </p>
                    
                    <div className="search-container-copy">
                        <div className="search-input-wrapper">
                            <MdSearch className="search-icon-input" />
                            <input
                                type="text"
                                placeholder="Escribe el nombre o ID del KIT..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                                className="search-input-copy"
                            />
                        </div>
                    </div>

                    {loading && (
                        <div className="loading-container-copy">
                            <div className="spinner-copy"></div>
                            <p>Buscando KITs...</p>
                        </div>
                    )}

                    {!loading && searchTerm.trim() && (
                        <div className="results-container-copy">
                            {kits.length === 0 ? (
                                <div className="no-results-copy">
                                    <p>No se encontraron KITs con ese criterio de búsqueda.</p>
                                </div>
                            ) : (
                                <div className="kits-list-copy">
                                    <h3>Resultados ({kits.length})</h3>
                                    {kits.map((kit) => (
                                        <div 
                                            key={kit.id} 
                                            className="kit-item-copy"
                                            onClick={() => handleSelectKit(kit)}
                                        >
                                            <div className="kit-item-info">
                                                <h4>#{kit.id} - {kit.name}</h4>
                                                {kit.description && (
                                                    <p className="kit-description-copy">{kit.description}</p>
                                                )}
                                            </div>
                                            <button className="select-button-copy">
                                                Seleccionar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
