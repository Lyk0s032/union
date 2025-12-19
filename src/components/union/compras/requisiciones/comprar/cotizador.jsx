import React, { useEffect, useRef, useState } from 'react';
import * as actions from '../../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ProveedorCotizador from './proveedorCotizador';
import CotizacionProviderItem from './itemProviderCotizacion';
import { useSearchParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


export default function Cotizador({ productosTotal, total }){
    const [materias, setMaterias] = useState();
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);
    const { materiaIds, fastCotizacion, loadingFastCotizacion, itemsCotizacions } = req;

    // const [cotizacionesData, setCotizacionesData] = useState([]); // <-- aquí se guardan todas

    // // Recibe del hijo su objeto y lo guarda/reemplaza en el array
    // const handleCotizacionChange = (proveedorId, cotizacionObj) => {
    //     setCotizacionesData(prev => {
    //         const existe = prev.find(c => c.ProveedorId === proveedorId);
    //         if(existe){
    //             return prev.map(c => c.ProveedorId === proveedorId ? cotizacionObj : c);
    //         }
    //         return [...prev, cotizacionObj];
    //     });
    // };

    const getIdsSolo = () => {
        if (!materiaIds || !materiaIds.length) return [];

        if (params.get("s") === "materia") {
            return materiaIds.map(it => it.materiaId).filter(Boolean);
        } else if (params.get("s") === "productos") {
            return materiaIds.map(it => it.productoId).filter(Boolean);
        }
        return [];
    };
    
    const sendCotizarGeneral = async () => {
        const tipo = params.get("s"); // "materia" o "productos"
        const idsSolo = getIdsSolo();
        if (!idsSolo.length) return;

        dispatch(actions.gettingCotizacionFast(true));
        let endpoint = tipo === "materia"
            ? "/api/requisicion/get/cotizar/realTime/MP"
            : "/api/requisicion/get/cotizar/realTime/PT";

        try {
            const res = await axios.post(endpoint, { materiaIds: idsSolo });
            dispatch(actions.getCotizacionFast(res.data));
        } catch (err) {
            console.log(err);
            dispatch(actions.HandleAlerta("Negativo", "mistake"));
        } finally {
            dispatch(actions.gettingCotizacionFast(false));
        }
    };

    const cotizador = useRef(null);

    const comparar = () => {
        cotizador.current.classList.toggle('cotizadorViewActive')
    }

    useEffect(() => {
        sendCotizarGeneral();
    }, [materiaIds, params.get("s")]);

const exportSelectedToPDF = () => {
  // Fuente de datos: primero el state local 'materias', si no existe toma req.materia, si no, array vacío
  const dataSource = materias || req.materia || [];

  if (!Array.isArray(dataSource) || dataSource.length === 0) {
    alert('No hay datos de materia para exportar.');
    return;
  }

  // Construimos un set/lookup con los ids seleccionados (soporta materiaId o productoId)
  const selectedIds = new Set();
  (materiaIds || []).forEach(it => {
    if (it.materiaId) selectedIds.add(String(it.materiaId));
    if (it.productoId) selectedIds.add(String(it.productoId));
  });

  // Filtramos las materias/elementos que están seleccionados
  const seleccionadas = dataSource.filter(m => selectedIds.has(String(m.id)));

  if (!seleccionadas.length) {
    alert('No hay ítems seleccionados para exportar.');
    return;
  }

  console.log('[PDF] items a exportar:', seleccionadas.map(s => s.id));

  // Preparamos cuerpo de la tabla (mismo cálculo que en tu item)
  const body = seleccionadas.map(m => {
    const precioPromedio = (m.precios || []).reduce((acc, it) => acc + Number(it.valor || 0), 0);

    let productoLados = 1;
    if (m.unidad === 'mt2') {
      const [ladoA, ladoB] = (m.medida || '').toString().split('X').map(x => Number(x));
      if (!isNaN(ladoA) && !isNaN(ladoB)) productoLados = ladoA * ladoB;
    } else if (m.unidad === 'kg') {
      productoLados = m.medida ? (Number(m.medida) / Number(m.medida || 1)) : 1;
    } else {
      productoLados = Number(m.medida || 1);
    }

    const productoFilter = m.tipo == 'producto' ? productosTotal?.find(i => i.id == m.id) : []

    const cantidadToPrices = Number(Math.ceil(Number(Number(m.totalCantidad || 0) / Number(productoLados || 1))));
    const promedioUnidad = m.unidad === 'kg'
      ? Number((precioPromedio / ((m.precios || []).length || 1)) / (Number(m.medida) || 1))
      : Number((precioPromedio / ((m.precios || []).length || 1)));

    const cantidadPrice = Number(cantidadToPrices * promedioUnidad) || 0;

    const estado = Number(m.entregado) >= Number(m.totalCantidad / productoLados)
      ? 'Comprado'
      : (Number(m.entregado) > 0 && Number(m.entregado) < Number(m.totalCantidad))
        ? 'Parcial'
        : 'Pendiente';

    return [
      m.id ?? '',
      m.nombre ?? '',
      m.unidad ?? '',
      productoLados ? m.unidad == 'mt2' && m.tipo == 'producto' ? `${productoFilter?.productoCotizacion[0]?.medida}` : `${productoLados}` : productoLados,
      cantidadToPrices,
      new Intl.NumberFormat('es-CO').format(Number(promedioUnidad).toFixed(0)),
      new Intl.NumberFormat('es-CO').format(Number(cantidadPrice).toFixed(0)),
      estado
    ];
  });

  // Generar PDF
  const doc = new jsPDF('p', 'mm', 'a4');
  doc.setFontSize(14);
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.text('Ítems seleccionados - Consolidado', pageWidth / 2, 12, { align: 'center' });

  autoTable(doc, {
    startY: 18,
    head: [[
      'ID', 'Nombre', 'Unidad', 'Medida', 'Cantidad (a cotizar)'
    ]],
    body,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    margin: { left: 8, right: 8 },
    theme: 'striped',
  });

  // Totales
  const totalSeleccion = seleccionadas.reduce((acc, m) => {
    const precioPromedio = (m.precios || []).reduce((acc2, it) => acc2 + Number(it.valor || 0), 0);
    let productoLados = 1;
    if (m.unidad === 'mt2') {
      const [ladoA, ladoB] = (m.medida || '').toString().split('X').map(x => Number(x));
      if (!isNaN(ladoA) && !isNaN(ladoB)) productoLados = ladoA * ladoB;
    } else if (m.unidad === 'kg') {
      productoLados = m.medida ? (Number(m.medida) / Number(m.medida || 1)) : 1;
    } else {
      productoLados = Number(m.medida || 1);
    }
    const cantidadToPrices = Number(Math.ceil(Number(Number(m.totalCantidad || 0) / Number(productoLados || 1))));
    const promedioUnidad = m.unidad === 'kg'
      ? Number((precioPromedio / ((m.precios || []).length || 1)) / (Number(m.medida) || 1))
      : Number((precioPromedio / ((m.precios || []).length || 1)));
    const cantidadPrice = Number(cantidadToPrices * promedioUnidad) || 0;
    return acc + cantidadPrice;
  }, 0);

  const afterY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 8 : 18;
  doc.setFontSize(11);
//   doc.text(`Total seleccionado: ${new Intl.NumberFormat('es-CO').format(Number(totalSeleccion).toFixed(0))} COP`, 14, afterY);

  doc.save('seleccionados_consolidado.pdf');
};

const exportSelectedToPDFGeneral = () => {
  // Fuente de datos: primero el state local 'materias', si no existe toma req.materia, si no, array vacío
  const dataSource = materias || req.materia || [];

  if (!Array.isArray(dataSource) || dataSource.length === 0) {
    alert('No hay datos de materia para exportar.');
    return;
  }

  // Construimos un set/lookup con los ids seleccionados (soporta materiaId o productoId)
  const selectedIds = new Set();
  (materiaIds || []).forEach(it => {
    if (it.materiaId) selectedIds.add(String(it.materiaId));
    if (it.productoId) selectedIds.add(String(it.productoId));
  });

  // Filtramos las materias/elementos que están seleccionados
  const seleccionadas = dataSource.filter(m => selectedIds.has(String(m.id)));

  if (!seleccionadas.length) {
    alert('No hay ítems seleccionados para exportar.');
    return;
  }

  console.log('[PDF] items a exportar:', seleccionadas.map(s => s.id));

  // Preparamos cuerpo de la tabla (mismo cálculo que en tu item)
  const body = seleccionadas.map(m => {
    const precioPromedio = (m.precios || []).reduce((acc, it) => acc + Number(it.valor || 0), 0);

    let productoLados = 1;
    if (m.unidad === 'mt2') {
      const [ladoA, ladoB] = (m.medida || '').toString().split('X').map(x => Number(x));
      if (!isNaN(ladoA) && !isNaN(ladoB)) productoLados = ladoA * ladoB;
    } else if (m.unidad === 'kg') {
      productoLados = m.medida ? (Number(m.medida) / Number(m.medida || 1)) : 1;
    } else {
      productoLados = Number(m.medida || 1);
    }

    const cantidadToPrices = Number(Math.ceil(Number(Number(m.totalCantidad || 0) / Number(productoLados || 1))));
    const promedioUnidad = m.unidad === 'kg'
      ? Number((precioPromedio / ((m.precios || []).length || 1)) / (Number(m.medida) || 1))
      : Number((precioPromedio / ((m.precios || []).length || 1)));

    const cantidadPrice = Number(cantidadToPrices * promedioUnidad) || 0;
    const productoFilter = m.tipo == 'producto' ? productosTotal?.find(i => i.id == m.id) : []

    const estado = Number(m.entregado) >= Number(m.totalCantidad / productoLados)
      ? 'Comprado'
      : (Number(m.entregado) > 0 && Number(m.entregado) < Number(m.totalCantidad))
        ? 'Parcial'
        : 'Pendiente';

    return [
      m.id ?? '',
      m.nombre ? m.unidad == 'mt2' && m.tipo == 'producto' ? `${m.nombre} - ${productoFilter?.productoCotizacion[0]?.medida}` : `${m.nombre}` : '',
      m.unidad ?? '',
      productoLados ? m.unidad == 'mt2' && m.tipo == 'producto' ? `${productoFilter?.productoCotizacion[0]?.medida}` : `${productoLados}` : productoLados,
      m.entregado > 0 && m.entregado < m.totalCantidad ? Number(m.totalCantidad - m.entregado) : cantidadToPrices,
      new Intl.NumberFormat('es-CO').format(Number(promedioUnidad).toFixed(0)),
      m.entregado > 0 && m.entregado < m.totalCantidad ? new Intl.NumberFormat('es-CO').format(Number(Number(m.totalCantidad - m.entregado) * Number(promedioUnidad)).toFixed(0))  : new Intl.NumberFormat('es-CO').format(Number(cantidadPrice).toFixed(0)),
      estado
    ];
  });

  // Generar PDF
  const doc = new jsPDF('p', 'mm', 'a4');
  doc.setFontSize(14);
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.text('Ítems seleccionados - Consolidado', pageWidth / 2, 12, { align: 'center' });

  autoTable(doc, {
    startY: 18,
    head: [[
      'ID', 'Nombre', 'Unidad', 'Medida', 'Cantidad (a cotizar)', 'P/unidad', 'P/Total'
    ]],
    body,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    margin: { left: 8, right: 8 },
    theme: 'striped',
  });

  // Totales
  const totalSeleccion = seleccionadas.reduce((acc, m) => {
    const precioPromedio = (m.precios || []).reduce((acc2, it) => acc2 + Number(it.valor || 0), 0);
    let productoLados = 1;
    if (m.unidad === 'mt2') {
      const [ladoA, ladoB] = (m.medida || '').toString().split('X').map(x => Number(x));
      if (!isNaN(ladoA) && !isNaN(ladoB)) productoLados = ladoA * ladoB;
    } else if (m.unidad === 'kg') {
      productoLados = m.medida ? (Number(m.medida) / Number(m.medida || 1)) : 1;
    } else {
      productoLados = Number(m.medida || 1);
    }
    const cantidadToPrices = Number(Math.ceil(Number(Number(m.totalCantidad || 0) / Number(productoLados || 1))));
    const promedioUnidad = m.unidad === 'kg'
      ? Number((precioPromedio / ((m.precios || []).length || 1)) / (Number(m.medida) || 1))
      : Number((precioPromedio / ((m.precios || []).length || 1)));
    const cantidadPrice = Number(cantidadToPrices * promedioUnidad) || 0;
    return acc + cantidadPrice;
  }, 0);

  const afterY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 8 : 18;
  doc.setFontSize(11);
//   doc.text(`Total seleccionado: ${new Intl.NumberFormat('es-CO').format(Number(totalSeleccion).toFixed(0))} COP`, 14, afterY);

  doc.save('seleccionados_consolidado.pdf');
};
    return (
        <div className="cotizadorDash">
            <div className="containerCotizador">
                {
                    materiaIds?.length ?
                       
                        !fastCotizacion || loadingFastCotizacion ?
                            <h1>Cargando...</h1>
                        :
                        <div className="caja">
                            <div className="boxCotizaciones">
                                {
                                    fastCotizacion.proveedoresComunes.map((data, i) => {
                                        return (
                                            <ProveedorCotizador provider={data} key={i+1} />
                                        )
                                    })
                                }
                                
                            </div>
                            <button className="comparar" onClick={() => comparar()}>
                                <span>Comparar cotizaciones</span>
                            </button>
                        </div>

                    : null
                }
                    <div className="divPricesNeed">
                        <div className="containerPricesNeed">
                            <span>Inversión  faltante apróximada</span>
                            <h1>$ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(total).toFixed(0))}</h1>
                            {
                                materiaIds.length ? <>
                                <button onClick={() => exportSelectedToPDF()}>
                                    <span>Descargar para proveedor</span>
                                </button>
                                <button onClick={() => exportSelectedToPDFGeneral()}>
                                    <span>Descarga general</span>
                                </button>
                                </> : null

                                
                            }
                            
                        </div> 
                    </div>
            </div>
            <div className="cotizadorView" ref={cotizador}>
                <div className="containerCotizadorView">
                    <div className="topClose"> 
                        <button onClick={() => comparar()}>
                            <span>
                                Close
                            </span>
                        </button> 
                    </div>
                    <div className="cotizaciones">
                        <div className="containerCotizaciones">
                            {
                                materiaIds?.length ?
                                
                                    !fastCotizacion || loadingFastCotizacion ?
                                        <h1>Cargando...</h1>
                                    :
                                        fastCotizacion.proveedoresComunes.map((data, i) => {
                                            return (
                                                <CotizacionProviderItem 
                                                provider={data} key={i+1} />
                                            )
                                        })
                                            
                                : <h1>no hay</h1>
                            }

                        </div>

                        <button>Crear cotizaciones</button>
                    </div>
                </div>
            </div>
        </div>
    )
}