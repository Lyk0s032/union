import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../store/action/action';
import ItemProyecto from './itemProyecto';
import ProyectoModal from './modal/proyecto';

export default function GeneralPedidos() {
    const dispatch = useDispatch();
    const [params] = useSearchParams();

    const almacen = useSelector(store => store.almacen);
    const { proyectos, loadingProyectos } = almacen;

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Cargar proyectos de almacén al montar
        dispatch(actions.axiosToGetProjects(true));
    }, [dispatch]);

    const proyectosFiltrados = useMemo(() => {
        if (!proyectos || proyectos === 'notrequest' || proyectos === 404) {
            return [];
        }

        const lista = Array.isArray(proyectos) ? proyectos : [];

        if (!searchQuery.trim()) return lista;

        const word = searchQuery.trim();
        const isNumber = !isNaN(word);

        return lista.filter(p => {
            if (!p) return false;

            // Buscar por número de cotización (21719 + id) si es número
            if (isNumber) {
                const codigo = Number(21719) + Number(p.id);
                return String(codigo).includes(word);
            }

            // Buscar por nombre de proyecto o cliente
            const nombreProyecto = (p.name || p.nombre || '').toLowerCase();
            const nombreCliente = (p.client?.nombre || p.client?.name || '').toLowerCase();

            return (
                nombreProyecto.includes(word.toLowerCase()) ||
                nombreCliente.includes(word.toLowerCase())
            );
        });
    }, [proyectos, searchQuery]);

    return (
        <div className="general-entradas">
            <div className="containerEntradas">
                <div className="topHeader">
                    <div className="divideTop">
                        <div className="title">
                            <h3>Pedidos de almacén por proyectos</h3>
                        </div>
                        <div className="buttons">
                            {/* Botones futuros: descargar, filtros adicionales, etc. */}
                        </div>
                    </div>
                </div>

                <div className="headerEntradas">
                    <div className="divideHeader">
                        <div className="inputSearch">
                            <input
                                type="text"
                                placeholder="Buscar proyecto (nombre o Nro. cotización)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="buttonsOptions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button className="download">
                                <span>Descargar lista</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="containerData">
                    <div className="containerTable">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nro.</th>
                                    <th>Cliente</th>
                                    <th>Proyecto</th>
                                    <th>Fecha aprobada</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingProyectos && (!proyectos || proyectos === 'notrequest') ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                                            <span>Cargando proyectos...</span>
                                        </td>
                                    </tr>
                                ) : proyectosFiltrados.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                            <span>No hay proyectos en almacén</span>
                                        </td>
                                    </tr>
                                ) : (
                                    proyectosFiltrados.map((proyecto, index) => (
                                        <ItemProyecto key={proyecto.id || index} proyecto={proyecto} />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal de proyecto cuando hay ?proyecto= en la URL */}
                {params.get('proyecto') && (
                    <ProyectoModal />
                )}
            </div>
        </div>
    );
}