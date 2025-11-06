import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../store/action/action';
import GraphCompras from './graph';
import ListaCompras from './listaCompras';
import BoxDatas from './boxsData';
import ProductoFiltro from './filtros/producto';
import MateriaFiltro from './filtros/materia';
import RequisicionFiltro from './filtros/requisicion';
import ProveedorFiltro from './filtros/proveedor';
import OrdenFiltro from './filtros/orden';

export default function GeneralDashboard(){
  const req = useSelector(store => store.requisicion);
  const { compras, loadingCompras } = req;
  const dispatch = useDispatch();

  // estado del panel de filtro (qué subcomponente mostrar)
  const [filtro, setFiltro] = useState('proveedor');

  // estado único de filtros seleccionados: array de objetos { tipo, id, nombre, ... }
  const [filters, setFilters] = useState([]);

  // ruta construida que se manda al backend (string con query)
  const [rutaQuery, setRutaQuery] = useState(null);

  // debounce ref
  const debounceRef = useRef(null);

  // Añadir / quitar un filtro (recibe el objeto completo)
  const toggleFilter = (item) => {
    // item: { tipo: 'proveedor'|'materia'|..., id, nombre, ... }
    setFilters(prev => {
      const exists = prev.find(f => f.tipo === item.tipo && Number(f.id) === Number(item.id));
      if (exists) {
        // quitar
        return prev.filter(f => !(f.tipo === item.tipo && Number(f.id) === Number(item.id)));
      } else {
        // agregar
        return [...prev, item];
      }
    });
  };

  // Helper: construye query string agrupando ids por tipo
  const buildQueryString = (filtersArray) => {
    if (!filtersArray || !filtersArray.length) return null;

    const groups = filtersArray.reduce((acc, f) => {
      if (!acc[f.tipo]) acc[f.tipo] = new Set();
      acc[f.tipo].add(String(f.id));
      return acc;
    }, {});

    // mapeo tipo -> parámetro en el backend
    const tipoToParam = {
      proveedor: 'proveedorIds',
      requisicion: 'requisicionIds',
      materia: 'materiaIds',
      producto: 'productoIds',
      orden: 'ordenIds' // ajústalo al nombre real si el backend espera otro nombre
    };

    const params = new URLSearchParams();

    Object.entries(groups).forEach(([tipo, idSet]) => {
      const paramName = tipoToParam[tipo];
      if (!paramName) return; // si hay un tipo sin mapping, lo ignoramos
      const ids = Array.from(idSet).join(',');
      if (ids) params.set(paramName, ids);
    });

    const qs = params.toString(); // ya codificado
    return qs ? `?${qs}` : null;
  };

  // Cuando cambian filters, reconstruimos ruta con debounce y disparamos fetch
  useEffect(() => {
    // limpiar debounce anterior
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const qs = buildQueryString(filters);
      setRutaQuery(qs);

      // dispatch con la ruta (si quieres mandar true/false o manejar carga)
      dispatch(actions.axiosToGetDataOrdenesAlmacen(true, qs));
    }, 300); // 300ms debounce

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filters, dispatch]);

  // Mostrar badges pequeños de los filtros activos
  const SelectedBadges = () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
      {filters.map((f, i) => (
        <div key={i} style={{
          background: '#f1f1f1',
          padding: '6px 10px',
          borderRadius: 8,
          display:'flex',
          gap:8,
          alignItems:'center'
        }}>
          <strong style={{marginRight:6, fontSize:12}}>{f.tipo}</strong>
          <span style={{fontSize:12}}>{f.nombre ?? f.id}</span>
          <button
            onClick={() => toggleFilter(f)}
            style={{
              marginLeft:8,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer'
            }}
            title="Quitar filtro"
          >
            ✕
          </button>
        </div>
      ))}
      {filters.length === 0 && <span style={{color:'#888'}}>No hay filtros seleccionados</span>}
    </div>
  );

  return (
    <div className="containerDashboardCompras">
      <div className="titleDashboard">
        <h3>Hola, Jessica</h3>
        <h4>Gestiona toda la información de tus proveedores, productos, órdenes de compra y más.</h4>
      </div>

      <div className="filterOptions">
        <div className="containerFilter">
          <div className="itemZone">
            <span>Tiempo</span>
            <h3>Octubre</h3>
            <button>
              <span>Haz clic aquí para filtrar o presiona Ctrl + F</span>
            </button>
          </div>
        </div>
      </div>

      <div className="searchDiv">
         {/* Badges de filtros activos */}

        <div className="containerSearchDiv">
          <div className="optionsSearch" >
            <button className={filtro === 'orden' ? 'Active' : ''} onClick={() => setFiltro('orden')}><span>Orden</span> </button>
            <button className={filtro === 'proveedor' ? 'Active' : ''} onClick={() => setFiltro('proveedor')}><span>Proveedor</span> </button>
            <button className={filtro === 'requisicion' ? 'Active' : ''} onClick={() => setFiltro('requisicion')}><span>Requisicion</span> </button>
            <button className={filtro === 'materia' ? 'Active' : ''} onClick={() => setFiltro('materia')}><span>Materia prima</span> </button>
            <button className={filtro === 'producto' ? 'Active' : ''} onClick={() => setFiltro('producto')}><span>Producto</span> </button>
          </div>
 
         
          {/* MOSTRAR SUBCOMPONENTE SEGÚN filtro */}
          <div style={{ marginTop: 8 }}>
            {filtro === 'producto' && <ProductoFiltro onSelect={toggleFilter} />}
            {filtro === 'materia' && <MateriaFiltro onSelect={toggleFilter} />}
            {filtro === 'requisicion' && <RequisicionFiltro onSelect={toggleFilter} />}
            {filtro === 'proveedor' && <ProveedorFiltro onSelect={toggleFilter} />}
            {filtro === 'orden' && <OrdenFiltro onSelect={toggleFilter} />}
          </div>
        </div>

        <br /><br /><SelectedBadges />

      </div>

      {/* Resultados */}
      {loadingCompras ? <h1>Cargando...</h1>
        : !compras || compras === 'notrequest' || compras === 404 ? <h1>Sin resultados</h1>
        : (
          <div>
            <div className="divideZone">
              <BoxDatas compras={compras.data} />
            </div>
            <div className="zoneGraph">
              <div className="divideZoneGraph">
                <div className="containerGraph"><GraphCompras /></div>
              </div>
            </div>
            <div className="resultsDataItems">
              <ListaCompras compras={compras.data} />
            </div>
          </div>
        )
      }
    </div> 
  );
}
