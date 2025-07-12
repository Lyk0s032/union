import React, { useEffect, useState, useMemo } from "react";
import ItemToSelect from "./itemToSelect";
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from "react-redux";

export default function SearchKits({ number }) {
    const dispatch = useDispatch();
    const { primas } = useSelector(store => store.prima);
    const { kit } = useSelector(store => store.kits);
    
    const [cat, setCat] = useState(''); // Usar string vacío como valor inicial
    const [li, setLi] = useState('');
    const [word, setWord] = useState('');
    const { categorias, lineas } = useSelector(store => store.system);

    useEffect(() => {
        if (!primas) {
            dispatch(actions.axiosToGetPrimas(false));
        }
    }, [primas, dispatch]);

    // 1. Usamos 'useMemo' para calcular la lista filtrada de forma eficiente.
    // Este cálculo solo se volverá a ejecutar si 'primas', 'kit', 'word', 'cat', o 'li' cambian.
    const materiasFiltradas = useMemo(() => {
        // Si no hay materias primas cargadas, retornamos un arreglo vacío.
        if (!primas) return [];

        // Creamos un Set con los IDs de los materiales que ya están en el kit para una búsqueda rápida.
        const idsEnElKit = new Set(kit.itemKits.map(item => item.materium.id));

        return primas.filter(m => {
            // 2. Lógica de filtrado corregida y más clara
            const porTexto = word ? m.description.toLowerCase().includes(word.toLowerCase()) || String(m.item).includes(word) : true;
            const porCategoria = cat ? m.categoriumId == cat : true;
            const porLinea = li ? m.lineaId == li : true;
            
            // 3. El filtro 'diferente' ahora busca correctamente en 'kit.itemKits'

            return porTexto && porCategoria && porLinea ;
        });
    }, [primas, kit.itemKits, word, cat, li]);

    return (
        <div className="containerRightSelect">
            <div className="topSelect">
                <div className="boxAllInOne">
                    <div className="containerBoxAll">
                        <div className="containerSearch" style={{width:'100%'}}>
                            <div className="searchInputDiv">
                                <div className="inputDiv">
                                    <input type="text" placeholder="Pedestal 2X1" onChange={(e) => {
                                        setWord(e.target.value)
                                    }} />
                                </div>
                                <div className="filtersInput">
                                    <select style={{width:'30%'}} value={cat} onChange={(e) => setCat(e.target.value)}>
                                        <option value="">Categorías</option>
                                        {categorias?.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
                                        ))}
                                    </select>
                                    <select value={li} onChange={(e) => setLi(e.target.value)}>
                                        <option value="">Líneas</option>
                                        {lineas?.filter(l => l.type === 'MP').map((c) => (
                                            <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="resultsToSelect">
                <div className="tabla">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Medida / Cant.</th>
                                <th>Precio Promedio</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {materiasFiltradas.length > 0 ? (
                                materiasFiltradas.map((pv) => (
                                    // 4. Usamos 'pv.id' como 'key', que es único y estable.
                                    <ItemToSelect kitt={pv} key={pv.id} number={number} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">Sin resultados</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}