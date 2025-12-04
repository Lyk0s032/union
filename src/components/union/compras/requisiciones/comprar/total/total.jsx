import React, { useRef, useState } from "react";
import ListaMPTotal from "./listaMP";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LISTAPT from "./listaPT";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

export default function GeneralTotal({ cargaProyectos }){
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
    // prepara columnas (encabezados)
        const head = [["ID", "Nombre", "Entregado", "Total Cantidad"]];

        // prepara las filas desde materia
        const body = (materia || []).map(m => {
            const entregado = Number(m.entregado || 0);
            const totalCantidad = Number(m.totalCantidad || 0);
            const cantidadToPrices = Number(m.cantidadToPrices || 0);
            const promedioUnidad = Number(m.promedioUnidad || 0);
            const cantidadPrice = Number((cantidadToPrices * promedioUnidad) || 0);
            return [
            m.id ?? "",
            m.nombre ?? "",
            entregado,
            totalCantidad,
            cantidadToPrices,
            promedioUnidad,
            cantidadPrice
            ];
        });

        // crea doc
        const doc = new jsPDF("p", "mm", "a4");
        const pageWidth = doc.internal.pageSize.getWidth();

        // Título
        doc.setFontSize(14);
        doc.text("Consolidado - Proyecto", pageWidth / 2, 14, { align: "center" });

        // tabla (autotable se encarga de paginar)
        autoTable(doc, {
            startY: 20,
            head: head,
            body: body,
            styles: { fontSize: 9, cellPadding: 3 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            margin: { left: 8, right: 8 }
        });

        // después de la tabla, añadimos hoja de totales
        const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 8 : 20;
        doc.setFontSize(12);
        doc.text("Totales", 14, finalY);

        // listado de totales (puedes añadir más campos)
        doc.setFontSize(10);
        doc.text(`Total Consolidado: ${new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(totalFaltante || 0).toFixed(0))} COP`, 14, finalY + 8);
        doc.text(`Total Productos: ${new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(totalFaltanteProducto || 0).toFixed(0))} COP`, 14, finalY + 14);

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
                            <LISTAPT materia={materia} sumar={addToTotal} />

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