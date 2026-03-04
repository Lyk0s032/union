import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../store/action/action';
import '../../bodegas/item/itemModal.css';
import ItemNecesidadProyecto from './itemModal';

export default function ProyectoModal() {
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();

    const almacen = useSelector(store => store.almacen);
    const { proyecto, loadingProyecto } = almacen;

    // Cargar la información del proyecto usando la misma estructura que seeProject.jsx (25-30)
    useEffect(() => {
        const idProyecto = params.get('proyecto');
        if (idProyecto) {
            dispatch(actions.axiosToGetProject(true, idProyecto));
        }
    }, [dispatch, params]);

    const closeModal = () => {
        params.delete('proyecto');
        setParams(params);
    };

    const calcularAvance = () => {
        try {
            const req = proyecto?.requisiciones?.[0];
            const necesidad = req?.necesidadProyectos || [];
            const compromiso = necesidad.reduce((acc, item) => acc + Number(item.cantidadComprometida || 0), 0);
            const entregada = necesidad.reduce((acc, item) => acc + Number(item.cantidadEntregada || 0), 0);
            if (!compromiso) return 0;
            return Number((entregada / compromiso) * 100).toFixed(0);
        } catch {
            return 0;
        }
    };

    const avance = calcularAvance();

    return (
        <div className="item-modal-overlay" onClick={closeModal}>
            <div className="item-modal-container" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="item-modal-header">
                    <div className="item-modal-header-content">
                        <div className="item-modal-icon">
                            {/* Código de cotización */}
                            {proyecto ? Number(21719 + Number(proyecto.id || 0)) : '—'}
                        </div>
                        <div className="item-modal-title-group">
                            <h2 className="item-modal-title">
                                {proyecto?.name || proyecto?.nombre || 'Proyecto'}
                            </h2>
                            <span className="item-modal-subtitle">
                                {proyecto?.client?.nombre || proyecto?.client?.name || 'Cliente no definido'}
                            </span>
                        </div>
                    </div>
                    <button className="item-modal-close" onClick={closeModal} title="Cerrar">
                        ✕
                    </button>
                </div>

                {/* Contenido */}
                <div className="item-modal-content">
                    {loadingProyecto || !proyecto ? (
                        <div className="item-modal-loading">
                            <div className="spinner"></div>
                            <p>Cargando información del proyecto...</p>
                        </div>
                    ) : proyecto === 'notrequest' || proyecto === 404 ? (
                        <div style={{ padding: 40, textAlign: 'center' }}>
                            <h3>No se encontró la información del proyecto</h3>
                        </div>
                    ) : (
                        <>
                            {/* Resumen del proyecto */}
                            <div className="item-modal-stats">
                                <div className="item-stat-card">
                                    <h1>{proyecto.state || 'Sin estado'}</h1>
                                    <span>Estado del proyecto</span>
                                </div>
                                <div className="item-stat-card">
                                    <h1>
                                        {avance}%
                                    </h1>
                                    <span>Avance de entrega desde almacén</span>
                                </div>
                            </div>

                            {/* Items que debo entregar (necesidad del proyecto) */}
                            <div className="item-section" style={{ marginTop: 20 }}>
                                <div className="item-section-header">
                                    <h3>Items del proyecto para entregar</h3>
                                </div>
                                <div className="tableDataItems">
                                    <div className="listaMP">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Entregado</th>
                                                    <th>Necesidad</th>
                                                    <th>Porcentaje</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {proyecto?.cotizacion_compromisos?.length ? (
                                                    proyecto.cotizacion_compromisos.map((item, i) => {
                                                        const requisicionId = proyecto?.requisiciones?.[0]?.id || proyecto?.requisiciones?.[0]?.requisicionId || null;
                                                        return (
                                                            <ItemNecesidadProyecto
                                                                key={item.id || i}
                                                                itemNecesidad={item}
                                                                cotizacionId={proyecto.id}
                                                                requisicionId={requisicionId}
                                                                onUpdate={() => {
                                                                    // Recargar el proyecto después de actualizar
                                                                    const idProyecto = params.get('proyecto');
                                                                    if (idProyecto) {
                                                                        dispatch(actions.axiosToGetProject(false, idProyecto));
                                                                    }
                                                                }}
                                                            />
                                                        );
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                                            No hay items de necesidad registrados para este proyecto
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table> {console.log('proyecto', proyecto)}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}