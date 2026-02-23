import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../../store/action/action';
import { ItemNecesidad as ItemNecesidadType } from '../types';
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/es";

dayjs.extend(localizedFormat);
dayjs.locale("es");

interface ProveedorDetalle {
    id: number;
    nombre: string;
    inicial: string;
    nit: string;
    telefono: string;
    email: string;
    precioActual: number;
    fechaPrecio: string;
    totalCotizaciones: number;
    ordenesCompra: number;
    tiempoEntrega: string;
}

interface DetalleProveedorProps {
    proveedor: { id: number; nombre: string; inicial: string; precio: number } | null;
    item: ItemNecesidadType | null;
    onClose: () => void;
    onUpdate?: () => void; // Función para recargar datos después de actualizar
}

export default function DetalleProveedor({ proveedor, item, onClose, onUpdate }: DetalleProveedorProps) {
    const [valor, setValor] = useState('');
    const [proveedorData, setProveedorData] = useState<ProveedorDetalle | null>(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const req = useSelector((state: any) => state.requisicion);
    const { proveedoresArray } = req;
    console.log('proveedor', proveedor)
    // Función para cargar los datos del proveedor desde el backend
    const searchProvider = async () => {
        if (!proveedor || !item) return;

        try {
            setLoading(true);
            const body: any = {
                proveedores: [proveedor.id] // Array con un solo ID
            };

            // Determinar endpoint y campo según el tipo
            let endpoint = '';
            if (item.tipo === 'materia-prima') {
                endpoint = '/api/requisicion/post/searchProviders/analisis';
                body.materiumId = item.id;
            } else if (item.tipo === 'producto-terminado') {
                endpoint = '/api/requisicion/post/searchProviders/analisis/productos';
                body.productoId = item.id;
            } else {
                setLoading(false);
                return;
            }


            const response = await axios.post(endpoint, body);
            
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                const pv = response.data[0]; // Tomar el primer resultado (debería ser el único)
                const proveedorBackend = pv.proveedor;
                
                // Obtener precio y fecha
                const precioInfo = item.tipo === 'materia-prima' 
                    ? proveedorBackend?.prices?.[0]
                    : proveedorBackend?.productPrices?.[0];
                
                const precio = precioInfo?.valor || precioInfo?.precio || precioInfo?.price || 0;
                const fechaPrecio = precioInfo?.createdAt || new Date().toISOString();
                const lastUpdate = dayjs(fechaPrecio).format("dddd, D [de] MMMM YYYY, h:mm A");

                // Mapear datos a la estructura esperada
                const proveedorCompleto: ProveedorDetalle = {
                    id: proveedorBackend.id,
                    nombre: proveedorBackend.nombre || proveedor.nombre,
                    inicial: proveedor.inicial || (proveedorBackend.nombre || '?').charAt(0).toUpperCase(),
                    nit: proveedorBackend.nit || 'N/A',
                    telefono: proveedorBackend.phone || proveedorBackend.telefono || 'N/A',
                    email: proveedorBackend.email || 'N/A',
                    precioActual: precio,
                    fechaPrecio: lastUpdate,
                    totalCotizaciones: pv.totalCotizaciones || 0,
                    ordenesCompra: pv.aprobadas || 0,
                    tiempoEntrega: '5 Días' // Valor por defecto, se puede obtener del backend si está disponible
                };

                setProveedorData(proveedorCompleto);
            } else {
                // Si no hay datos del backend, no establecer nada (se mostrará "Cargando...")
                setProveedorData(null);
            }
        } catch (err) {
            console.log(err);
            // En caso de error, no establecer datos (se mostrará "Cargando...")
            setProveedorData(null);
        } finally {
            setLoading(false);
        }
    };

    console.log('proveedoresArray', proveedoresArray)

    // Cargar datos cuando se abre el panel
    useEffect(() => {
        if (proveedor && item) {
            searchProvider();
        }
    }, [proveedor?.id, item?.id]);

    if (!proveedor || !item) return null;
    // Función para actualizar el precio
    const updatePrice = async () => {
        if (!valor || valor.trim() === '') {
            (dispatch as any)(actions.HandleAlerta("Debes ingresar un valor", 'mistake'));
            return;
        }

        const valorNum = Number(valor);
        if (isNaN(valorNum) || valorNum <= 0) {
            (dispatch as any)(actions.HandleAlerta("Debes ingresar un valor válido", 'mistake'));
            return;
        }

        if (!proveedorData) return;
        
        // Obtener el precio actual sin IVA para comparar
        // El precio actual puede venir con IVA, así que lo dividimos por 1.19
        const precioActual = proveedorData.precioActual;
        const precioSinIvaAprox = precioActual / 1.19;
        
        // Verificar si el valor es muy similar al precio actual (con un margen de error)
        if (Math.abs(valorNum - precioSinIvaAprox) < 0.01) {
            (dispatch as any)(actions.HandleAlerta('Debes ingresar un valor diferente', 'mistake'));
            return;
        }

        try {
            // Calcular IVA y total
            const iva = valorNum * 0.19;
            const total = Number(Number(valorNum) + Number(iva)).toFixed(0);

            if (!proveedorData) return;
            
            // Determinar el body según el tipo de item
            const body: any = {
                pvId: proveedorData.id,
                price: total,
                iva,
                descuentos: valorNum,
            };

            // Determinar endpoint y campo según el tipo
            let endpoint = '';
            if (item.tipo === 'materia-prima') {
                endpoint = '/api/mt/price/give';
                body.mtId = item.id;
            } else if (item.tipo === 'producto-terminado') {
                endpoint = '/api/mt/price/pt/give';
                body.productoId = item.id;
            } else {
                (dispatch as any)(actions.HandleAlerta("Tipo de item no válido", 'mistake'));
                return;
            }

            // Enviar la petición
            await axios.post(endpoint, body);
            
            // Mostrar mensaje de éxito
            (dispatch as any)(actions.HandleAlerta("Valor actualizado con éxito", 'positive'));
            
            // Limpiar el input
            setValor('');
            
            // Recargar datos del proveedor desde el backend
            await searchProvider();
            
            // Recargar datos silenciosamente si hay función de actualización
            if (onUpdate) {
                onUpdate();
            }
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || "Error al actualizar el valor";
            (dispatch as any)(actions.HandleAlerta(errorMessage, 'mistake'));
        }
    };

    return (
        <div className={`detalleProveedorPanel ${proveedor ? 'abierto' : ''}`}>
            <div className="detalleProveedorContent">
                {/* Header con botón cerrar */}
                <div className="detalleProveedorHeader">
                    <button className="btnCerrar" onClick={onClose} aria-label="Cerrar">
                        <span>×</span>
                    </button>
                </div>

                {loading || !proveedorData ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>Cargando datos del proveedor...</div>
                ) : (
                    <>
                        {/* Información del proveedor */}
                        <div className="proveedorInfoHeader">
                            <div className="proveedorAvatar">
                                <span>{proveedorData.inicial}</span>
                            </div>
                            <h2 className="proveedorNombre">{proveedorData.nombre}</h2>
                        </div>

                        {/* Datos de contacto */}
                        <div className="proveedorContacto">
                            <div className="contactoItem">
                                <span className="label">NIT:</span>
                                <span className="valor">{proveedorData.nit}</span>
                            </div>
                            <div className="contactoItem">
                                <span className="label">Teléfono:</span>
                                <span className="valor">{proveedorData.telefono}</span>
                            </div>
                            <div className="contactoItem">
                                <span className="label">Email:</span>
                                <span className="valor">{proveedorData.email}</span>
                            </div>
                        </div>

                        {/* Sección de Precio y Valor */}
                        <div className="seccionPrecioValor">
                            <div className="precioActual">
                                <span className="label">Precio actual</span>
                                <h3 className="precio">$ {new Intl.NumberFormat('es-CO').format(proveedorData.precioActual)}</h3>
                                <span className="fecha">{proveedorData.fechaPrecio}</span>
                            </div>
                            <div className="valorInput">
                                <span className="label">Valor</span>
                                <input
                                    type="text"
                                    placeholder="Ej. 250000"
                                    value={valor}
                                    onChange={(e) => setValor(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            updatePrice();
                                        }
                                    }}
                                    className="inputValor"
                                />
                            </div>
                        </div>

                        {/* Análisis rápido */}
                        <div className="seccionAnalisis">
                            <h3>Análisis rápido</h3>
                            <div className="indicadoresAnalisis">
                                <div className="indicador">
                                    <div className="indicadorCirculo">
                                        <span>{proveedorData.totalCotizaciones}</span>
                                    </div>
                                    <span className="indicadorLabel">Total cotizaciones</span>
                                </div>
                                <div className="indicador">
                                    <div className="indicadorCirculo">
                                        <span>{proveedorData.ordenesCompra}</span>
                                    </div>
                                    <span className="indicadorLabel">Ordenes de compra</span>
                                </div>
                                <div className="indicador">
                                    <div className="indicadorCirculo">
                                        <span>{proveedorData.tiempoEntrega}</span>
                                    </div>
                                    <span className="indicadorLabel">Tiempo de entrega Aprox.</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div><br /><br /><br /><br />
        </div>
    );
}
