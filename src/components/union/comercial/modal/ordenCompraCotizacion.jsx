import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import * as actions from '../../../store/action/action';

export default function OrdenCompraCotizacion(){
    const [params, setParams] = useSearchParams(); 
    const cotizacionn = useSelector(store => store.cotizacions);
    const { cotizacion, loadingCotizacion } = cotizacionn;
    const [municipio, setMuni] = useState(null);
    const [fechaEntrega, setFechaEntrega] = useState('');
    const [nota, setNota] = useState('');
    const [loading, setLoading] = useState(false);
    const [generandoPDF, setGenerandoPDF] = useState(false);
    const dispatch = useDispatch();

    const exportToPDF = () => {
        const input = document.getElementById("orden-compra-pdf");
        const originalHeight = input.style.height;
        const originalOverflow = input.style.overflow;

        input.style.height = 'auto';
        input.style.overflow = 'visible';
        setGenerandoPDF(true);

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

                pdf.save(`orden-compra-${cotizacion.client.nombre}-CV${Number(21719)+Number(cotizacion.id)}.pdf`);

                input.style.height = originalHeight;
                input.style.overflow = originalOverflow;
                setGenerandoPDF(false);
                dispatch(actions.HandleAlerta('Orden de compra generada', 'positive'));
            });
        }, 100);
    };

    const getMun = async (codigo) => {
        try {
            const res = await axios.get(`https://www.datos.gov.co/resource/gdxc-w37w.json`, {
                params: {
                    cod_mpio: codigo
                }
            });

            if (res.data.length > 0) {
                const municipio = res.data[0];
                const resultado = {
                    nombre: municipio.nom_mpio,
                    codigo: municipio.cod_mpio,
                    departamento: municipio.dpto,
                    cod_departamento: municipio.cod_dpto
                };
                setMuni(resultado);
                return resultado;
            } else {
                const resultado = {
                    nombre: null
                }
                setMuni(resultado);
            }
        } catch (error) {
            console.error("Error consultando municipio:", error);
            return null;
        }
    };

    useEffect(() => {
        if(cotizacion && cotizacion.client.ciudad){
            getMun(cotizacion.client.ciudad);
        }
    }, [cotizacion]);

    return ( 
        <div className="modal" style={{zIndex:11}}> 
            <div className="hiddenModal" style={{backgroundColor: 'rgba(0, 0, 0, 0.75)'}} onClick={() => {
                params.delete('ordenCompra');
                setParams(params);
            }}></div>
            {
                !cotizacion || loadingCotizacion ?
                    <h1 style={{zIndex:11}}>Cargando cotización...</h1>
                : 
                !cotizacion || cotizacion == 404 || cotizacion == 'notrequest' ? <h1>No carga</h1> : 
                <div className="containerModal Large" style={{width:'90%'}}>
                    <div className="cotizacionBody" id="orden-compra-pdf">
                        <div className="top">
                            <img src="https://metalicascosta.com.co/assets/img/logo_metalicas_costa.png" alt="" />
                        </div>
                        <div className="cotizacionFuente">
                            <div style={{textAlign:'center', marginBottom:'20px'}}>
                                <h1 style={{fontSize:'24px', fontWeight:'bold'}}>ORDEN DE COMPRA</h1>
                            </div>

                            <div className="topCoti">
                                <div className="divideTop">
                                    <div className="left">
                                        <div className="item">
                                            <h3>NOMBRE / RAZÓN SOCIAL:</h3>
                                            <h4>{cotizacion.client.nombre.toUpperCase()}</h4>
                                        </div>
                                        <div className="item">
                                            <h3>IDENTIFICACIÓN / NIT:</h3>
                                            <h4>{cotizacion.client.nit}</h4>
                                        </div>
                                        <div className="item">
                                            <h3>DIRECCIÓN:</h3>
                                            <h4>{cotizacion.client.direccion.toUpperCase()}</h4>
                                        </div>
                                        <div className="item">
                                            <h3>CORREO:</h3>
                                            <h4>{cotizacion.client.email ? cotizacion.client.email.toUpperCase() : 'N/A'}</h4>
                                        </div>
                                    </div>
                                    <div className="left" style={{width:'55%'}}>
                                        <div className="item">
                                            <h3>NÚMERO DE ORDEN DE COMPRA:</h3>
                                            <h4>CV{Number(21719)+Number(cotizacion.id)}</h4>
                                        </div>
                                        <div className="item">
                                            <h3>TELÉFONO:</h3>
                                            <h4>
                                                {cotizacion.client.fijos && cotizacion.client.fijos.length ?
                                                    cotizacion.client.fijos.map((ph, i) => (
                                                        <span key={i+1}>{ph}<br /></span>
                                                    ))
                                                : 'N/A'}
                                            </h4>
                                        </div>
                                        <div className="item">
                                            <h3>FECHA:</h3>
                                            <h4>{cotizacion.time ? cotizacion.time.split('T')[0] : ''}</h4>
                                        </div>
                                        <div className="item">
                                            <h3>CIUDAD:</h3>
                                            <h4>{municipio ? municipio.nombre : 'N/A'}</h4>
                                        </div>
                                    </div> 
                                </div>
                            </div>

                            <div className="referencias" style={{marginTop:'30px'}}>
                                <div className="tableData">
                                    {
                                        cotizacion.areaCotizacions?.length ?
                                            cotizacion.areaCotizacions.map((area, i) => {
                                                let a = 0;
                                                return (
                                                    <div className="tabla" key={i+1}>
                                                        <h4>{area.name.toUpperCase()}</h4>
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th className='left Small'>REFERENCIA</th>
                                                                    <th className='left Longer'>DESCRIPCIÓN</th>
                                                                    <th className="Cantidad">CANTIDAD</th>
                                                                    <th className="Valor">VALOR UNITARIO</th>
                                                                    <th className="Valor">SUBTOTAL</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    area && (area.kits?.length || area.serviciosCotizados?.length || area.armados?.length || area.productoCotizacions?.length) ? 
                                                                        area.productoCotizacions.concat(area.serviciosCotizados).concat(area.kits).concat(area.armados).map((it,i) => {
                                                                            const itemsDelArea = area.productoCotizacions.concat(area.serviciosCotizados).concat(area.kits).concat(area.armados);
                                                                            
                                                                            const calcularPrecioTotal = (item) => {
                                                                                let precioBase = 0;
                                                                                let descuento = 0;

                                                                                if (item.kitCotizacion) {
                                                                                    precioBase = Number(item.kitCotizacion.precio);
                                                                                    descuento = Number(item.kitCotizacion.descuento);
                                                                                } else if (item.armadoCotizacion) {
                                                                                    precioBase = Number(item.armadoCotizacion.precio);
                                                                                    descuento = Number(item.armadoCotizacion.descuento);
                                                                                } else if (item.cantidad) {
                                                                                    precioBase = Number(item.precio);
                                                                                    descuento = Number(item.descuento);
                                                                                }

                                                                                const subtotal = precioBase;
                                                                                return subtotal;
                                                                            };

                                                                            a = itemsDelArea.reduce((acumulador, itemActual) => {
                                                                                return acumulador + calcularPrecioTotal(itemActual);
                                                                            }, 0);
                                                                                        
                                                                            return (
                                                                                <tr key={i+1}>
                                                                                    {it.kitCotizacion ?
                                                                                        <td className='left Small'>{it.id}</td>
                                                                                    :
                                                                                    it.cantidad && it.service ?
                                                                                        <td className='left Small'>SV{it.service.id}</td>
                                                                                    :
                                                                                    it.cantidad && it.producto ?
                                                                                        <td className='left Small'>PT{it.producto.id}</td>
                                                                                    :
                                                                                        <td className='left Small'>SP{it.id}</td>
                                                                                    }
                                                                                    {it.cantidad && it.producto ?
                                                                                        <td className='left Longer'>{it.producto.item.toUpperCase()} {it.medida && (`| ${it.medida}`)}</td>
                                                                                    :
                                                                                    it.cantidad && it.service ?
                                                                                        <td className='left Longer'>{it.service.name.toUpperCase()} - {it.service ? it.service.description.toUpperCase() : null}</td>
                                                                                    :
                                                                                    it.armadoCotizacion ?
                                                                                        <td className="left Longer">{it.name.toUpperCase()}</td>
                                                                                    :
                                                                                        <td className='left Longer'> {it.name.toUpperCase()} {it.state == `${it.extension.name.toUpperCase()}` ? null : `- ${it.extension.name.toUpperCase()}`} </td>
                                                                                    }
                                                                                    {it.kitCotizacion ?
                                                                                        <td className="Cantidad">{it.kitCotizacion.cantidad} </td>
                                                                                    :
                                                                                    it.cantidad && it.producto ?
                                                                                        <td className="Cantidad" >{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.cantidad).toFixed(0))}</td>
                                                                                    :
                                                                                    it.cantidad && it.service ?
                                                                                        <td className="Cantidad">{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.cantidad).toFixed(0))}</td>
                                                                                    :
                                                                                        <td className="Cantidad">{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(it.armadoCotizacion.cantidad).toFixed(0))}</td>
                                                                                    }
                                                                                    {it.kitCotizacion ?
                                                                                        <td className="Valor">{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number((it.kitCotizacion.precio) / it.kitCotizacion.cantidad).toFixed(0))}</td>
                                                                                    :
                                                                                    it.cantidad ?
                                                                                        <td className="Valor">{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number((it.precio) / it.cantidad).toFixed(0))}</td>
                                                                                    :
                                                                                        <td className="Valor">{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number((it.armadoCotizacion.precio) / it.armadoCotizacion.cantidad).toFixed(0))}</td>
                                                                                    }
                                                                                    {it.kitCotizacion ?
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

                            <div style={{marginTop:'30px', padding:'20px', border: generandoPDF ? 'none' : '1px solid #ddd', borderRadius:'5px'}}>
                                <div style={{marginBottom:'20px'}}>
                                    <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>
                                        FECHA DE ENTREGA:
                                    </label>
                                    {generandoPDF ? (
                                        <div style={{
                                            width:'100%',
                                            padding:'8px',
                                            minHeight:'20px',
                                            fontSize:'14px'
                                        }}>
                                            {fechaEntrega || 'No especificada'}
                                        </div>
                                    ) : (
                                        <input 
                                            type="date" 
                                            value={fechaEntrega}
                                            onChange={(e) => setFechaEntrega(e.target.value)}
                                            style={{
                                                width:'100%',
                                                padding:'8px',
                                                border:'1px solid #ccc',
                                                borderRadius:'4px'
                                            }}
                                        />
                                    )}
                                </div>

                                <div>
                                    <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>
                                        NOTAS ADICIONALES:
                                    </label>
                                    {generandoPDF ? (
                                        <div style={{
                                            width:'100%',
                                            padding:'8px',
                                            minHeight:'100px',
                                            fontSize:'14px',
                                            whiteSpace: 'pre-wrap'
                                        }}>
                                            {nota || 'Sin notas adicionales'}
                                        </div>
                                    ) : (
                                        <textarea 
                                            value={nota}
                                            onChange={(e) => setNota(e.target.value)}
                                            placeholder="Ingrese notas adicionales para la orden de compra..."
                                            style={{
                                                width:'100%',
                                                padding:'8px',
                                                border:'1px solid #ccc',
                                                borderRadius:'4px',
                                                minHeight:'100px',
                                                resize:'vertical'
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="optionDownload" style={{marginTop:'0px'}}>
                        <button onClick={() => {
                            if(!loading){
                                exportToPDF();
                            }
                        }}>
                            <span>{loading ? 'Generando PDF' : 'Descargar Orden de Compra'}</span>
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}

function TotalSub({ cotizacion }){
    const valorKits = cotizacion.areaCotizacions?.reduce((accArea, area) => {
        const suma = area.kits?.reduce((accKit, kit) => {
            return accKit + Number(kit.kitCotizacion?.precio || 0);
        }, 0) || 0;
        return accArea + suma;
    }, 0) || 0;

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
    const valorIva = Number(subTotal - sumaDescuento) * (19 / 100);
    const total = totalSub + valorIva;

    return (
        <tr className='total'>
            <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(subTotal).toFixed(0))} COP</td>
            <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(sumaDescuento).toFixed(0))} COP</td>
            <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(totalSub).toFixed(0))} COP</td>
            <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(valorIva).toFixed(0))} COP</td>
            <td>{new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(total).toFixed(0))} COP</td>
        </tr>
    ) 
}
