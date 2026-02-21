import React, { useRef } from 'react';
import { 
    MdOutlineSpaceDashboard, 
    MdOutlineNewspaper, 
    MdOutlineEdgesensorHigh,
    MdOutlineShoppingCart,
    MdOutlineFolderDelete
} from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

export default function LeftNavVisualizacion() {
    const [params, setParams] = useSearchParams();
    const activeView = params.get('view') || 'proyectos';

    const handleViewChange = (view: string) => {
        params.set('view', view);
        setParams(params);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLLIElement>, tooltip: HTMLDivElement | null) => {
        if (!tooltip) return;
        const rect = e.currentTarget.getBoundingClientRect();
        tooltip.style.left = `${rect.right + 10}px`;
        tooltip.style.top = `${rect.top + rect.height / 2}px`;
        tooltip.style.transform = 'translateY(-50%)';
        tooltip.style.opacity = '1';
    };

    const handleMouseLeave = (tooltip: HTMLDivElement | null) => {
        if (!tooltip) return;
        tooltip.style.opacity = '0';
    };

    const tooltip1Ref = useRef<HTMLDivElement>(null);
    const tooltip2Ref = useRef<HTMLDivElement>(null);
    const tooltip3Ref = useRef<HTMLDivElement>(null);
    const tooltip4Ref = useRef<HTMLDivElement>(null);

    return (
        <div className="leftNavVisualizacion">
            <nav>
                <ul>
                    <li 
                        className={activeView === 'proyectos' ? 'active' : ''}
                        onClick={() => handleViewChange('proyectos')}
                        onMouseEnter={(e) => handleMouseEnter(e, tooltip1Ref.current)}
                        onMouseLeave={() => handleMouseLeave(tooltip1Ref.current)}
                    >
                        <div>
                            <MdOutlineSpaceDashboard className="icon" />
                            <span className="spanTooltip">Proyectos</span>
                        </div>
                        <div className="tooltip" ref={tooltip1Ref}>
                            <span>Presiona Ctrl + P</span>
                        </div>
                    </li>
                    <li 
                        className={activeView === 'kits' ? 'active' : ''}
                        onClick={() => handleViewChange('kits')}
                        onMouseEnter={(e) => handleMouseEnter(e, tooltip2Ref.current)}
                        onMouseLeave={() => handleMouseLeave(tooltip2Ref.current)}
                    >
                        <div>
                            <MdOutlineNewspaper className="icon" />
                            <span className="spanTooltip">Kit's</span>
                        </div>
                        <div className="tooltip" ref={tooltip2Ref}>
                            <span>Presiona Ctrl + K</span>
                        </div>
                    </li>
                    <li 
                        className={activeView === 'necesidad' ? 'active' : ''}
                        onClick={() => handleViewChange('necesidad')}
                        onMouseEnter={(e) => handleMouseEnter(e, tooltip3Ref.current)}
                        onMouseLeave={() => handleMouseLeave(tooltip3Ref.current)}>
                        <div>
                            <MdOutlineEdgesensorHigh className="icon" />
                            <span className="spanTooltip">Necesidad</span>
                        </div>
                        <div className="tooltip" ref={tooltip3Ref}>
                            <span>Presiona Ctrl + I</span>
                        </div>
                    </li>
                    <li 
                        className={activeView === 'ordenes' ? 'active' : ''}
                        onClick={() => handleViewChange('ordenes')}
                        onMouseEnter={(e) => handleMouseEnter(e, tooltip4Ref.current)}
                        onMouseLeave={() => handleMouseLeave(tooltip4Ref.current)}
                    >
                        <div>
                            <MdOutlineShoppingCart className="icon" />
                            <span className="spanTooltip">Órdenes de compra</span>
                        </div>
                        <div className="tooltip" ref={tooltip4Ref}>
                            <span>Presiona Ctrl + J</span>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
    )
}