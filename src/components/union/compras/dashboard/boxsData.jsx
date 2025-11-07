import React from 'react';
import { MdDocumentScanner, MdEditDocument, MdOutlineAttachMoney, MdOutlineDocumentScanner } from 'react-icons/md';

export default function BoxDatas({ compras, resumen }){

    const preOrdenes = compras.filter((f) => !f.estadoPago);
    const ordenes = compras.filter((f) => f.estadoPago == 'compras');
    const comprado = compras.filter((f) => f.estadoPago == 'comprado');

    const valores = compras.filter((f) => f.daysFinish);

    const preOrdenesTotal = resumen.porEtapa.reduce((acc, curr) => {
        // 1. Preguntamos al elemento ACTUAL (curr) por su etapa.
        if (curr.etapa === 'preorden') {
            // 2. Si coincide, sumamos el campo 'total' del elemento actual (curr.total) 
            //    al acumulador (acc).
            return acc + curr.cantidad;
        }
        // 3. Si no coincide, simplemente retornamos el acumulador sin cambios.
        return acc;
    }, 0);
    const OrdenesTotal = resumen.porEtapa.reduce((acc, curr) => {
        // 1. Preguntamos al elemento ACTUAL (curr) por su etapa.
        if (curr.etapa === 'compras') {
            // 2. Si coincide, sumamos el campo 'total' del elemento actual (curr.total) 
            //    al acumulador (acc).
            return acc + curr.cantidad;
        }
        // 3. Si no coincide, simplemente retornamos el acumulador sin cambios.
        return acc;
    }, 0);
    const compradoTotal = resumen.porEtapa.reduce((acc, curr) => {
        // 1. Preguntamos al elemento ACTUAL (curr) por su etapa.
        if (curr.etapa === 'finalizadas') {
            // 2. Si coincide, sumamos el campo 'total' del elemento actual (curr.total) 
            //    al acumulador (acc).
            return acc + curr.cantidad;
        }
        // 3. Si no coincide, simplemente retornamos el acumulador sin cambios.
        return acc;
    }, 0);
    const totalFinalizadas = resumen.porEtapa.reduce((acc, curr) => {
        // 1. Preguntamos al elemento ACTUAL (curr) por su etapa.
        if (curr.etapa === 'finalizadas') {
            // 2. Si coincide, sumamos el campo 'total' del elemento actual (curr.total) 
            //    al acumulador (acc).
            return acc + curr.total;
        }
        // 3. Si no coincide, simplemente retornamos el acumulador sin cambios.
        return acc;
    }, 0); // El valor inicial del acumulador es 0


    console.log(totalFinalizadas)
    console.log('valorees', valores)
    return (
        <div className="containerDivideZone">
            <div className="boxItem">
                <div className="containerBoxItem">
                    <div className="icono">
                        <MdEditDocument className="icon" />
                    </div>
                    <div className="dataBox">
                        <span>Preordenes de compra</span>
                        <h3>{preOrdenesTotal}</h3>
                    </div>
                </div>
            </div> 

            <div className="boxItem">
                <div className="containerBoxItem">
                    <div className="icono">
                        <MdOutlineDocumentScanner className='icon' />
                    </div>
                    <div className="dataBox">
                        <span>ordenes de compra</span>
                        <h3>{OrdenesTotal}</h3>
                    </div> 
                </div>

            </div>
            <div className="boxItem">
                    <div className="containerBoxItem">
                        <div className="icono">
                            <MdDocumentScanner className="icon" />
                        </div>
                        <div className="dataBox">
                            <span>ordenes aprobadas</span>
                            <h3>{compradoTotal}</h3>
                        </div>
                    </div>
                </div> 


                <div className="boxItem">
                    <div className="containerBoxItem">
                        <div className="icono">
                            <MdOutlineAttachMoney className="icon" />
                        </div>
                        <div className="dataBox">
                            <span>Total comprado</span>
                            <h3>$ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(totalFinalizadas)}</h3>
                        </div>
                    </div>
                </div>
            </div>
    )
}