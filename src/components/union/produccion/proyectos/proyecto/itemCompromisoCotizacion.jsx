import React from 'react';
import { formatCompromisoNecesidadDisplay } from './compromisoMateriaUtils';

export default function ItemCompromisoCotizacion({ item }) {
    const { main, hint } = formatCompromisoNecesidadDisplay(item);

    return (
        <tr>
            <td className="longer">
                <div className="nameLonger">
                    <div className="letter">
                        <h3>{item.materium ? item.materiaId : null} {item?.productoId}</h3>
                    </div>
                    <div className="name">
                        <h3>{item.materium?.description} {item?.producto?.item}</h3>
                        <span>{item.materium ? 'Materia prima' : 'Producto terminado'}</span> <br />
                    </div>
                </div>
            </td>
            <td></td>
            <td>
                <div className="">
                    <span style={{ color: 'green' }}>{main}</span>
                    {hint ? (
                        <>
                            <br />
                            <span style={{ fontSize: 11, color: '#666' }}>{hint}</span>
                        </>
                    ) : null}
                </div>
            </td>
        </tr>
    );
}
