import React, { useMemo, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../../store/action/action';

export default function LeftItemOpened() {
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const requisicion = useSelector((state: any) => state.requisicion);
    const admin = useSelector((state: any) => state.admin);
    const ids: number[] = requisicion?.requisicionesSeleccionadas || requisicion?.ids || [];
    const itemRequisicion = requisicion?.itemRequisicion;
    const loadingItemRequisicion = !!requisicion?.loadingItemRequisicion;
    const ordenCompra = requisicion?.ordenCompra; // Orden de compra actual
    const openItemId = params.get('openItem');
    const openItemTipo = params.get('openItemTipo') || 'materia'; // materia | producto

    // Estado para movimiento actual
    const [movimientoActual, setMovimientoActual] = useState(0);
    const [inputMovimiento, setInputMovimiento] = useState('0');
    
    // Inicializar el input con el valor del movimiento cuando cambia
    useEffect(() => {
        setInputMovimiento(movimientoActual.toString());
    }, [movimientoActual]);

    // Estado para proyectos (edición individual)
    const [proyectosEditando, setProyectosEditando] = useState<{ [key: number]: boolean }>({});
    const [proyectosValores, setProyectosValores] = useState<{ [key: number]: string }>({});

    // Estado para detalles de compra
    const [precioCompra, setPrecioCompra] = useState('0');
    const [descuentoCompra, setDescuentoCompra] = useState('0');
    const [actualizarPrecioProveedor, setActualizarPrecioProveedor] = useState(false);
    const [precioEditadoManualmente, setPrecioEditadoManualmente] = useState(false);
    const [loading, setLoading] = useState(false);

    // Cargar item cuando cambia openItem (misma lógica de getAllProducts.jsx)
    // useEffect(() => {
    //     if (!openItemId) return;
    //     if (!ids || ids.length === 0) return;

    //     const endpoint =
    //         openItemTipo === 'producto'
    //             ? '/api/requisicion/get/materiales/producto/'
    //             : '/api/requisicion/get/materiales/materia/';

    //     (dispatch as any)(actions.gettingItemRequisicion(true));
    //     const body = { mpId: Number(openItemId), ids };

    //     axios
    //         .post(endpoint, body)
    //         .then((res) => {
    //             (dispatch as any)(actions.getItemRequisicion(res.data));
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             (dispatch as any)(actions.getItemRequisicion(404));
    //         })
    //         .finally(() => {
    //             (dispatch as any)(actions.gettingItemRequisicion(false));
    //         });
    // }, [openItemId, openItemTipo, ids, dispatch]);

    const data = itemRequisicion && itemRequisicion !== 404 ? itemRequisicion : null;
    const isProducto = itemRequisicion?.itemRequisicions[0]?.productoId || false;

    console.log('datos producto', data ); 

    const producto = useMemo(() => {
        if (!data) {
            return {
                id: openItemId ? Number(openItemId) : 0,
                nombre: 'Cargando...',
                codigo: '',
                medidaOriginal: '',
                precioActual: 0,
                fechaPrecio: ''
            };
        }
        
        const nombre = isProducto ? (data.item || data.name || '') : (data.description || data.name || '');
        const medida = data.medida || '';
        const unidad = data.unidad || '';
        
        // Obtener precio del proveedor - código simple
        let precioActual = 0;
        let fechaPrecio = '';
        
        if (ordenCompra) {
            const proveedorId = ordenCompra.proveedorId || ordenCompra.proveedor?.id;
            
            if (proveedorId) {
                // Buscar precio del proveedor
                if (isProducto) {
                    const priceFound = data.productPrices?.find((p: any) => p.proveedorId == proveedorId);
                    if (priceFound) {
                        if(unidad == 'mt2'){

                            precioActual = Number((Number(priceFound.valor || priceFound.precio || priceFound.price || 0) * data?.itemRequisicions[0]?.medida).toFixed(0));
                            fechaPrecio = priceFound.updatedAt || priceFound.createdAt || '';
                        }else{
                            precioActual = Number(priceFound.valor || priceFound.precio || priceFound.price || 0);
                            fechaPrecio = priceFound.updatedAt || priceFound.createdAt || '';
                        }
                        
                    }
                } else {
                    const priceFound = data.prices?.find((p: any) => p.proveedorId == proveedorId);
                    if (priceFound) {
                        const precioCaja = Number(priceFound.valor || priceFound.precio || priceFound.price || 0);
                        // Para kg: dividir precio de la caja por cantidad de kilos para obtener precio por kilo
                        if (unidad === 'kg') {
                            const medidaKg = Number(data.itemRequisicions[0]?.medida || 1);
                            precioActual = medidaKg > 0 ? precioCaja / medidaKg : precioCaja;
                        } else {
                            precioActual = precioCaja;
                        }
                        fechaPrecio = priceFound.updatedAt || priceFound.createdAt || '';
                    }
                }
            }
        }
        
        return {
            id: Number(data.id || openItemId || 0),
            nombre,
            codigo: String(data.id || ''),
            medidaOriginal: `${medida}${unidad ? ` ${unidad}` : ''}`,
            precioActual: precioActual,
            fechaPrecio: fechaPrecio ? String(fechaPrecio).split('T')[0] : '',
            medida: data?.itemRequisicions[0]?.medida || ''
        };
    }, [data, isProducto, openItemId, ordenCompra]);

    // Proveedor - código simple
    const proveedor = useMemo(() => {
        if (ordenCompra?.proveedor) {
            const prov = ordenCompra.proveedor;
            return {
                nombre: prov.nombre || prov.name || '',
                nit: prov.nit || '',
                email: prov.email || '',
                telefono: prov.telefono || prov.phone || ''
            };
        }
        return { nombre: '', nit: '', email: '', telefono: '' };
    }, [ordenCompra]);

    // Calcular el total de movimientos: suma de todas las cantidades dividido por la medida, restando lo ya entregado
    const movimientoTotal = useMemo(() => {
        if (!data || !Array.isArray(data.itemRequisicions) || data.itemRequisicions.length === 0) {
            return 0;
        }
        
        const unidad = data.unidad || data.itemRequisicions[0]?.unidad || '';
        
        // Sumar todas las cantidades necesarias
        const sumaCantidades = data.itemRequisicions.reduce((sum: number, it: any) => {
            return sum + Number(it.cantidad || 0);
        }, 0);
        
        // Sumar todo lo ya entregado/comprado
        const sumaEntregado = data.itemRequisicions.reduce((sum: number, it: any) => {
            return sum + Number(it.cantidadEntrega || it.entregado || it.comprado || 0);
        }, 0);
        
        // Calcular el faltante
        const faltante = sumaCantidades - sumaEntregado;
        
        // Para kg: faltante ya está en kg, no dividir por medida
        // Para mt2, mt, unidades: dividir por medida para obtener cantidad de piezas
        let resultado: number;
        if (unidad === 'kg') {
            resultado = Math.max(0, faltante);
        } else {
        const medida = Number(data.itemRequisicions[0]?.medida || 1);
            resultado = medida > 0 ? Math.max(0, faltante) / medida : 0;
        }
        
        // Si el resultado es menor que 0, llevarlo a 0
        if (resultado < 0) {
            resultado = 0;
        }
        // Si el resultado tiene decimales, llevarlo al próximo entero (solo para mt2, mt, unidades)
        else if (unidad !== 'kg' && resultado % 1 !== 0) {
            resultado = Math.ceil(resultado);
        }
        
        return resultado;
    }, [data]);

    const movimientoTotalProducto = useMemo(() => {
        if (!data?.itemRequisicions?.length) return 0;
    
        const it = data.itemRequisicions[0];
    
        const totalNecesario = Number(it.cantidad || 0);
        const totalComprado =
            Number(it.cantidadEntrega || it.entregado || it.comprado || 0);
    
        let faltante = totalNecesario - totalComprado;
    
        if (faltante < 0) faltante = 0;
    
        return faltante;
    }, [data]);

    const movimiento = {
        actual: movimientoActual,
        total: movimientoTotal
    };

    const proyectosBase = useMemo(() => {
        if (!data || !Array.isArray(data.itemRequisicions)) return [];
        return data.itemRequisicions.map((it: any) => {
            const r = it.requisicion || {};
            const total = Number(it.cantidad || 0);
            const actual = Number(it.cantidadEntrega || 0);
            let faltante = Math.max(0, total - actual);
            // Si el faltante es menor a 0.09, considerarlo como 0 (ya está comprado)
            if (faltante < 0.09) {
                faltante = 0;
            }
            return {
                id: Number(r.id || it.requisicionId || 0),
                nombre: r.nombre || r.name || `Proyecto ${r.id || it.requisicionId}`,
                estado: r.estado || r.state || 'pendiente',
                actual,
                total,
                faltante
            };
        }).filter((p: any) => p.id);
    }, [data]);

    const medida = producto.medida || '';
    // Inicializar valores editables por proyecto (solo si no existe aún)
    useEffect(() => {
        if (!proyectosBase.length) return;
        setProyectosValores((prev) => {
            const next = { ...prev };
            proyectosBase.forEach((p: any) => {
                if (next[p.id] === undefined) next[p.id] = String(p.actual);
            });
            return next;
        });
    }, [proyectosBase]);

    // Resetear el input a 0 cuando el total sea menor o igual a 0.09 (ya está todo comprado)
    useEffect(() => {
        const total = isProducto ? movimientoTotalProducto : movimientoTotal;
        if (total <= 0.09) {
            setInputMovimiento('0');
            setMovimientoActual(0);
        }
    }, [isProducto, movimientoTotal, movimientoTotalProducto]);

    const proyectosData = useMemo(() => {
        return proyectosBase.map((p: any) => ({
            ...p,
            actual: proyectosValores[p.id] !== undefined ? (parseFloat(proyectosValores[p.id]) || 0) : p.actual
        }));
    }, [proyectosBase, proyectosValores]);

    // Calcular cantidad a repartir (lo que sobra después de la repartición)
    const cantidadRepartir = useMemo(() => {
        if (!data || !Array.isArray(data.itemRequisicions) || data.itemRequisicions.length === 0) {
            return 0;
        }
        
        const unidad = data.unidad || data.itemRequisicions[0]?.unidad || '';
        const medida = Number(data.itemRequisicions[0]?.medida || 1);
        
        // Para kg: movimientoActual ya es en kg (no multiplicar)
        // Para mt2, mt, unidades: multiplicar por medida (cantidad de piezas * medida por pieza)
        const cantidadDisponible = unidad === 'kg' 
            ? movimientoActual 
            : movimientoActual * medida;
        
        // Calcular cuánto se ha repartido EN ESTE MOVIMIENTO (diferencia entre valores actuales y valores base)
        let cantidadRepartidaEnEsteMovimiento = 0;
        proyectosData.forEach((proyecto) => {
            // Buscar el valor base original antes de este movimiento
            const proyectoBase = proyectosBase.find((p: any) => p.id === proyecto.id);
            const valorOriginal = proyectoBase?.actual || 0;
            const valorActual = proyecto.actual || 0;
            // Solo contar la diferencia (lo nuevo repartido)
            cantidadRepartidaEnEsteMovimiento += Math.max(0, valorActual - valorOriginal);
        });
        
        const sobrante = cantidadDisponible - cantidadRepartidaEnEsteMovimiento;
        return Math.max(0, sobrante);
    }, [movimientoActual, proyectosData, proyectosBase, data]);


    const cantidadRepartirProductoTerminado = useMemo(() => {
        if (!data?.itemRequisicions?.length) return 0;
    
        // Cantidad de piezas ingresadas en este movimiento
        const cantidadIngresada = movimientoActual;
    
        // Lo que ya estaba repartido ANTES de este movimiento (valores base originales)
        const yaRepartidoAntes = proyectosBase.reduce(
            (sum, p) => sum + Number(p.actual || 0),
            0
        );
    
        // Lo que está repartido DESPUÉS de este movimiento (valores actuales)
        const repartidoDespues = proyectosData.reduce(
            (sum, p) => sum + Number(p.actual || 0),
            0
        );
    
        // Lo que se repartió en este movimiento = diferencia entre después y antes
        const repartidoEnEsteMovimiento = repartidoDespues - yaRepartidoAntes;
    
        // El sobrante es lo ingresado menos lo repartido
        const sobrante = cantidadIngresada - repartidoEnEsteMovimiento;
    
        return Math.max(0, sobrante);
    }, [data, proyectosData, proyectosBase, movimientoActual]);
    
    
    

    // Calcular precio automático: cantidad en zona de movimientos * precio del producto
    const precioAutomatico = useMemo(() => {
        const cantidad = movimientoActual; // El número entero ingresado en zona de movimientos
        const precio = producto.precioActual || 0;
        
        return cantidad * precio;
    }, [movimientoActual, producto.precioActual]);

    // Funciones para formatear y parsear números con separadores de miles (definidas antes de usarse)
    const formatearNumero = useCallback((valor: string | number): string => {
        // Remover separadores existentes y parsear
        const numero = typeof valor === 'string' 
            ? parseFloat(valor.replace(/\./g, '').replace(',', '.')) || 0
            : valor;
        
        // Formatear con separadores de miles (punto) y decimales (coma)
        const partes = numero.toFixed(2).split('.');
        const parteEntera = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return `${parteEntera},${partes[1]}`;
    }, []);

    const parsearNumero = useCallback((valor: string): number => {
        // Remover separadores de miles (puntos) y convertir coma a punto para decimales
        const numeroLimpio = valor.replace(/\./g, '').replace(',', '.');
        return parseFloat(numeroLimpio) || 0;
    }, []);

    // Actualizar precio automáticamente cuando cambia el cálculo, solo si no fue editado manualmente
    useEffect(() => {
        if (!precioEditadoManualmente) {
            setPrecioCompra(formatearNumero(precioAutomatico));
        }
    }, [precioAutomatico, precioEditadoManualmente, formatearNumero]);

    // Calcular precio total con descuento
    const precioTotal = useMemo(() => {
        const precio = parsearNumero(precioCompra);
        const descuento = parsearNumero(descuentoCompra);
        return Math.max(0, precio - descuento);
    }, [precioCompra, descuentoCompra, parsearNumero]);

    // Función para repartir automáticamente las cantidades
    const repartirCantidades = useCallback((cantidadEntera: number) => {
        if (!data || !Array.isArray(data.itemRequisicions) || data.itemRequisicions.length === 0) {
            return;
        }

        const unidad = data.unidad || data.itemRequisicions[0]?.unidad || '';

        // Para producto terminado, siempre repartir por piezas (sin multiplicar por medida)
        // Para materia prima con kg: cantidadEntera ya es en kg (no multiplicar)
        // Para materia prima con mt2, mt, unidades: multiplicar por medida (cantidad de piezas * medida por pieza)
        const cantidadDisponible = isProducto 
            ? cantidadEntera 
            : unidad === 'kg'
                ? cantidadEntera  // Para kg: usar directamente
                : cantidadEntera * Number(data.itemRequisicions[0]?.medida || 1);
        
        // Empezar desde los valores base originales (no los modificados manualmente)
        const nuevosValores: { [key: number]: string } = {};
        proyectosBase.forEach((proyecto) => {
            nuevosValores[proyecto.id] = String(proyecto.actual || 0);
        });
        
        let cantidadRestante = cantidadDisponible;
        
        // Repartir en orden de los proyectos
        proyectosBase.forEach((proyecto) => {
            const actualActual = Number(nuevosValores[proyecto.id]) || 0;
            let faltante = Math.max(0, proyecto.total - actualActual);
            
            // Si el faltante es menor a 0.09, considerarlo como 0 (ya está comprado)
            if (faltante < 0.09) {
                faltante = 0;
            }
            
            if (cantidadRestante > 0 && faltante > 0) {
                if (cantidadRestante >= faltante) {
                    // Si alcanza para cubrir completamente el faltante, llenar completamente
                    nuevosValores[proyecto.id] = String(proyecto.total);
                    cantidadRestante -= faltante;
                } else {
                    // Si no alcanza para cubrir completamente, repartir hasta donde alcance
                    nuevosValores[proyecto.id] = String(actualActual + cantidadRestante);
                    cantidadRestante = 0;
                }
            }
        });
        
        // Actualizar los valores de los proyectos
        setProyectosValores(nuevosValores);
    }, [data, proyectosBase, isProducto]);

    // Manejar cambio de movimiento
    const handleMovimientoChange = (value: string) => {
        setInputMovimiento(value);
    };

    const handleMovimientoBlur = () => {
        const numValue = parseFloat(inputMovimiento) || 0;
        const valorEntero = Math.floor(Math.max(0, numValue)); // Asegurar que sea entero y no negativo
        setMovimientoActual(valorEntero);
        setInputMovimiento(valorEntero.toString());
        // Ejecutar repartición automática
        repartirCantidades(valorEntero);
    };

    const handleMovimientoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const numValue = parseFloat(inputMovimiento) || 0;
            const valorEntero = Math.floor(Math.max(0, numValue)); // Asegurar que sea entero y no negativo
            setMovimientoActual(valorEntero);
            setInputMovimiento(valorEntero.toString());
            // Ejecutar repartición automática
            repartirCantidades(valorEntero);
            (e.target as HTMLInputElement).blur();
        }
    };

    // Recalcular repartición cuando cambia movimientoActual
    useEffect(() => {
        if (movimientoActual > 0 && data && Array.isArray(data.itemRequisicions) && data.itemRequisicions.length > 0 && proyectosBase.length > 0) {
            repartirCantidades(movimientoActual);
        }
    }, [movimientoActual, repartirCantidades, data, proyectosBase]);

    // Manejar doble clic en proyecto actual
    const handleProyectoDoubleClick = (proyectoId: number, valorActual: number) => {
        setProyectosEditando({ ...proyectosEditando, [proyectoId]: true });
        setProyectosValores({ ...proyectosValores, [proyectoId]: valorActual.toString() });
    };

    const handleProyectoChange = (proyectoId: number, value: string) => {
        setProyectosValores({ ...proyectosValores, [proyectoId]: value });
    };

    const handleProyectoBlur = (proyectoId: number) => {
        setProyectosEditando({ ...proyectosEditando, [proyectoId]: false });
        // Aquí puedes agregar lógica para guardar el valor
    };

    const handleProyectoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, proyectoId: number) => {
        if (e.key === 'Enter') {
            handleProyectoBlur(proyectoId);
        } else if (e.key === 'Escape') {
            setProyectosEditando({ ...proyectosEditando, [proyectoId]: false });
            const proyecto = proyectosData.find(p => p.id === proyectoId);
            if (proyecto) {
                setProyectosValores({ ...proyectosValores, [proyectoId]: proyecto.actual.toString() });
            }
        }
    };

    // Handlers para precio de compra
    const handlePrecioCompraChange = (value: string) => {
        // Permitir solo números, puntos y comas
        const valorLimpio = value.replace(/[^\d.,]/g, '');
        setPrecioCompra(valorLimpio);
        setPrecioEditadoManualmente(true);
    };

    const handlePrecioCompraBlur = () => {
        const numValue = parsearNumero(precioCompra);
        const valorFinal = Math.max(0, numValue);
        setPrecioCompra(formatearNumero(valorFinal));
    };

    // Handlers para descuento
    const handleDescuentoCompraChange = (value: string) => {
        // Permitir solo números, puntos y comas
        const valorLimpio = value.replace(/[^\d.,]/g, '');
        setDescuentoCompra(valorLimpio);
    };

    const handleDescuentoCompraBlur = () => {
        const numValue = parsearNumero(descuentoCompra);
        const precio = parsearNumero(precioCompra);
        // El descuento no puede ser mayor que el precio
        const valorFinal = Math.max(0, Math.min(numValue, precio));
        setDescuentoCompra(formatearNumero(valorFinal));
    };

    // Función para agregar item a la orden de compra
    const addItemToOrden = async () => {
        // Validaciones
        if (!movimientoActual || movimientoActual <= 0) {
            (dispatch as any)(actions.HandleAlerta('Debes ingresar una cantidad en zona de movimientos', 'mistake'));
            return;
        }

        const precioParseado = parsearNumero(precioCompra);
        if (!precioParseado || precioParseado <= 0) {
            (dispatch as any)(actions.HandleAlerta('Debes ingresar un precio de compra válido', 'mistake'));
            return;
        }

        if (!ordenCompra || !ordenCompra.id) {
            (dispatch as any)(actions.HandleAlerta('No hay una orden de compra seleccionada', 'mistake'));
            return;
        }

        // Obtener el ID de la orden desde los params
        const ordenId = params.get('orden') || ordenCompra.id;

        // Calcular valores
        const unidad = data?.unidad || data?.itemRequisicions[0]?.unidad || '';
        const cantidad = movimientoActual;
        
        // Para kg: precioUnidad ya es precio por kilo (producto.precioActual ya está dividido)
        // Para otros: precioUnidad es precio total / cantidad de piezas
        const precioUnidad = unidad === 'kg'
            ? producto.precioActual || 0  // Ya es precio por kilo
            : precioParseado / cantidad;  // Precio total / cantidad de piezas
        const totalFunction = precioParseado;
        const descuentoFunction = parsearNumero(descuentoCompra);
        const final = totalFunction - descuentoFunction;

        // Mapear proyectos con las cantidades repartidas (solo la cantidad NUEVA, no el total)
        const toProjects = proyectosData
            .filter((proyecto) => {
                // Buscar el valor base original
                const proyectoBase = proyectosBase.find((p: any) => p.id === proyecto.id);
                const valorOriginal = proyectoBase?.actual || 0;
                const valorActual = proyecto.actual || 0;
                // Solo incluir si hay cantidad nueva (diferencia positiva)
                return (valorActual - valorOriginal) > 0;
            })
            .map((proyecto) => {
                // Buscar el itemRequisicion correspondiente para obtener el requisicionId
                const itemReq = data?.itemRequisicions?.find((it: any) => {
                    const reqId = it.requisicion?.id || it.requisicionId;
                    return reqId === proyecto.id;
                });

                // Buscar el valor base original para calcular solo la cantidad nueva
                const proyectoBase = proyectosBase.find((p: any) => p.id === proyecto.id);
                const valorOriginal = proyectoBase?.actual || 0;
                const valorActual = proyecto.actual || 0;
                const cantidadNueva = valorActual - valorOriginal;

                return {
                    requisicionId: proyecto.id,
                    cantidad: cantidadNueva, // Solo la cantidad nueva, no el total
                    itemRequisicionId: itemReq?.id || null
                };
            });

        // Determinar si es producto o materia
        const priceCurrentlyProducto = isProducto;
        const priceCurrently = !isProducto;

        const body = {
            cantidad,
            cotizacionId: ordenId,
            precioUnidad: precioUnidad,
            precio: totalFunction,
            descuento: descuentoFunction,
            precioTotal: final,
            productoId: priceCurrentlyProducto ? producto.id : null,
            ordenCompraId: ordenCompra.id,
            materiaId: priceCurrently ? producto.id : null,
            proyectos: toProjects,
            medida: itemRequisicion?.itemRequisicions[0]?.medida || 1
        };

        setLoading(true);
        try {
            const send = await axios.post('/api/requisicion/post/add/comprasCotizacion/item/add', body);
            (dispatch as any)(actions.HandleAlerta('Anexado', 'positive'));
            (dispatch as any)(actions.axiosToGetOrdenComprasAdmin(false, ordenId));
            (dispatch as any)(actions.getItemRequisicion(null));
            
            // Cerrar el modal
            params.delete('openItem');
            params.delete('openItemTipo');
            setParams(params);
        } catch (err) {
            console.log(err);
            (dispatch as any)(actions.HandleAlerta('Error al agregar el item a la orden', 'mistake'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Cuando cambia el item abierto, resetear estados dependientes
        setProyectosValores({});
        setProyectosEditando({});
        setMovimientoActual(0);
        setInputMovimiento('0');
      }, [openItemId]);
    return (
        // si es
        <div className="leftItemOpened">
            {/* Botón cerrar */}
            <button 
                className="btnCerrarItem"
                onClick={() => {
                    params.delete('openItem');
                    params.delete('openItemTipo');
                    setParams(params);
                }}
            >
                <span>×</span>
            </button>

            {loadingItemRequisicion && (
                <div style={{ padding: '40px 0', textAlign: 'center', color: '#666' }}>
                    <h3 style={{ margin: 0, fontWeight: 600 }}>Cargando información...</h3>
                    <p style={{ margin: '6px 0 0 0', fontSize: 12 }}>
                        Consultando el material seleccionado
                    </p>
                </div>
            )}

            {!loadingItemRequisicion && itemRequisicion === 404 && (
                <div style={{ padding: '40px 0', textAlign: 'center', color: '#666' }}>
                    <h3 style={{ margin: 0, fontWeight: 600 }}>No encontramos información</h3>
                    <p style={{ margin: '6px 0 0 0', fontSize: 12 }}>
                        Intenta abrir el item nuevamente
                    </p>
                </div>
            )}

            {!loadingItemRequisicion && itemRequisicion !== 404 && (
                // SI es materia prima, muestra esto
                !isProducto ?
                    <>
                        {/* Sección superior: Producto y Proveedor */}
                        <div className="topSectionItemOpened">
                            {/* Información del producto (izquierda) */}
                            <div className="productoInfo">
                                <div className="flexDiv">
                                    <div className="productoBadge">
                                        <span>{producto.id}</span>
                                    </div>
                                    <div className="">
                                        <h1 className="productoNombre">
                                            {itemRequisicion.description || itemRequisicion.item} 
                                        </h1>
                                        <div className="productoMedida">
                                            <span>{itemRequisicion?.itemRequisicions[0]?.medida} {itemRequisicion?.unidad}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="productoPrecio">
                                    <span className="precioLabel">Precio actual</span>
                                    <span className="precioValor">$ {producto.precioActual.toLocaleString('es-CO')}</span>
                                </div>
                                <div className="productoFecha">
                                    {producto.fechaPrecio}
                                    
                                </div>
                            </div>

                            {/* Información del proveedor (derecha) */}
                            <div className="proveedorInfo">
                                <h2 className="proveedorNombre">{proveedor.nombre}</h2>
                                <div className="proveedorContacto">
                                    <span>NIT {proveedor.nit}</span>
                                    <span>{proveedor.email}</span>
                                    <span>{proveedor.telefono}</span>
                                </div>
                                <div className="proveedorAccion">
                                    <span className="accionLabel">Actualizar precio</span>
                                    <input type="text" placeholder="Ingrese el nuevo precio" />
                                </div>
                            </div>
                        </div>

                        {/* Zona de movimientos */}
                        <div className="movimientoSection">
                            <h3 className="movimientoTitulo">Zona de movimientos</h3>
                            <div className="movimientoInput">
                                <input
                                    type="number"
                                    className="movimientoInputField"
                                    value={inputMovimiento}
                                    onChange={(e) => handleMovimientoChange(e.target.value)}
                                    onBlur={handleMovimientoBlur}
                                    onKeyDown={handleMovimientoKeyDown}
                                    step="0.01"
                                    disabled={movimiento.total <= 0.09}
                                />

                                <span className="movimientoSeparador">/</span>
                                <span className="movimientoTotal">{(movimiento.total <= 0.09 ? 0 : movimiento.total).toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Sección de proyectos */}
                        <div className="proyectosSection">
                            <h3 className="proyectosTitulo">Proyectos</h3>
                            <div className="cantidadRepartir">
                                <span>Cantidad sobrante</span>
                                <span className="cantidadValor">+ {cantidadRepartir.toFixed(2)} {itemRequisicion?.unidad || data?.unidad || ''}</span>
                            </div>

                            {/* Lista de proyectos */}
                            <div className="proyectosLista">
                                {proyectosData.map((proyecto) => (
                                    <div key={proyecto.id} className="proyectoItem">
                                        <div className="proyectoBadge">
                                            <span>{proyecto.id}</span>
                                        </div>
                                        <div className="proyectoContenido">
                                            <div className="proyectoNombreEstado">
                                                <span className="proyectoNombre">{proyecto.nombre}</span>
                                                <span className="proyectoEstado">{proyecto.estado}</span>
                                            </div>
                                            <div className="proyectoCantidades">
                                                <div className="proyectoActual">
                                                    <span>Actualmente</span>
                                                    {proyectosEditando[proyecto.id] ? (
                                                        <div className="proyectoActualInputContainer">
                                                            <input
                                                                type="number"
                                                                className="proyectoActualInput"
                                                                value={proyectosValores[proyecto.id] || proyecto.actual}
                                                                onChange={(e) => handleProyectoChange(proyecto.id, e.target.value)}
                                                                onBlur={() => handleProyectoBlur(proyecto.id)}
                                                                onKeyDown={(e) => handleProyectoKeyDown(e, proyecto.id)}
                                                                autoFocus
                                                                step="0.01"
                                                            />
                                                            <span className="proyectoActualSeparador">/</span>
                                                            <span className="proyectoActualTotal">{Number(proyecto.total).toFixed(2)}</span>
                                                        </div>
                                                    ) : (
                                                        <span  
                                                            className="proyectoActualCantidad"
                                                            onDoubleClick={() => handleProyectoDoubleClick(proyecto.id, proyecto.actual)}
                                                        >
                                                            {Number(proyecto.actual).toFixed(2)} / {Number(proyecto.total).toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="proyectoCantidades">
                                                <div className="proyectoFaltante">
                                                    <span>Faltante</span>
                                                    <span>{Number(proyecto.faltante).toFixed(2)} {itemRequisicion?.unidad || data?.unidad || ''}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Detalles de la compra */}
                        <div className="detallesCompraSection">
                            <h3 className="detallesCompraTitulo">Detalles de la compra</h3>
                            
                            <div className="detallesCompraInputs">
                                <div className="detalleCompraInput">
                                    <div className="detalleCompraLabel">
                                        <span>Precio de la compra</span>
                                        <div className="infoIcon">
                                            <span>!</span>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        className="detalleCompraInputField"
                                        value={precioCompra}
                                        onChange={(e) => handlePrecioCompraChange(e.target.value)}
                                        onBlur={handlePrecioCompraBlur}
                                        placeholder="0,00"
                                    />
                                </div>

                                <div className="detalleCompraInput">
                                    <div className="detalleCompraLabel">
                                        <span>Descuento de la compra</span>
                                    </div>
                                    <input
                                        type="text"
                                        className="detalleCompraInputField"
                                        value={descuentoCompra}
                                        onChange={(e) => handleDescuentoCompraChange(e.target.value)}
                                        onBlur={handleDescuentoCompraBlur}
                                        placeholder="0,00"
                                    />
                                </div>
                            </div>

                            {precioTotal > 0 && (
                                <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 600 }}>Precio total:</span>
                                        <span style={{ fontSize: '18px', fontWeight: 700, color: '#1890ff' }}>
                                            $ {precioTotal.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="detalleCompraCheckbox">
                            </div>

                            <button 
                                className="btnIncluirOrdenCompra"
                                onClick={() => {
                                    if (!loading) {
                                        addItemToOrden();
                                    }
                                }}
                                disabled={loading}
                            >
                                {loading ? 'Ingresando...' : 'Incluir a la orden compra'}
                            </button>
                        </div>
                    </>
                :
                <>
                    {/* Sección superior: Producto y Proveedor */}
                    <div className="topSectionItemOpened">
                        {/* Información del producto (izquierda) */}
                        <div className="productoInfo">
                            <div className="flexDiv">
                                <div className="productoBadge">
                                    <span>{producto.id}</span>
                                </div>
                                <div className="">
                                    <h1 className="productoNombre">
                                        {itemRequisicion.description || itemRequisicion.item} 
                                    </h1>
                                    <div className="productoMedida">
                                        <span>{itemRequisicion?.itemRequisicions[0]?.medida} {itemRequisicion?.unidad}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="productoPrecio">
                                <span className="precioLabel">Precio actual</span>
                                <span className="precioValor">$ {producto.precioActual.toLocaleString('es-CO')}</span>
                            </div>
                            <div className="productoFecha">
                                {producto.fechaPrecio}
                                
                            </div>
                        </div>

                        {/* Información del proveedor (derecha) */}
                        <div className="proveedorInfo">
                            <h2 className="proveedorNombre">{proveedor.nombre}</h2>
                            <div className="proveedorContacto">
                                <span>NIT {proveedor.nit}</span>
                                <span>{proveedor.email}</span>
                                <span>{proveedor.telefono}</span>
                            </div>
                            <div className="proveedorAccion">
                                <span className="accionLabel">Actualizar precio</span>
                                <input type="text" placeholder="Ingrese el nuevo precio" />
                            </div>
                        </div>
                    </div>

                    {/* Zona de movimientos */}
                    <div className="movimientoSection">
                        <h3 className="movimientoTitulo">Zona de movimientos</h3>
                        <div className="movimientoInput">
                            <input
                                type="number"
                                className="movimientoInputField"
                                value={inputMovimiento}
                                onChange={(e) => handleMovimientoChange(e.target.value)}
                                onBlur={handleMovimientoBlur}
                                onKeyDown={handleMovimientoKeyDown}
                                step="0.01"
                                disabled={movimientoTotalProducto <= 0.09}
                            />

                            <span className="movimientoSeparador">/</span>
                            <span className="movimientoTotal">{(movimientoTotalProducto <= 0.09 ? 0 : movimientoTotalProducto).toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Sección de proyectos */}
                    <div className="proyectosSection">
                        <h3 className="proyectosTitulo">Proyectos</h3>
                        <div className="cantidadRepartir">
                            <span>Cantidad sobrante</span>
                            <span className="cantidadValor">+ {cantidadRepartirProductoTerminado.toFixed(2)} </span>
                        </div>

                        {/* Lista de proyectos */}
                        <div className="proyectosLista">
                            {proyectosData.map((proyecto) => (
                                <div key={proyecto.id} className="proyectoItem">
                                    <div className="proyectoBadge">
                                        <span>{proyecto.id}</span>
                                    </div>
                                    <div className="proyectoContenido">
                                        <div className="proyectoNombreEstado">
                                            <span className="proyectoNombre">{proyecto.nombre}</span>
                                            <span className="proyectoEstado">{proyecto.estado}</span>
                                        </div>
                                        <div className="proyectoCantidades">
                                            <div className="proyectoActual">
                                                <span>Actualmente</span>
                                                {proyectosEditando[proyecto.id] ? (
                                                    <div className="proyectoActualInputContainer">
                                                        <input
                                                            type="number"
                                                            className="proyectoActualInput"
                                                            value={proyectosValores[proyecto.id] || proyecto.actual}
                                                            onChange={(e) => handleProyectoChange(proyecto.id, e.target.value)}
                                                            onBlur={() => handleProyectoBlur(proyecto.id)}
                                                            onKeyDown={(e) => handleProyectoKeyDown(e, proyecto.id)}
                                                            autoFocus
                                                            step="0.01"
                                                        />
                                                        <span className="proyectoActualSeparador">/</span>
                                                        <span className="proyectoActualTotal">{Number(proyecto.total).toFixed(2)}</span>
                                                    </div>
                                                ) : (
                                                    <span 
                                                        className="proyectoActualCantidad"
                                                        onDoubleClick={() => handleProyectoDoubleClick(proyecto.id, proyecto.actual)}
                                                    >
                                                        {Number(proyecto.actual).toFixed(2)} / {Number(proyecto.total).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="proyectoCantidades">
                                            <div className="proyectoFaltante">
                                                <span>Faltante</span>
                                                <span>{Number(proyecto.faltante).toFixed(2)} </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detalles de la compra */}
                    <div className="detallesCompraSection">
                        <h3 className="detallesCompraTitulo">Detalles de la compra</h3>
                        
                        <div className="detallesCompraInputs">
                            <div className="detalleCompraInput">
                                <div className="detalleCompraLabel">
                                    <span>Precio de la compra</span>
                                    <div className="infoIcon">
                                        <span>!</span>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    className="detalleCompraInputField"
                                    value={precioCompra}
                                    onChange={(e) => handlePrecioCompraChange(e.target.value)}
                                    onBlur={handlePrecioCompraBlur}
                                    placeholder="0,00"
                                />
                            </div>

                            <div className="detalleCompraInput">
                                <div className="detalleCompraLabel">
                                    <span>Descuento de la compra</span>
                                </div>
                                <input
                                    type="text"
                                    className="detalleCompraInputField"
                                    value={descuentoCompra}
                                    onChange={(e) => handleDescuentoCompraChange(e.target.value)}
                                    onBlur={handleDescuentoCompraBlur}
                                    placeholder="0,00"
                                />
                            </div>
                        </div>

                        {precioTotal > 0 && (
                            <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 600 }}>Precio total:</span>
                                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#1890ff' }}>
                                        $ {precioTotal.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="detalleCompraCheckbox">
                        </div>

                        <button 
                            className="btnIncluirOrdenCompra"
                            onClick={() => {
                                if (!loading) {
                                    addItemToOrden();
                                }
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Ingresando...' : 'Incluir a la orden compra'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}