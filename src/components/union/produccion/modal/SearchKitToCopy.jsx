import React, { useState, useEffect } from 'react';
import { MdClose, MdSearch } from 'react-icons/md';
import axios from 'axios';
import './searchKitToCopy.css';

const stateLabel = (state) => {
    if (state === 'completa') return 'Completa';
    if (state === 'desarrollo') return 'Desarrollo';
    return state || '';
};

/** Normaliza lo que el usuario escribe antes de enviarlo al API (ID numérico, #3722, id 3722). */
const normalizeSearchForApi = (term) => {
    const trimmed = term.trim().replace(/\s+/g, ' ');
    const hashMatch = trimmed.match(/^#\s*(\d+)$/);
    if (hashMatch) return hashMatch[1];
    const labeledMatch = trimmed.match(/^(?:id|kit)\s*[#:]?\s*(\d+)$/i);
    if (labeledMatch) return labeledMatch[1];
    return trimmed;
};

export default function SearchKitToCopy({ isOpen, onClose, onSelectKit, currentKitId }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [kits, setKits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchError, setSearchError] = useState(false);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setKits([]);
            setSearchError(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setLoading(true);
            setSearchError(false);

            try {
                const response = await axios.get('/api/kit/get/search/copy-recipe', {
                    params: {
                        query: normalizeSearchForApi(searchTerm),
                        excludeKitId: currentKitId ?? undefined,
                    },
                });

                if (response.status === 200 && Array.isArray(response.data)) {
                    setKits(response.data);
                } else {
                    setKits([]);
                }
            } catch (error) {
                console.error('Error buscando kits:', error);
                setKits([]);
                setSearchError(true);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, currentKitId]);

    const handleSelectKit = (kit) => {
        onSelectKit(kit);
        handleClose();
    };

    const handleClose = () => {
        setSearchTerm('');
        setKits([]);
        setSearchError(false);
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
                        Busca por ID (3722, #3722) o por palabras del nombre. Solo kits completos o en desarrollo con receta.
                    </p>

                    <div className="search-container-copy">
                        <div className="search-input-wrapper">
                            <MdSearch className="search-icon-input" />
                            <input
                                type="text"
                                placeholder="3722, #3722 o nombre del KIT..."
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
                            {searchError ? (
                                <div className="no-results-copy">
                                    <p>No pudimos consultar los KITs. Intenta de nuevo en un momento.</p>
                                </div>
                            ) : kits.length === 0 ? (
                                <div className="no-results-copy">
                                    <p>No se encontraron KITs con receta para ese criterio.</p>
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
                                                <p className="kit-meta-copy">
                                                    {stateLabel(kit.state)}
                                                    {kit.extension?.name ? ` · ${kit.extension.name}` : ''}
                                                    {kit.linea?.name ? ` · ${kit.linea.name}` : ''}
                                                </p>
                                                {kit.description && (
                                                    <p className="kit-description-copy">{kit.description}</p>
                                                )}
                                            </div>
                                            <button type="button" className="select-button-copy">
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
