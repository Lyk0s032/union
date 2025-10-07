import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

export default function ProveedorCotizador({ provider }) {
  const [params] = useSearchParams();
  const req = useSelector(store => store.requisicion);
  const { itemsCotizacions } = req;
  const [todo, setTodo] = useState([]);

  const subtotales = provider.materias?.map((pr) => {
    let cantidades = [];

    if (provider.tipo === "producto" || params.get("s") === "productos") {
      // Comparar contra productoId
      cantidades = itemsCotizacions?.filter(it => it.productoId === pr.materiaId);
    } else {
      // Comparar contra materia prima
      cantidades = itemsCotizacions?.filter(it => it.materiumId === pr.materiaId);
    }

    let numero = cantidades?.length
      ? cantidades.reduce((acc, curr) => acc + Number(curr.cantidad), 0)
      : 0;

    return {
      ...pr,
      cantidad: numero,
      subtotal: Number(pr.precio) * numero
    };
  }) || [];

  // Total general
  const total = subtotales.reduce((acc, item) => acc + item.subtotal, 0);

  useEffect(() => {
    setTodo(subtotales.map(item => item.subtotal));
  }, [itemsCotizacions, provider]);

  return (
    <div className="itemProveedor">
      <div className="containerItemProvider">
        <div className="title">
          <h3 style={{ fontSize: 12 }}>{provider.proveedor.nombre}</h3>
        </div>
        <div className="priceItem">
          <h1>
            $ {new Intl.NumberFormat('es-CO', { currency: 'COP' }).format(Number(total).toFixed(0))}
          </h1>
        </div>
      </div>
    </div>
  );
}
