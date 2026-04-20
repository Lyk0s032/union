// Ejemplo de cómo integrar la nueva versión de Solicitudes

import React from 'react';
import SolicitudesMain from './lastVersion/SolicitudesMain';

// Opción 1: Uso directo (recomendado)
export default function SolicitudesPage() {
    return <SolicitudesMain />;
}

// Opción 2: Con wrapper adicional si necesitas lógica extra
export function SolicitudesPageWithWrapper() {
    return (
        <div className="page-container">
            <SolicitudesMain />
        </div>
    );
}

// Opción 3: Toggle entre versiones para testing
import SolicitudesOld from './solicitudes';

export function SolicitudesToggle() {
    const [useNewVersion, setUseNewVersion] = React.useState(true);

    return (
        <div>
            <button onClick={() => setUseNewVersion(!useNewVersion)}>
                Cambiar a versión {useNewVersion ? 'antigua' : 'nueva'}
            </button>
            {useNewVersion ? <SolicitudesMain /> : <SolicitudesOld />}
        </div>
    );
}
