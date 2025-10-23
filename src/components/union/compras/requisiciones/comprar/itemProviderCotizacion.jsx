import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../store/action/action';
import { useSearchParams } from 'react-router-dom';

export default function CotizacionProviderItem({ provider }){
    const valor = provider.materias.reduce((acc, item) => acc + (Number(item.precio) || 0), 0);
    const [valorFinal, setValorFinal] = useState(0)
    const req = useSelector(store => store.requisicion);
    const { ids, materiaIds, itemsCotizacions } = req;
    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();
    let identificadores = ids;
    const [todo, setTodo] = useState([])
    const [loading, setLoading] = useState(false);
const subtotales = provider.materias?.map((pr) => {
  // Filtrar los items de cotización dependiendo si es producto o materia
  let cantidades = [];

  if (pr.tipo == 'producto') {
    // Este registro corresponde a un producto
    cantidades = itemsCotizacions?.filter(
      (it) => it.productoId === pr.materiaId
    );
  } else if (pr.materiaId) {
    // Este registro corresponde a una materia prima
    cantidades = itemsCotizacions?.filter(
      (it) => it.materiumId === pr.materiaId
    );
  }

  // Total de cantidades para este item
  let numero = cantidades.length
    ? cantidades.reduce((acc, curr) => acc + Number(curr.cantidad), 0)
    : 0;

  return {
    ...pr,
    cantidad: numero,
    subtotal: Number(pr.precio) * numero,
  };
});

    // Total general
    const total = subtotales.reduce((acc, item) => acc + item.subtotal, 0);

    // Si querés guardar en estado (opcional)
    useEffect(() => {
        setTodo(subtotales.map(item => item.subtotal));
    }, [itemsCotizacions, provider]);


    const [title, setTitle] = useState('Nombre de la cotización');
    const [changeName, setChangeName] = useState(false);
      const cargaProyectos = async () => {
        const body = {
            ids
        }
        const getData = await axios.post('/api/requisicion/get/req/multipleReal/', body)
        .then((res) => {
            return res.data
        })
        .then((res) => {
            dispatch(actions.getProyectos(res.proyectos))
            dispatch(actions.getMaterias(res.consolidado))
        })
        .then(async (result) => {
            let body = {
                proyectos: ids
            }
            const getData = await axios.post('/api/requisicion/post/get/cotizaciones/', body)
            .then((res) => {
                dispatch(actions.getCotizacionesCompras(res.data))

            })

            return getData;
        })
        .catch(() => {
            dispatch(actions.HandleAlerta('No hemos logrado analizar esto', 'mistake'))
        })
        return getData; 
    } 
    // useEffect(() => {
    //     const cotizacionObj = {
    //         ProveedorId: provider.id,
    //         nombreCotizacion: 'Nombre de la cotización',
    //         description: 'descripción',
    //         proyectos: [1,2,3], // puedes manejarlo dinámico
    //         items: items
    //     };
    //     onChange(provider.id, cotizacionObj);
    // }, []);
const newCotizacion = async () => {
  let ids = {
    proveedorId: provider.proveedor.id,
    name: title,
    description: "Descripción de la cotización",
    proyectos: identificadores,
    items: itemsCotizacions
      // 🔹 Filtrar: solo los items que están en las materias de este provider
      .filter((it) => {
        if (provider.tipo === "producto") {
          return provider.materias.some(mp => mp.materiaId == it.productoId);
        } else {
          return provider.materias.some(mp => mp.materiaId == it.materiumId);
        }
      })
      // 🔹 Mapear para el backend
      .map((it) => {
        let precio = 0;

        if (provider.tipo === "producto") {
          const found = provider.materias.find(mp => mp.materiaId == it.productoId);
          precio = found ? found.precio : 0;
        } else {
          const found = provider.materias.find(mp => mp.materiaId == it.materiumId);
          precio = found ? found.precio : 0;
        }

        return {
          materiaId: provider.tipo === "producto" ? null : it.materiumId,
          productoId: provider.tipo === "producto" ? it.productoId : null,
          cantidad: it.cantidad,
          requisicion: it.requisicionId,
          precioUnidad: precio,
          precioTotal: Number(precio * Number(it.cantidad)).toFixed(0),
        };
      }),
  };

  let body = { datos: [ids] };
  setLoading(true);
  const send = await axios
    .post("/api/requisicion/post/generar/cotizacion/somemuch", body)
    .then((res) => {
      console.log(res.data); 
      dispatch(actions.HandleAlerta("Exito", "positive"));
      params.set('facture', 'show');
      setParams(params)
    }) 
    .then(async (res) => {
      await cargaProyectos()
    })
    .catch((err) => {
      console.log(err);
      dispatch(actions.HandleAlerta("Fallo", "mistake"));
    })
    .finally(() => {
      setLoading(false)
    })

  return send;
};

    const inputRef = useRef(null);

    useEffect(() => {
      if (changeName && inputRef.current) {
        inputRef.current.focus();
      }
    }, [changeName]);
    return (
        <div className="cotizacion">
            <div className="containerCotizacionProvider">
                    <div className="title" style={{textAlign:'center', width:'100%'}} >
                        {
                            !changeName ? <h4 onClick={() => setChangeName(true)}>{title}</h4>
                            :
                            <input type="text" onChange={(e) => {
                                setTitle(e.target.value)
                            }} value={title} onBlur={() => setChangeName(false)} ref={inputRef}/>
                        }
                    </div>
                <div className="titleThat">
                    
                    <h3>{provider.proveedor.nombre}</h3>
                </div>
                <div className="dataElementos">
                    
                    <div className="containerDataElementos">
                        {
                            subtotales.map((pr, i) => (
                                    <div className="itemElemento" key={i+1}>
                                        <div className="titleItem">
                                            <h3>{pr.nombreMateria} x {pr.cantidad}</h3>
                                        </div>
                                        <div className="result">
                                            <span><strong>${new Intl.NumberFormat('es-CO', {currency:'COP'}).format(pr.precio)}</strong> x {pr.cantidad}</span><br />
                                            <br />
                                            <span>Total</span>
                                            <h3>$ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(pr.precio * pr.cantidad).toFixed(0))}</h3>
                                        </div>
                                    </div>
                            ))
                        }

                    </div>
                </div>
                <div className="pricesTotal">
                    <div className="groupPrice">
                        <span>Total</span>
                        <Total valores={todo} />
                        <h3>$ {new Intl.NumberFormat('es-CO', {currency:'COP'}).format(Number(total).toFixed(0))}</h3>
                    </div>
                    {/* <button onClick={() => {
                      !loading ? newCotizacion() : null
                    }}>
                        <span>{loading ? 'Cotizando...' : 'Cotizar'}</span>
                    </button> */}
                </div>
            </div>
        </div>
    )
}

function Total({ valores }){
    return (
        <>
            <h1></h1>
        </>
    )
}