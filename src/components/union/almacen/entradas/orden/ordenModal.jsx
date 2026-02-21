import React, { useEffect } from 'react';
import { MdCheckBoxOutlineBlank, MdOutlineCheckCircle, MdOutlineCheckCircleOutline } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../store/action/action';
import ItemOrdenMP from './itemOrdenMP';
import ItemOrdenPT from './itemOrdenPT';

export default function OrdenModal() {
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    
    // Obtener ID de la orden desde params
    const ordenId = params.get('orden');
    
    // Obtener datos del reducer
    const admin = useSelector(store => store.admin || {});
    const { ordenCompras, loadingOrdenCompras } = admin;
    
    // Cargar datos de la orden al abrir la modal
    useEffect(() => {

            dispatch(actions.axiosToGetOrdenAlmacen(true, ordenId));
        
    }, [ordenId]);
    
    const cerrarModal = () => {
        setParams({});
    };
    
    if (!ordenId) return null;
    
    
    return (
        <div className="orden-modal">
            <div className="hidden-modal" onClick={cerrarModal}></div>
            <div className="container-modal">
                {loadingOrdenCompras ? (
                    <div style={{ padding: '60px', textAlign: 'center' }}>
                        <div style={{ fontSize: 18, color: '#666', marginBottom: 12 }}>
                            Cargando información de la orden...
                        </div>
                        <div className="spinner" style={{ 
                            width: 40, 
                            height: 40, 
                            border: '4px solid #f3f4f6', 
                            borderTopColor: '#2f8bfd', 
                            borderRadius: '50%', 
                            animation: 'spin 0.8s linear infinite',
                            margin: '0 auto'
                        }}></div>
                    </div>
                ) : !ordenCompras || ordenCompras === 'notrequest' || ordenCompras === 404 ? (
                    <div style={{ padding: '60px', textAlign: 'center' }}>
                        <div style={{ fontSize: 18, color: '#e74c3c', marginBottom: 12 }}>
                            ❌ No se pudo cargar la orden de compra
                        </div>
                        <button onClick={cerrarModal} style={{
                            padding: '10px 20px',
                            background: '#2f8bfd',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer',
                            marginTop: 16
                        }}>
                            Cerrar
                        </button>
                    </div>
                ) : (
                    <>
                <div className="header-modal">
                    <div className="dataHeader">
                        <h3>Orden de compra #{ordenCompras?.id || ordenId}</h3>
                        <button onClick={cerrarModal} style={{
                            position: 'absolute',
                            right: 20,
                            top: 20,
                            background: 'transparent',
                            border: 'none',
                            fontSize: 24,
                            cursor: 'pointer',
                            color: '#666'
                        }}>
                            ✕
                        </button>
                    </div>
                    <div className="divideZoneTime">
                        <div className="boxDataInformation">
                            <div className="circle">
                                <MdOutlineCheckCircle className='icon' />
                            </div>
                            <div className="dataBox">
                                <h3>Cotización creada</h3>
                                <span>14 de Febrero de 2026</span>
                            </div>
                        </div>
                        <div className="boxDataInformation">
                            <div className="circle">
                                <MdOutlineCheckCircle className='icon' />
                            </div>
                            <div className="dataBox">
                                <h3>Cotización creada</h3>
                                <span>14 de Febrero de 2026</span>
                            </div>
                        </div>
                        <div className="boxDataInformation">
                            <div className="circle">
                                <MdOutlineCheckCircle className='icon' />
                            </div>
                            <div className="dataBox">
                                <h3>Cotización creada</h3>
                                <span>14 de Febrero de 2026</span>
                            </div>
                        </div>
                        <div className="boxDataInformation">
                            <div className="circle">
                                <MdOutlineCheckCircle className='icon' />
                            </div>
                            <div className="dataBox">
                                <h3>Cotización creada</h3>
                                <span>14 de Febrero de 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bodyContainerModal">
                    <div className="TopBody">
                        <div className="divideDataInformation">
                            <div className="leftDataInformation">
                                <span>Cotización número: {ordenCompras?.id || 'N/A'}</span>
                                <h1>{ordenCompras?.nombre || ordenCompras?.name || 'Sin nombre'}</h1>
                                <br />

                                <span>Proveedor</span><br />
                                <h3>
                                    {typeof ordenCompras?.proveedor === 'object' 
                                        ? (ordenCompras.proveedor?.nombre || ordenCompras.proveedor?.name || 'Sin proveedor')
                                        : (ordenCompras?.proveedor || ordenCompras?.supplier || 'Sin proveedor')
                                    }
                                </h3>
                                <span>NIT: {
                                    typeof ordenCompras?.proveedor === 'object'
                                        ? (ordenCompras.proveedor?.nit || 'N/A')
                                        : (ordenCompras?.nit || ordenCompras?.supplierNit || 'N/A')
                                }</span>                           
                            </div>
                            <div className="leftDataInformation">
                                <span>Estado</span>
                                <h1>{ordenCompras?.estado || 'Pendiente'}</h1>
                                <span>{ordenCompras?.proyectos || ordenCompras?.totalProyectos || 0} proyectos</span>
                            </div>
                        </div>
                    </div>
                    <div className="tableData">
                        <h3>Productos</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th className="productCode">Código</th>
                                    <th className="productName">Nombre</th>
                                    <th className="productQuantity">Cantidad</th>
                                    <th className="productMeasure">Medida</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    ordenCompras.comprasCotizacionItems?.map((item, i)  => {
                                        return (
                                            item?.productoId ? (
                                                <ItemOrdenPT 
                                                    item={item} 
                                                    key={i + 1}
                                                    ordenId={ordenId}
                                                    comprasCotizacionId={ordenCompras?.id}
                                                />
                                            ) : (
                                                <ItemOrdenMP 
                                                    item={item} 
                                                    key={i + 1}
                                                    ordenId={ordenId}
                                                    comprasCotizacionId={ordenCompras?.id}
                                                /> 
                                            )
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                </>
                )}
            </div>
        </div>
    )
}