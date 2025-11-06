import React, { useEffect, useState } from "react";
import ModalNewProvider from "./modal/provider";
import { useSearchParams } from "react-router-dom";
import ModalUpdateProvider from "./modal/updateProvider";
import ShowProveedor from "./proveedor/showProveedor";
import ModalNewMp from "./modal/mp";
import ModaUpdateMp from "./modal/updateMp";
import ShowMateriaPrima from "./materia/showMateriaPrima";
import { useDispatch, useSelector } from "react-redux";
import * as actions from './../../store/action/action';
import ItemMP from "./itemMp";
import Loading from "../loading";
import { AiOutlinePlus } from "react-icons/ai";


export default function MateriaPrima(){
    const [params, setParams] = useSearchParams();

    const dispatch = useDispatch();
    const pm = useSelector(store => store.prima); 
    const { primas, loadingPrimas } = pm;

    const system = useSelector(store => store.system); 
    const { categorias, lineas } = system

    const [word, setWord] = useState(null);
    const [cat, setCat] = useState(null);
    const [li, setLi] = useState(null);

    
    const handleExportarCSV = () => {
        // 1. Definir los encabezados de tu archivo CSV
        const encabezados = ['Código', 'Nombre', 'Descripción', 'Medida', 'Unidad'];

        // 2. Mapear los datos filtrados al formato CSV
        const filas = primas.map(materia => {
            // Para cada materia prima, crea una fila con los datos que quieres
            return [
                materia.id,
                materia.item.replace(/,/g, ''), // Quitamos comas para no romper el CSV
                materia.description.replace(/,/g, ''),
                materia.medida,
                materia.unidad
            ].join(','); // Unimos las celdas con una coma
        });

        // 3. Unir encabezados y filas
        // CÓDIGO CORREGIDO Y MÁS ROBUSTO
        const encabezadosCSV = encabezados.join(',');
        const filasCSV = filas.join('\n');

        // La magia está aquí: \uFEFF es el BOM y sep=, es la pista para Excel
        const csvContent = '\uFEFF' + 'sep=,\n' + encabezadosCSV + '\n' + filasCSV;

        // 4. Crear y disparar la descarga
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        
        link.setAttribute("href", url);
        link.setAttribute("download", "reporte_materia_prima.csv"); // Nombre del archivo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    useEffect(() => {
        if(primas){
            dispatch(actions.axiosToGetPrimas(false)) 
        }else{
            dispatch(actions.axiosToGetPrimas(true)) 
        }
    }, [])
    return (
        <div className="provider">
            <div className="containerProviders Dashboard-grid">
                <div className="topSection">
                    <div className="title">
                        <h1>Materia prima </h1>
                    </div>
                    <div className="optionsFast">
                        <nav>
                            <ul>
                                <li style={{marginRight:5}}>
                                    <button onClick={handleExportarCSV}>
                                        <span>Descargar</span>
                                    </button>
                                </li>
                            </ul>
                        </nav> 
                    </div>
                </div>
                <div className="listProviders">
                    <div className="containerListProviders">
                        <div className="topSearchData">
                            <div className="divideSearching">
                                <div className="data">
                                    <h3>Cantidad en el sistema { primas?.length && (`(${primas.length})`)}</h3>
                                    <button onClick={() => {
                                        params.set('w', 'newMp');
                                        setParams(params);
                                    }}>
                                        <AiOutlinePlus className="icon" />
                                    </button>
                                </div>
                                <div className="filterOptions">
                                    <div className="inputDivA">
                                        <div className="inputUX">
                                            <input type="text" placeholder="Buscar aquí..." onChange={(e) => {
                                                setWord(e.target.value)
                                            }} />
                                        </div>
                                        <div className="filtersUX">
                                            <select name="" id=""  style={{width:150}} onChange={(e) => {
                                                return setCat(e.target.value)
                                            }}>
                                                <option value="">Categoría</option>
                                                {
                                                    categorias && categorias.length ?
                                                    categorias.map((c, i) => {
                                                        return (
                                                            c.type == 'MP' ? 
                                                                <option key={i+1} value={c.id}>{c.name.toUpperCase()}</option>
                                                            : null
                                                        )
                                                    })
                                                    :null
                                                }

                                            </select>
                                            <select name="" id="" onChange={(e) => {
                                                return setLi(e.target.value)
                                            }}>
                                                <option value="">Líneas</option>
                                                {
                                                    lineas && lineas.length ?
                                                    lineas.map((c, i) => {
                                                        return (
                                                            c.type == 'MP' ? 
                                                                <option key={i+1} value={c.id}>{c.name.toUpperCase()}</option>
                                                            : null
                                                        )
                                                    })
                                                    :null
                                                }

                                            </select>

                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div><br />

                        <div className="table TableUX">
                            {
                                !primas || loadingPrimas ?
                                    <Loading />
                                :
                                <table >
                                    <thead> 
                                        <tr>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th>Precio promedio</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                        
                                            primas == 404 ? 0 :
                                            primas && primas.length ?
                                                  word || cat || li?
                                                          primas.filter(m => {
                                                            const porLetra = word ?  m.description.toLowerCase().includes(word.toLowerCase()) ||
                                                            m.item.toLowerCase().includes(word.toLowerCase()): true;
                                                            const porLinea = li ? m.lineaId == li : true;
                                                            const porCategoria = cat ? m.categoriumId == cat : true;

                                                            return porLetra && porLinea && porCategoria
                                                          }
                                                          ).map((pv, i) => {
                                                              return (
                                                                <ItemMP key={i+1} pv={pv} />
                                                              )
                                                          })
                                                  :
                                                  primas && primas.length ?
                                                    primas.map((pv, i) => {
                                                        return (
                                                            <ItemMP key={i+1} pv={pv} />
                                                        )
                                                    })
                                                : <ItemMP key={i+1} pv={pv} />
                                              : <h1>No hay resultados</h1>
                                        }
                                    </tbody>
                                </table>
                            }
                        </div>
                    </div>
                </div>
                {
                    params.get('prima') ?
                        <ShowMateriaPrima />
                    : null
                }
            </div>
            {
                params.get('w') == 'newMp' ?
                    <ModalNewMp />
                :params.get('w') == 'updateMp' ?
                    <ModaUpdateMp />    
                : null
            }
        </div>
    )
}