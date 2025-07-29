import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import html2pdf from "html2pdf.js";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import fileDownload from 'js-file-download';
import * as actions from '../../../store/action/action';

export default function DocumentCotizacion(){
    const [params, setParams] = useSearchParams(); 

    const cotizacionn = useSelector(store => store.cotizacions);
    const { cotizacion, loadingCotizacion } = cotizacionn;
    const [municipio, setMuni] = useState(null);
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
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const getPDF = async () => {
        try{
            setLoading(true)
            let data = {
                cotizacion: { numero: `MDC-CV-${cotizacion.id + 21719}'`, fecha: cotizacion.time.split('T')[0] },
                asesor: {nombre: `${cotizacion.user.name.toUpperCase()} ${cotizacion.user.lastName.toUpperCase()}`, correo: `${cotizacion.user.email.toUpperCase()}`, telefono: cotizacion.user.phone},
                cliente: { nombre: `${cotizacion.client.nombre.toUpperCase()}`, telefono: '3165519920', direccion: cotizacion.client.direccion.toUpperCase(), ciudad: cotizacion.client.ciudad.toUpperCase() },
                condiciones: { validez: '30', formaPago: cotizacion.condicionesPago ? cotizacion.condicionesPago.nombre.toUpperCase() : null },
                areas: [
                    { 
                    nombre: 'Recepción',
                    productos: [
                        { referencia: 'R001', descripcion: 'Mostrador blanco', cantidad: 1, valorUnitario: 1500000, subtotal: 1500000 },
                        { referencia: 'R002', descripcion: 'Silla visitante', cantidad: 2, valorUnitario: 450000, subtotal: 900000 },
                    ],
                    totalArea: 2400000,
                    },
                ],
                totales: {
                    subtotal: 2400000,
                    descuento: 0,
                    subtotalConDescuento: 2400000,
                    iva: 456000,
                    total: 2856000,
                },
            };

            const response = await axios.post('/api/cotizacion/generatePdf', { data }, {
            responseType: 'blob', // 👈 necesario para recibir el PDF como binario
            })
            .then((res) => {
                setLoading(false)
                return res;
            })

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'cotizacion.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
            dispatch(actions.HandleAlerta('PDF GENERADO', 'positive'))

        }catch(error){
            console.log(error) 
            dispatch(actions.HandleAlerta('No hemos logrado generar pdf', 'mistake'))
            if (error.response) {
            console.log('➡️ Detalles:', error.response.data);
            console.log('📦 Status:', error.response.status);
    }
        }
    }
    return ( 
        <div className="modal"  style={{zIndex:10}}>
            <div className="hiddenModal" onClick={() => {
                params.delete('watch');
                setParams(params);
            }}></div>
            {
                !cotizacion || loadingCotizacion ?
                    <h1 style={{zIndex:10}}>Cargando cotización...</h1>
                : 
                cotizacion == 404 || cotizacion == 'notrequest' ? <h1>No carga</h1> : 
                <div className="containerModal Large" style={{width:'90%'}}>
                    <div className="cotizacionBody" id="cotizacion-pdf">
                        <div className="top">
                            <img src="https://metalicascosta.com.co/assets/img/logo_metalicas_costa.png" alt="" />
                        </div>
                        <div className="cotizacionFuente">
                            <div className="topCoti">
                                <div className="divideTop">
                                    <div className="left">
                                        <h1>MODULARES COSTA GOMEZ SAS</h1>
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
                                            <h4> 3739940</h4>
                                        </div>
                                    </div>
                                    <div className="left" style={{width:'55%'}}>
                                        <div className="item">
                                            <h3>
                                                NRO. COTIZACIÓN:
                                            </h3>
                                            <h4> MDC-CV-{Number(21719)+Number(cotizacion.id)}</h4>
                                        </div>
                                        <div className="item">
                                            <h3>
                                                FECHA:
                                            </h3>
                                            <h4>{cotizacion.time ? cotizacion.time.split('T')[0] : 0}</h4>
                                        </div>
                                        <div className="item">
                                            <h3>
                                                ASESOR COMERCIAL:
                                            </h3>
                                            <h4>{cotizacion.user.name.toUpperCase()} {cotizacion.user.lastName.toUpperCase()}</h4>
                                        </div>
                                        <div className="item">
                                            <h3>
                                                CORREO DEL ASESOR:
                                            </h3>
                                            <h4>{cotizacion.user.email.toUpperCase()}</h4>
                                        </div>
                                        <div className="item">
                                            <h3>
                                                TELÉFONO DEL ASESOR:
                                            </h3>
                                            <h4>{cotizacion.user.phone.toUpperCase()}</h4>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                            <div className="clientTopData">
                                <div className="divideTopData">
                                    <div className="left">
                                        <div className="item">
                                            <h3>
                                                CLIENTE:
                                            </h3>
                                            <h4> {cotizacion.client.nombre.toUpperCase()}</h4>
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
                                            <h4> {cotizacion.client.ciudad.toUpperCase()}</h4>
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
                                    <div className="left" style={{width:'55%'}}>
                                        
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
                                        <div className="item">
                                            <h3>
                                                VALIDEZ DE LA OFERTA:
                                            </h3>
                                            <h4>{cotizacion.days} DÍAS</h4>
                                        </div>
                                        <div className="item">
                                            <h3>
                                                FORMA DE PAGO:
                                            </h3>
                                            <h4>
                                                {
                                                    cotizacion.condicionesPago ?
                                                        cotizacion.condicionesPago.nombre.toUpperCase()
                                                    :null
                                                }
                                            </h4>
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

                                <div className="tableData">
                                    {
                                        cotizacion.areaCotizacions?.length ?
                                            cotizacion.areaCotizacions.map((area, i) => {
                                                let a = 0;
                                                return (
                                                    <div className="tabla">
                                                        <h4>{area.name.toUpperCase()}</h4>
                                                        <table key={i+1}>
                                                            <thead>
                                                                <tr>
                                                                    <th className='left Small'>REFERENCIA</th>
                                                                    <th className='left Longer'>DESCRIPCIÓN</th>
                                                                    <th className="Cantidad">CANTIDAD</th>
                                                                    <th className="Valor">VALOR UNITARIO</th>
                                                                    <th className="Valor">SUBTOTAL</th>
                                                                    {/* <th>Descuento</th> */}
                                                                    {/* <th>IVA</th> */}
                                                                    {/* <th>Antes de IVA</th> */}
                                                                    {/* <th>Total</th> */}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    area && area.kits?.length || area.armados?.length || area.productoCotizacions?.length ? 
                                                                        area.productoCotizacions.concat(area.serviciosCotizados).concat(area.kits).concat(area.armados).map((it,i) => {

                                                                        const itemsDelArea = area.productoCotizacions.concat(area.serviciosCotizados).concat(area.kits).concat(area.armados);
                                                                        // 1. Función auxiliar para calcular el precio total de cualquier item
                                                                        const calcularPrecioTotal = (item) => {
                                                                            let precioBase = 0;
                                                                            let descuento = 0;

                                                                            if (item.kitCotizacion) {
                                                                                precioBase = Number(item.kitCotizacion.precio);
                                                                                descuento = Number(item.kitCotizacion.descuento);
                                                                            } else if (item.armadoCotizacion) {
                                                                                precioBase = Number(item.armadoCotizacion.precio);
                                                                                descuento = Number(item.armadoCotizacion.descuento);
                                                                            } else if (item.cantidad) { // Para productos y servicios
                                                                                precioBase = Number(item.precio);
                                                                                descuento = Number(item.descuento);
                                                                            }

                                                                            const subtotal = precioBase;
                                                                            // Asumo un IVA del 19% basado en el cálculo de tu columna TOTAL
                                                                            return subtotal;
                                                                        };

                                                                        // 2. Usa .reduce() para sumar los totales y obtener el subtotal del área
                                                                        a = itemsDelArea.reduce((acumulador, itemActual) => {
                                                                            // A la suma acumulada, le añade el precio total del item actual
                                                                            return acumulador + calcularPrecioTotal(itemActual);
                                                                        }, 0); // El '0' es el valor inicial del acumulador
                                                                                        
                                                                                    
                                                                            return (
                                                                                <tr key={i+1}>
                                                                                    
                                                                                    
                                                                                    { // ID
                                                                                        it.kitCotizacion ?
                                                                                            <td className='left Small'>0{it.id}</td>
                                                                
                                                                                        :
                                                                                        it.cantidad && it.service ?
                                                                                            <td className='left Small'>SV{it.id}</td>
                                                                                        :
                                                                                        it.cantidad && it.producto ?
                                                                                            <td className='left Small'>PT{it.id}</td>
                                                                                        :
                                                                                        <td className='left Small'>SP{it.id}</td>
                                                                                    }
                                                                                    { // NOMBRE
                                                                                        it.cantidad && it.producto ?
                                                                                            <td className='left Longer'>{it.producto.item.toUpperCase()} {it.medida && (`| ${it.medida}`)}</td>
                                                                                        :
                                                                                        it.cantidad && it.service ?
                                                                                            <td className='left Longer'>{it.service.name.toUpperCase()}</td>
                                                                                        :
                                                                                        it.armadoCotizacion ?
                                                                                            <td className="left Longer">{it.name.toUpperCase()}</td>
                                                                                        :
                                                                                            <td className='left Longer'> {it.name.toUpperCase()} - {it.extension.name.toUpperCase()} </td>
                                                                                    }
                                                                                    { // CANTIDAD
                                                                                        it.kitCotizacion ?
                                                                                        <td className="Cantidad">{it.kitCotizacion.cantidad}</td>
                                                                                        :
                                                                                        it.cantidad && it.producto ?
                                                                                        <td className="Cantidad" >{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.cantidad).toFixed(0))}</td>
                                                                                        :
                                                                                        it.cantidad && it.service ?
                                                                                        <td className="Cantidad">{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.cantidad).toFixed(0))}</td>
                                                                                        :
                                                                                        <td className="Cantidad">{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.armadoCotizacion.cantidad).toFixed(0))}</td>
                                                                                    } 
                                                                                    

                                                                                    { // VALOR UNITARIO
                                                                                        it.kitCotizacion ?
                                                                                        <td className="Valor">{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number((it.kitCotizacion.precio) / it.kitCotizacion.cantidad).toFixed(0))}</td>
                                                                                        :
                                                                                        it.cantidad ?
                                                                                        <td className="Valor">{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number((it.precio) / it.cantidad).toFixed(0))}</td>
                                                                                        :
                                                                                        <td className="Valor">{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number((it.armadoCotizacion.precio) / it.armadoCotizacion.cantidad).toFixed(0))}</td>
                                                                                    }
                                                                                    {   // SUB TOTAL 1
                                                                                        // it.kitCotizacion ?
                                                                                        // <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.kitCotizacion.precio).toFixed(0))} </td>
                                                                                        // :
                                                                                        // it.cantidad ?
                                                                                        // <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.precio).toFixed(0))} </td>
                                                                                        // :
                                                                                        // <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.armadoCotizacion.precio).toFixed(0))} </td>
                                                                                    
                                                                                    }
                                                                                    { // DESCUENTOS
                                                                                        // it.kitCotizacion ?
                                                                                        // <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(it.kitCotizacion.descuento)}</td>
                                                                                        // :
                                                                                        //  it.cantidad ?
                                                                                        // <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(it.descuento)}</td>
                                                                                        // :
                                                                                        // <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.armadoCotizacion.descuento).toFixed(0))}</td>
                                                                                    }
                                                                                    { // IVA
                                                                                        // it.kitCotizacion ?
                                                                                        // <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(Number(it.kitCotizacion.precio - it.kitCotizacion.descuento).toFixed(0) * (0.19)).toFixed(0))}</td>
                                                                                        // : 
                                                                                        //  it.cantidad ?
                                                                                        // <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(Number(it.precio - it.descuento).toFixed(0) * (0.19)).toFixed(0))}</td>
                                                                                        // :
                                                                                        // <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(Number(it.armadoCotizacion.precio - it.armadoCotizacion.descuento) * (0.19)).toFixed(0))}</td>
                                                                                    
                                                                                    }
                                                                                    
                                                                                    { // ANTES DE IVA
                                                                                        //     it.kitCotizacion ?
                                                                                        //     <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.kitCotizacion.precio - it.kitCotizacion.descuento).toFixed(0))}</td>
                                                                                        //     :
                                                                                        //      it.cantidad ?
                                                                                        //     <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.precio - it.descuento).toFixed(0))}</td>
                                                                                        //     :
                                                                                        //     <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.armadoCotizacion.precio  - it.armadoCotizacion.descuento).toFixed(0))}</td>
                                                                                    }

                                                                                    { // TOTAL
                                                                                        it.kitCotizacion ?
                                                                                        <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.kitCotizacion.precio).toFixed(0))}</td>
                                                                                        :
                                                                                         it.cantidad ?
                                                                                        <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.precio).toFixed(0))}</td>
                                                                                        :
                                                                                        <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.armadoCotizacion.precio).toFixed(0))}</td>
                                                                                    
                                                                                    }
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    : null
                                                                }
                                                                
                                                                
                                                            </tbody>
                                                            <thead>
                                                                <tr>
                                                                    <th></th>
                                                                    <th></th>
                                                                    <th></th>
                                                                    <th></th>
                                                                    <th>VALOR ÁREA</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                
                                                                <tr>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(a).toFixed(0))}</td>
                                                                </tr>
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
                                                    <th>SUBTOTAL INICIAL</th>
                                                    <th>DESCUENTO</th>
                                                    <th>SUBTOTAL CON DESCUENTO</th>
                                                    <th>VALOR IVA</th>
                                                    <th>TOTAL</th>
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
                        <button onClick={exportToPDF}>
                            <span>Descargar</span>
                        </button>

                        <button onClick={() => {
                            if(!loading){
                                getPDF()
                            }
                        }}>
                            <span>{loading ? 'Generando pdf' : 'Descarga liviana'}</span>
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
    const suma = area.productoCotizacions?.reduce((accKit, kit) => {
            return accKit + Number(kit.precio || 0);
        }, 0) || 0;
        return accArea + suma;
    }, 0) || 0;


    const valorServicios = cotizacion.areaCotizacions?.reduce((accArea, area) => {
    const suma = area.serviciosCotizados?.reduce((accKit, kit) => {
            return accKit + Number(kit.precio || 0);
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
    const suma = area.productoCotizacions?.reduce((accKit, kit) => {
            return accKit + Number(kit.descuento || 0);
        }, 0) || 0;
        return accArea + suma;
    }, 0) || 0;

    const descuentoServicios = cotizacion.areaCotizacions?.reduce((accArea, area) => {
    const suma = area.serviciosCotizados?.reduce((accKit, kit) => {
            return accKit + Number(kit.descuento || 0);
        }, 0) || 0;
        return accArea + suma; 
    }, 0) || 0;

    const sumaDescuento = descuentoKits + descuentoArmados + descuentoProductos + descuentoServicios;
    const subTotal = valorKits + valorArmados + valorProductos + valorServicios;
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