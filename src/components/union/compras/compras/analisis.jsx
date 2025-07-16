import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React from "react";

export default function Analisis(props){
    const data = props.data;
    console.log(data);

    const exportToPDF = () => {
        html2canvas(document.getElementById("downReq"), {
            scale: 2, // Mejora la calidad
          }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
              orientation: "p", // o "landscape"
              unit: "px",
              format: [canvas.width, canvas.height],
            });
            pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
            pdf.save("exportado.pdf");
          }); 
      };
    return (
        <div className="reqForDownload" >
            <div className="scrollBottom" id="downReq">
                <div className="header">
                    <h1>Requisición multiple</h1>
                    <div className="logo">
                        <img src="https://www.modularescosta.co/assets/logoscosta-2-BDwFa4ZH.png" alt="" />
                    </div> 
                </div>
                <div className="bodyDiv">
                    <div className="topReqsDetails">
                        <div className="reqData">
                            <div className="title">
                                <span>Proyectos</span>
                            </div>
                            <div className="projects">
                                <div className="names">
                                    {
                                        data.requisicion && data.requisicion.length ? 
                                            data.requisicion.map((r,i) => {
                                                return (
                                                    <h4 key={i+1}>{`${Number(21719 + r.id)}`} {r.name} {r.cotizacionId}</h4>
                                                )
                                            })
                                        :null
                                    }

                                </div>
                            </div>
                        </div> 
                    </div>
                    <div className="allMateriaPrima">
                    <table>
                        <thead>
                            <tr>
                                <th>KIT'S</th>
                                <th></th>
                                <th></th>
                                <th>Cantidad a pedir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.resumenKits && data.resumenKits.length ?
                                    data.resumenKits.map((r,i) => {
                                        return (
                                            <tr key={i+1}>
                                                <td>
                                                    <div className='about'>
                                                        <span>Item id: {r.id}</span><br />
                                                        <strong>{r.nombre}</strong>
                                                    </div>
                                                </td>
                                                <td>
                                                </td>
                                                <td>
                                                </td>
                                                <td>
                                                    <div className="price">
                                                        <span>{r.cantidad}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                :
                                <h1>Nada</h1>
                            }
                                        
                            </tbody>
                        </table>
                    </div><br />
                    <div className="allMateriaPrima">
                    <table>
                        <thead>
                            <tr>
                                <th>Materia prima</th>
                                <th>Medida Original</th>
                                <th>M. consumo</th>
                                <th>Cantidad a pedir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.cantidades && data.cantidades.length ?
                                    data.cantidades.map((r,i) => {
                                        return (
                                            <tr key={i+1}>
                                                <td>
                                                    <div className='about'>
                                                        <span>Item Codigo: {r.id}</span><br />
                                                        <strong>{r.nombre}</strong>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="price">
                                                        <span>{r.medidaOriginal} {r.unidad}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="price">
                                                        <span>
                                                            {
                                                                Number(r.cantidad) % 1 === 0 ?
                                                                r.cantidad
                                                                : r.cantidad.toFixed(3)
                                                            }
                                                        </span>
                                                    </div> 
                                                </td>
                                                <td>
                                                    <div className="price">
                                                        {
                                                            r.unidad == 'mt2' ?

                                                                <span>
                                                                    {r.cantidad / Number(Number(r.medidaOriginal.split('X')[0]) * Number(r.medidaOriginal.split('X')[1])) < 0.5 ? 1 : Math.round(r.cantidad / Number(Number(r.medidaOriginal.split('X')[0]) * Number(r.medidaOriginal.split('X')[1])) )}
                                                                </span>
                                                            : r.unidad == 'mt' ?
                                                                <span>{r.cantidad / Number(r.medidaOriginal) < 0.5 ? 1 : r.cantidad / Number(r.medidaOriginal)} </span> 

                                                            : r.unidad == 'kg' ?
                                                                <span>{r.cantidad / Number(r.medidaOriginal) < 0.5 ? 1 : r.cantidad / Number(r.medidaOriginal)} </span> 

                                                            : <span>{r.cantidad / r.medidaOriginal} </span>

                                                        
                                                        }


                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                :
                                <h1>Nada</h1>
                            }
                                        
                            </tbody>
                        </table>
                    </div>
                </div>
                
            </div>
            <div className="bottomToDownload">
                <button onClick={() => exportToPDF()}> 
                    Descargar pdf 
                </button>
            </div>
        </div>
    )
}