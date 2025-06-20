import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import html2pdf from "html2pdf.js";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function DocumentCotizacion(){
    const [params, setParams] = useSearchParams(); 

    const cotizacionn = useSelector(store => store.cotizacions);
    const { cotizacion, loadingCotizacion } = cotizacionn;

    const pdfRef = useRef();

const exportToPDF = () => {
  const input = document.getElementById("cotizacion-pdf");

  // Guardar estilo original
  const originalHeight = input.style.height;
  const originalOverflow = input.style.overflow;

  // Expandir div para mostrar todo el contenido
  input.style.height = 'auto';
  input.style.overflow = 'visible';

  // Esperar a que se renderice visualmente (opcional pero recomendable)
  setTimeout(() => {
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`cotizacion-${cotizacion.client.nombre}-${Number(21719)+Number(cotizacion.id)}.pdf`);

      // Restaurar estilos originales
      input.style.height = originalHeight;
      input.style.overflow = originalOverflow;
    });
  }, 100); // Espera opcional de 100ms para asegurar render
};
    return ( 
        <div className="modal">
            <div className="hiddenModal" onClick={() => {
                params.delete('watch');
                setParams(params);
            }}></div>
            {
                !cotizacion || loadingCotizacion ?
                    <h1>Cargando cotización...</h1>
                : 
                <div className="containerModal Large">
                    <div className="cotizacionBody" id="cotizacion-pdf">
                        <div className="top">
                            <img src="https://metalicascosta.com.co/assets/img/logo_metalicas_costa.png" alt="" />
                        </div>
                        <div className="cotizacionFuente">
                            <div className="topCoti">
                                <div className="divideTop">
                                    <div className="left">
                                        <h1>Modulares Costa Gomez SAS</h1>
                                        <div className="item">
                                            <h3>
                                                NIT:
                                            </h3>
                                            <h4> 901165150-3</h4>
                                        </div>
                                        <div className="item">
                                            <h3>
                                                DIRECCIÓN:
                                            </h3>
                                            <h4> CL 11 13 15</h4>
                                        </div>
                                        <div className="item">
                                            <h3>
                                                TELÉFONO:
                                            </h3>
                                            <h4> 4371651</h4>
                                        </div>
                                    </div>
                                    <div className="left">
                                        <div className="item">
                                            <h3>
                                                Número:
                                            </h3>
                                            <h4> MDC-CV-{Number(21719)+Number(cotizacion.id)}</h4>
                                        </div>
                                        <div className="item">
                                            <h3>
                                                FECHA:
                                            </h3>
                                            <h4>{cotizacion.time ? cotizacion.time.split('T')[0] : 0}</h4>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                            <div className="clientTopData">
                                <div className="divideTopData">
                                    <div className="left">
                                        <div className="item">
                                            <h3>
                                                Cliente:
                                            </h3>
                                            <h4> {cotizacion.client.nombre.toUpperCase()}</h4>
                                        </div>
                                        <div className="item">
                                            <h3>
                                                CONTACTO:
                                            </h3>
                                            <h4> {cotizacion.client.phone}</h4>
                                        </div>
                                        <div className="item">
                                            <h3>
                                                DIRECCIÓN:
                                            </h3>
                                            <h4>{cotizacion.client.direccion.toUpperCase()}</h4>
                                        </div>
                                        <div className="item">
                                            <h3>
                                                CIUDAD:
                                            </h3>
                                            <h4> {cotizacion.client.ciudad}</h4>
                                        </div>
                                        <div className="item">
                                            <h3>
                                                TELÉFONO:
                                            </h3>
                                            <h4>{
                                                cotizacion.client.fijos && cotizacion.client.fijos.length ?
                                                cotizacion.client.fijos.map((ph,i) => {
                                                    return (
                                                        <span key={i+1}>{ph}<br /></span>
                                                    )
                                                })
                                                :null
                                            }</h4>
                                        </div>
                                    </div>
                                    <div className="left">
                                        <div className="item">
                                            <h3>
                                                Vendedor:
                                            </h3>
                                            <h4>{cotizacion.user.nick.toUpperCase()}</h4>
                                        </div>
                                        {/* <div className="item">
                                            <h3>
                                                FORMA DE PAGO:
                                            </h3>
                                            <h4> 03 50% ANTICIPO-50% ENTREGA</h4>
                                        </div> */}
                                        <div className="item">
                                            <h3>
                                                MONEDA:
                                            </h3>
                                            <h4>PESOS</h4>
                                        </div>
                                        {/* <div className="item">
                                            <h3>
                                                VALIDA HASTA:
                                            </h3>
                                            <h4> 25 DE MAYO DEL 2025</h4>
                                        </div> */}
                                    </div>
                                </div>
                            </div>

                            <div className="referencias">
                                <div className="titleHere">
                                    <h3>
                                        Cotización
                                    </h3>
                                </div>
                                <div className="tableData">
                                    {
                                        cotizacion.areaCotizacions?.length ?
                                            cotizacion.areaCotizacions.map((area, i) => {
                                                return (
                                                    <div className="tabla">
                                                        <h4>{area.name}</h4>
                                                        <table key={i+1}>
                                                            <thead>
                                                                <tr>
                                                                    <th className='left'>Referencia</th>
                                                                    <th className='left'>Descripción</th>
                                                                    <th>Cantidad</th>
                                                                    <th>Valor Unitario</th>
                                                                    <th>IVA</th>
                                                                    <th>Descuentos</th>
                                                                    <th>Valor total</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    area && area.kits?.length || area.armados?.length || area.productos?.length ?
                                                                        area.productos.concat(area.kits).concat(area.armados).map((it,i) => {
                                                                            return (
                                                                                <tr key={i+1}>
                                                                                    
                                                                                    {
                                                                                        it.kitCotizacion ?
                                                                                            <td className='left'>0{it.id}</td>
                                                                
                                                                                            :
                                                                                        it.productoCotizacion ?
                                                                                            <td className='left'>PT {it.id}</td>
                                                                                        :
                                                                                        <td className='left'>SP{it.id}</td>
                                                                                    }
                                                                                    {
                                                                                        it.productoCotizacion ?
                                                                                            <td className='left'>{it.item} - {it.extension.name}</td>
                                                                                        :
                                                                                            <td className='left'>{it.name} - {it.extension.name}</td>
                                                                                    }
                                                                                    {
                                                                                        it.kitCotizacion ?
                                                                                        <td>{it.kitCotizacion.cantidad}</td>
                                                                                        :
                                                                                        it.productoCotizacion ?
                                                                                        <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.productoCotizacion.cantidad).toFixed(0))}</td>
                                                                                        :
                                                                                        <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.armadoCotizacion.cantidad).toFixed(0))}</td>
                                                                                    } 
                                                                                    { 
                                                                                        it.kitCotizacion ?
                                                                                        <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.kitCotizacion.precio / it.kitCotizacion.cantidad).toFixed(0))} COP</td>
                                                                                        :
                                                                                        it.productoCotizacion ?
                                                                                        <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.productoCotizacion.precio / it.productoCotizacion.cantidad).toFixed(0))} COP</td>
                                                                                        :
                                                                                        <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.armadoCotizacion.precio / it.armadoCotizacion.cantidad).toFixed(0))} COP</td>
                                                                                    }
                                                                                    {
                                                                                        it.kitCotizacion ?
                                                                                        <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(Number(it.kitCotizacion.precio - it.kitCotizacion.descuento).toFixed(0) * (0.19)).toFixed(0))} COP</td>
                                                                                        : 
                                                                                         it.productoCotizacion ?
                                                                                        <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(Number(it.productoCotizacion.precio - it.productoCotizacion.descuento).toFixed(0)) * (0.19))} COP</td>
                                                                                        :
                                                                                        <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(Number(it.armadoCotizacion.precio - it.armadoCotizacion.descuento).toFixed(0)) * (0.19))} COP</td>
                                                                                    }
                                                                                    {
                                                                                        it.kitCotizacion ?
                                                                                        <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(it.kitCotizacion.descuento)} COP</td>
                                                                                        :
                                                                                         it.productoCotizacion ?
                                                                                        <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(it.productoCotizacion.descuento)} COP</td>
                                                                                        :
                                                                                        <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(it.armadoCotizacion.descuento)} COP</td>
                                                                                    }
                                                                                    {
                                                                                        it.kitCotizacion ?
                                                                                        <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.kitCotizacion.precio).toFixed(0))} COP</td>
                                                                                        :
                                                                                         it.productoCotizacion ?
                                                                                        <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.productoCotizacion.precio).toFixed(0))} COP</td>
                                                                                        :
                                                                                        <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.armadoCotizacion.precio).toFixed(0))} COP</td>
                                                                                    }
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    : null
                                                                }
                                                                
                                                                
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )
                                            })
                                        : null
                                    }
                                    <br />
                                    <div className="tabla">
                                        <table className='final'>
                                            <thead>
                                                <tr>
                                                    <th>Valor sin descuento</th>
                                                    <th>Descuento global</th>
                                                    <th>Subtotal</th>
                                                    <th>Valor Iva</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <TotalSub cotizacion={cotizacion} />
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="optionDownload">
                        <button  onClick={exportToPDF}>
                            <span>Descargar</span>
                        </button>
                    </div>
                    
                </div>
            }

            
        </div>
    )
}

function TotalSub({ cotizacion }){
    
    // const valor = cotizacion.kits && cotizacion.kits.length ? Number(cotizacion.kits.reduce((acc, p) => Number(acc) + Number(p.kitCotizacion ? p.kitCotizacion.precio : 0), 0)) : null
    // const valorSuper = cotizacion.armados && cotizacion.armados.length ? Number(cotizacion.armados.reduce((acc, p) => Number(acc) + Number(p.armadoCotizacion ? p.armadoCotizacion.precio : 0), 0)) : null
    // const sumaValor = Number(valor + valorSuper)
    // // Descuento
    // const descuentoValor = cotizacion.kits && cotizacion.kits.length ? Number(cotizacion.kits.reduce((acc, p) => Number(acc) + Number(p.kitCotizacion ? p.kitCotizacion.descuento : 0), 0)) : null
    // const descuentoValorSuper = cotizacion.armados && cotizacion.armados.length ? Number(cotizacion.armados.reduce((acc, p) => Number(acc) + Number(p.armadoCotizacion ? p.armadoCotizacion.descuento : 0), 0)) : null
    // const sumaDescuento = Number(descuentoValor + descuentoValorSuper).toFixed(0)

     // Valor de kits por área
    const valorKits = cotizacion.areaCotizacions?.reduce((accArea, area) => {
    const suma = area.kits?.reduce((accKit, kit) => {
            return accKit + Number(kit.kitCotizacion?.precio || 0);
        }, 0) || 0;
        return accArea + suma;
    }, 0) || 0;

    // Valor de armados por área
    const valorArmados = cotizacion.areaCotizacions?.reduce((accArea, area) => {
    const suma = area.armados?.reduce((accKit, kit) => {
            return accKit + Number(kit.armadosCotizacion?.precio || 0);
        }, 0) || 0;
        return accArea + suma;
    }, 0) || 0;

    const valorProductos = cotizacion.areaCotizacions?.reduce((accArea, area) => {
    const suma = area.productos?.reduce((accKit, kit) => {
            return accKit + Number(kit.productosCotizacion?.precio || 0);
        }, 0) || 0;
        return accArea + suma;
    }, 0) || 0;


    // Descuentos
    const descuentoKits = cotizacion.areaCotizacions?.reduce((accArea, area) => {
    const suma = area.kits?.reduce((accKit, kit) => {
            return accKit + Number(kit.kitCotizacion?.descuento || 0);
        }, 0) || 0;
        return accArea + suma;
    }, 0) || 0;

    const descuentoArmados = cotizacion.areaCotizacions?.reduce((accArea, area) => {
    const suma = area.armados?.reduce((accKit, kit) => {
            return accKit + Number(kit.armadosCotizacion?.descuento || 0);
        }, 0) || 0;
        return accArea + suma;
    }, 0) || 0;

    const descuentoProductos = cotizacion.areaCotizacions?.reduce((accArea, area) => {
    const suma = area.productos?.reduce((accKit, kit) => {
            return accKit + Number(kit.productosCotizacion?.descuento || 0);
        }, 0) || 0;
        return accArea + suma;
    }, 0) || 0;

    const sumaDescuento = descuentoKits + descuentoArmados + descuentoProductos;
    const subTotal = valorKits + valorArmados + valorProductos;
    const totalSub = subTotal - sumaDescuento;
    const valorIva = Number(subTotal - sumaDescuento) * (19 / 100)
    const total = totalSub + valorIva;
    return (
        <tr className='total'>
            {/* <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(sumaValor).toFixed(0))} COP</td> */}
            <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(subTotal).toFixed(0))} COP</td>
            <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(sumaDescuento).toFixed(0))} COP</td>
            <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(totalSub).toFixed(0))} COP</td>
            <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(valorIva).toFixed(0))} COP</td>
            <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(total).toFixed(0))} COP</td>
        
        </tr>
    )
}