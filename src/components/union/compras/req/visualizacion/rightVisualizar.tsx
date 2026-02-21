import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ProyectosRequisicion from './proyectos/proyectos';
import KitsRequisicion from './kits/kits';
import NecesidadRequisicion from './necesidad/necesidad';
import OrdenCompra from './ordenCompra';
import IndexOrden from './openOrden/indexOrden';

export default function RightVisualizar() {
    const [params] = useSearchParams();
    const activeView = params.get('view') || 'proyectos';

    const renderContent = () => {
        switch (activeView) {
            case 'proyectos':
                return <ProyectosRequisicion />;
            case 'kits':
                return <KitsRequisicion />;
            case 'necesidad':
                return <NecesidadRequisicion />;
            case 'ordenes':
                return params.get('openOrden') ? <IndexOrden /> : <OrdenCompra />
            default:
                return <ProyectosRequisicion />;
        }
    };

    return (
        <div className="rightVisualizar">
            {renderContent()}
        </div>
    )
}