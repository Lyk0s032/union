import React, { useRef, useState } from "react";
import ListaMPTotal from "./listaMP";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LISTAPT from "./listaPT";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

export default function GeneralTotal({ productosTotal, cargaProyectos }){
    const [params, setParams] = useSearchParams();
    const ref = useRef(null);
    const refLeft = useRef(null);

    const longer = useRef(null);

    const dispatch = useDispatch();
    const req = useSelector(store => store.requisicion);
    const { materia, proyectos, materiaIds, totalFaltante, totalFaltanteProducto} = req;

    const [total, setTotal] = useState(0)

    const addToTotal = (val) => {
        let a = Number(total) + Number(val);
        console.log('nuevo valor, ', a)
        setTotal(a);
    }

// dentro del componente GeneralTotal, por ejemplo debajo de addToTotal:
const exportToPDF = () => {
  // helper: detectar si un item es un kit
  const isKit = (m) => {
    if (!m) return false;
    // propiedades explícitas
    if (m.kit === true || m.isKit === true) return true;
    if (String(m.tipo || '').toLowerCase() === 'kit') return true;
    // si existe una bandera específica en tu modelo, agrégala arriba

    // por nombre: "Kit 11", "Kit50", "KIT - 12", etc.
    const nombre = String(m.nombre || '').trim().toLowerCase();
    // detecta "kit" como palabra (al inicio o en cualquier parte)
    if (/\bkit\b/i.test(nombre)) return true;

    return false;
  };

  // Filtramos las materias para eliminar kits
  const materiasFiltradas = (materia || []).filter(m => !isKit(m));

  // encabezados
  const head = [["ID", "Nombre", "Medida", "Entregado", "Total Cantidad", "Unidad", "Valor Unitario", "Valor Total"]];

  // filas desde materias filtradas — Entregado y Total Cantidad incluyen la unidad
  const body = materiasFiltradas.map(m => {
    console.log('Materia para pdf:', m)
    const entregado = Number(m.entregado || 0);
    const totalCantidad = Number(m.totalCantidad || 0);
    const unidad = m.unidad ? String(m.unidad).trim() : "";
    const fmt = (v) => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(Number(v || 0));
   
    let findMt2  = m.unidad == 'mt2' ? productosTotal.filter(pt => pt.id == m.id) : null;

    const precioPromedio = m.precios.reduce((acc, it) => {
        return acc + Number(it.valor);
    }, 0); 


    const promedioUnidad = precioPromedio / m.precios.length;
    const medidaNombre = findMt2?.[0]?.productoCotizacion?.[0]?.medida?.trim() || 0;
    
    console.log('medida nombre para pdf:', medidaNombre)
    let ladoA =  findMt2 && findMt2.length ? findMt2[0]?.productoCotizacion[0]?.medida.split('X')[0] : null
    let ladoB = findMt2 && findMt2.length ? findMt2[0]?.productoCotizacion[0]?.medida.split('X')[1] : null
    let area = findMt2 && findMt2.length ? Number(ladoA) * Number(ladoB) : null;
    let cantidadToPricesMt2 = findMt2 && findMt2.length ? Number(Math.ceil(Number( Number(materia?.totalCantidad) / Number(area) )).toFixed(0)) : 0
    const cantidadPriceMt2 = Number(area) * Number(promedioUnidad);

    console.log('Productos total para pdf:', productosTotal)

    return [
      m.id ?? "",
      `${m.nombre}` ?? "",
      medidaNombre ?? "",
      `${fmt(entregado)}`.trim(),
      `${fmt(totalCantidad)}`.trim(),
      m.unidad ?? "",
      m.unidad == 'mt2' && m.tipo == 'producto' ? `${fmt(cantidadPriceMt2)}` : `${fmt(Number(promedioUnidad).toFixed(0))}`.trim(),
      m.unidad == 'mt2' && m.tipo == 'producto' ? `${fmt(cantidadPriceMt2 * Number(m.totalCantidad - m.entregado))}` : `${fmt(Number(promedioUnidad * Number(m.totalCantidad - m.entregado)).toFixed(0))}`.trim(),
    
    ];
  });

  // crea doc
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  // Título
  doc.setFontSize(14);
  doc.text("Consolidado - Proyecto", pageWidth / 2, 14, { align: "center" });

  // tabla (autotable)
  autoTable(doc, {
    startY: 20,
    head: head,
    body: body,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { left: 8, right: 8 }
  });

  // totales
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 8 : 20;
  doc.setFontSize(12);
  doc.text("Totales", 14, finalY);

  doc.setFontSize(10);
  doc.text(`Total Consolidado: ${new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(totalFaltante || 0).toFixed(0))} COP`, 14, finalY + 8);
  doc.text(`Total Productos: ${new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(totalFaltanteProducto || 0).toFixed(0))} COP`, 14, finalY + 14);

  // Lista de proyectos (nombres)
  const proyectosLista = (proyectos || []);
  if (proyectosLista.length > 0) {
    let cursorY = finalY + 28;
    doc.setFontSize(12);
    doc.text("Proyectos:", 14, cursorY);
    doc.setFontSize(10);
    proyectosLista.forEach((p, i) => {
      const y = cursorY + 6 + i * 6;
      const fechaTxt = p.fecha ? ` - ${new Date(p.fecha).toLocaleDateString('es-CO')}` : '';
      doc.text(`• ${(p.cotizacionId + 21719)} — ${p.nombre}${fechaTxt}`, 16, y);
    });
  } else {
    const cursorY = finalY + 28;
    doc.setFontSize(10);
    doc.text("No hay proyectos registrados.", 14, cursorY);
  }

  // descarga
  doc.save("consolidado.pdf");
};



    return (
        <div className="generalComprar">
            <div className="containerGeneral">
                <div className="title">
                    <div className="">
                        <h1>Total</h1>
                        <span>Total del consolidado </span>
                        <button onClick={() => exportToPDF()}>
                            <span>Descargar</span>
                        </button>
                    </div>
                </div>
                <div className="lista">
                    <div className="containerLista">
                        <div className="DataHere" ref={longer} >
                            <ListaMPTotal materia={materia} sumar={addToTotal} />
                            <div className="DataHere">
                                <table className="resultItem">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <span>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(totalFaltante).toFixed(0))} $</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <br /><br />
                            <LISTAPT productosTotal={productosTotal} materia={materia} sumar={addToTotal} />

                            <div className="DataHere">
                                <table className="resultItem">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <span>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(totalFaltanteProducto).toFixed(0))} $</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div> 

                
            </div>
        </div>
    )
}