import React, { useEffect, useRef } from 'react'
import { MdOutlineLightMode } from 'react-icons/md'

interface TopReqProps {
    searchText: string;
    setSearchText: (text: string) => void;
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
    filterCounts: {
        todas: number;
        'sin-comprar': number;
        'parcialmente': number;
        'finalizadas': number;
    };
}

export default function TopReq({ searchText, setSearchText, activeFilter, setActiveFilter, filterCounts }: TopReqProps) {
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isF = event.code === 'KeyF';
            const isControl = event.ctrlKey || event.metaKey;
    
            if (!isControl || !isF) return;
    
            // BLOQUEO TOTAL SIEMPRE
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
    
            const isModalOpen = !!document.querySelector('.modal');
            if (isModalOpen) return;
    
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
    
            searchInputRef.current?.focus();
            setTimeout(() => {
                searchInputRef.current?.select();
            }, 10);
    
            return false;
        };
    
        window.addEventListener('keydown', handleKeyDown, { capture: true });
        return () =>
            window.removeEventListener('keydown', handleKeyDown, { capture: true });
    }, []);
    

    return (
        <div>
            <div className="topData">
                <div className="leftTitle">
                    <div className="dataTitle">
                        <h1>Requisiciones</h1>
                    </div>
                    <div className="progressFilter">
                        <div className="lineFilter">
                            <div className="buttonsFilter">
                                <button 
                                    onClick={() => setActiveFilter('todas')}
                                    className={activeFilter === 'todas' ? 'active' : ''}
                                >
                                    <MdOutlineLightMode className='icon' />
                                    <span>Todas ({filterCounts.todas})</span>
                                </button>
                                <button 
                                    onClick={() => setActiveFilter('sin-comprar')}
                                    className={activeFilter === 'sin-comprar' ? 'active' : ''}
                                >
                                    <MdOutlineLightMode className='icon' />
                                    <span>Sin comprar ({filterCounts['sin-comprar']})</span>
                                </button>
                                <button 
                                    onClick={() => setActiveFilter('parcialmente')}
                                    className={activeFilter === 'parcialmente' ? 'active' : ''}
                                >
                                    <MdOutlineLightMode className='icon' />
                                    <span>Parcialmente ({filterCounts.parcialmente})</span>
                                </button>
                                <button 
                                    onClick={() => setActiveFilter('finalizadas')}
                                    className={activeFilter === 'finalizadas' ? 'active' : ''}
                                >
                                    <MdOutlineLightMode className='icon' />
                                    <span>Finalizadas ({filterCounts.finalizadas})</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rightTitle">
                    <input 
                        ref={searchInputRef}
                        type="text" 
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder='Buscar requisición. Presiona Ctrl + F para buscar' 
                    />
                </div>
            </div>
        </div>
    )
}