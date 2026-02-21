import React from 'react';

interface ItemKitsProps {
    kit: {
        id: number;
        nombre: string;
        tipo: string;
        necesidad: number;
    };
}

export default function ItemKits({ kit }: ItemKitsProps) {
    return (
        <div className="itemKits">
            <div className="numeroItem">
                <h3>{kit.id}</h3>
            </div>
            <div className="infoItem">
                <h3 className="nombreItem">{kit.nombre}</h3>
                <span className="tipoItem">{kit.tipo}</span>
            </div>
            <div className="necesidadItem">
                <span>{kit.necesidad}</span>
            </div>
        </div>
    )
}