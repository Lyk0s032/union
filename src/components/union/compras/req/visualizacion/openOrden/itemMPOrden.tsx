import React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../../store/action/action';

interface ItemMPOrdenProps {
    codigo?: string | number;
    nombre?: string;
    cantidadTotal?: string | number;
    unidad?: string;
    tipo?: string; // "Materia prima" | "Producto terminado" (u otros)
}

export default function ItemMPOrden({ 
    codigo = '3', 
    nombre = 'Lamina CR 1.22 X 2.44 C/26', 
    cantidadTotal = '23.81',
    unidad = 'mt2',
    tipo = 'Materia prima',
    medida = 1,
}: ItemMPOrdenProps) {
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const requisicion = useSelector((state: any) => state.requisicion);
    const ids: number[] = requisicion?.requisicionesSeleccionadas || requisicion?.ids || [];

    const isProducto = String(tipo || '').toLowerCase().includes('producto');
    const openItemTipo = isProducto ? 'producto' : 'materia';
    const endpoint = isProducto
        ? '/api/requisicion/get/materiales/producto/'
        : '/api/requisicion/get/materiales/materia/';

    return (
        <div
            className="itemMPOrden"
            onClick={() => {
                // 1) abrir panel (ruta)
                params.set('openItem', `${codigo}`);
                params.set('openItemTipo', openItemTipo);
                setParams(params);

                // 2) cargar data del item (misma lógica que getAllProducts.jsx)
                (dispatch as any)(actions.gettingItemRequisicion(true));
                const body = { mpId: codigo, ids };

                axios
                    .post(endpoint, body)
                    .then((res) => {
                        const data = res.data;
                        console.log('datos producto', res.data);
                        const dataFiltrada = {
                            ...data,
                            itemRequisicions: Array.isArray(data.itemRequisicions)
                                ? data.itemRequisicions.filter(
                                    (ir: any) => Number(ir.medida) === Number(medida)
                                  )
                                : []
                        };
                        console.log('datos producto filtrado', dataFiltrada);
                        (dispatch as any)(actions.getItemRequisicion(dataFiltrada));
                    })
                    .catch((err) => {
                        console.log(err);
                        (dispatch as any)(actions.getItemRequisicion(404));
                    })
                    .finally(() => {
                        (dispatch as any)(actions.gettingItemRequisicion(false));
                    });
            }}
        >
            <div className="itemMPOrdenContent">
                <div className="itemMPOrdenHeader">
                    <div className="itemMPOrdenBadge">
                        <span className="badgeText">{tipo}</span>
                    </div>
                    <div className="itemMPOrdenCodigo">
                        <span className="codigoLabel">Código</span>
                        <span className="codigoValue">{codigo}</span>
                    </div>
                </div>
                
                <div className="itemMPOrdenBody">
                    <h2 className="itemMPOrdenNombre">{nombre} - {medida} {unidad}</h2>
                    <div className="itemMPOrdenCantidad">
                        <span className="cantidadLabel">Cantidad Total</span>
                        <span className="cantidadValue">
                            {Math.max(0, Number(cantidadTotal).toFixed(2))} 
                            {/* <span className="cantidadUnidad">{unidad}</span> */}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}