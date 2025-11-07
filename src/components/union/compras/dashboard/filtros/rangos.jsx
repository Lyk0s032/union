import React, { useState, useEffect } from 'react';

// Aceptar props 'onChange' y 'currentRange' para leer/escribir el estado del padre
export default function RangosFilterTime({ close, onChange, currentRange }){
    // Estado local para los inputs, inicializado con el valor del padre
    const [start, setStart] = useState(currentRange?.startDate || '');
    const [end, setEnd] = useState(currentRange?.endDate || '');

    // Efecto para notificar al padre cuando cambian las fechas locales
    useEffect(() => {
        // Llama a la función del padre con los nuevos valores
        if (onChange) {
            onChange({ startDate: start, endDate: end });
        }
    // Agregamos 'start' y 'end' como dependencias. No necesitamos 'onChange' 
    // ni 'currentRange' porque solo usamos 'onChange' una vez en el if.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start, end]); 


    return (
        <div className="filterRangosTime">
            <h3>
                Filtrar por tiempo
            </h3>
            <span onClick={() => close()}>haz clic aquí para cerra el filtro de tiempo</span><br /><br />
            <div className="containerFilterRangos">
                <div className="inputDiv">
                    <label htmlFor="">Desde</label><br />
                    <input 
                        type="date" 
                        value={start}
                        onChange={(e) => setStart(e.target.value)} // Captura el valor
                    />
                </div>
                <div className="inputDiv">
                    <label htmlFor="">Hasta</label><br />
                    <input 
                        type="date" 
                        value={end}
                        onChange={(e) => setEnd(e.target.value)} // Captura el valor
                    />
                </div>
            </div>
        </div>
    )
}