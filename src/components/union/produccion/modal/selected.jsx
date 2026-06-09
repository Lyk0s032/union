import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { OneElement } from "../calculo";
import axios from "axios";
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from "react-redux";
import { BsPencil, BsThreeDots } from "react-icons/bs";
import { MdDeleteOutline, MdOutlineDeleteOutline } from "react-icons/md";
import { useSearchParams } from "react-router-dom";

// Menú flotante renderizado en document.body via Portal
function DropdownPortal({ anchorRef, onClose, children }) {
    const [pos, setPos] = useState({ top: 0, left: 0 });
    const menuRef = useRef(null);

    useEffect(() => {
        if (anchorRef.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setPos({
                top: rect.bottom + window.scrollY + 4,
                left: rect.right + window.scrollX - 200,
            });
        }
    }, [anchorRef]);

    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target) && !anchorRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [onClose, anchorRef]);

    return ReactDOM.createPortal(
        <div
            ref={menuRef}
            style={{
                position: 'absolute',
                top: pos.top,
                left: pos.left,
                zIndex: 99999,
                backgroundColor: '#FFF',
                border: '1px solid #ccc',
                borderRadius: 5,
                boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                minWidth: 200,
                padding: '8px 0',
            }}
        >
            {children}
        </div>,
        document.body
    );
}

// Botón con menú de opciones
function ItemMenu({ item, onEdit, onDelete, onCalibre }) {
    const [open, setOpen] = useState(false);
    const btnRef = useRef(null);

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
                ref={btnRef}
                className="btnOptions"
                onClick={() => setOpen(v => !v)}
            >
                <BsThreeDots className="icon" />
            </button>
            {open && (
                <DropdownPortal anchorRef={btnRef} onClose={() => setOpen(false)}>
                    <div style={{ padding: '4px 0' }}>
                        <strong style={{ padding: '6px 16px', display: 'block', fontSize: 12, color: '#046290' }}>
                            Opciones rápidas
                        </strong>
                        {item.materium.unidad === 'mt2' && (
                            <div
                                className="dropdown-item-option"
                                onClick={() => { onCalibre(); setOpen(false); }}
                            >
                                <BsPencil style={{ marginRight: 8 }} />
                                <span>Cambiar calibre</span>
                            </div>
                        )}
                        <div
                            className="dropdown-item-option"
                            onClick={() => { onEdit(); setOpen(false); }}
                        >
                            <BsPencil style={{ marginRight: 8 }} />
                            <span>Editar</span>
                        </div>
                        <div
                            className="dropdown-item-option"
                            onClick={() => { onDelete(); setOpen(false); }}
                        >
                            <MdDeleteOutline style={{ marginRight: 8 }} />
                            <span>Eliminar</span>
                        </div>
                    </div>
                </DropdownPortal>
            )}
        </div>
    );
}

export default function Selected({ kit, number, selectArea }) {
    const dispatch = useDispatch();
    const [fast, setFast] = useState(null);
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const [codeSeg, setCodeSeg] = useState(null);
    const segmentoNameRef = useRef(null);
    const [params, setParams] = useSearchParams();

    const deleteItem = async (item) => {
        const body = {
            itemKitId: item.id,
            userId: user.user.id,
            kitId: kit.id,
            itemId: item.materium.id
        };
        await axios.delete('/api/kit/remove/item', { data: body })
            .then(() => {
                dispatch(actions.axiosToGetKit(false, kit.id));
                dispatch(actions.HandleAlerta('Item removido', 'positive'));
            })
            .catch(() => {
                dispatch(actions.HandleAlerta('No hemos logrado remover este item', 'mistake'));
            });
    };

    const changeNameSegmento = async (name, areaId) => {
        if (!name) return dispatch(actions.HandleAlerta('Debes ingresar nombre al segmento', 'mistake'));
        const body = { areaId, name, userId: user.user.id };
        await axios.put('/api/kit/add/segmento', body)
            .then(() => {
                dispatch(actions.HandleAlerta('¡Nombre actualizado!', 'positive'));
                dispatch(actions.axiosToGetKit(false, kit.id));
                setCodeSeg(null);
            })
            .catch(() => {
                dispatch(actions.HandleAlerta('No hemos logrado actualizar este segmento, intentalo más tarde', 'mistake'));
            });
    };

    const deleteSegmento = async (areaId) => {
        if (!areaId) return;
        await axios.delete(`/api/kit/segmento/delete/segmento/${areaId}`)
            .then(() => {
                dispatch(actions.HandleAlerta('¡Segmento eliminado!', 'positive'));
                dispatch(actions.axiosToGetKit(false, kit.id));
            })
            .catch(() => {
                dispatch(actions.HandleAlerta('No hemos logrado eliminar este segmento, intentalo más tarde', 'mistake'));
            });
    };

    useEffect(() => {
        if (codeSeg && segmentoNameRef.current) {
            segmentoNameRef.current.focus();
        }
    }, [codeSeg]);

    return (
        <div>
            {kit.areaKits?.length
                ? kit.areaKits.map((ar, i) => (
                    <div
                        className={number == ar.id ? "segmentoKits Active" : "segmentoKits"}
                        key={i + 1}
                        onDoubleClick={() => selectArea(number == ar.id ? null : ar.id)}
                    >
                        <div className="titleTopSegmento">
                            <div className="titleThis" onClick={() => setCodeSeg(ar.id)}>
                                {codeSeg && ar.id == codeSeg
                                    ? <input
                                        type="text"
                                        ref={segmentoNameRef}
                                        defaultValue={ar.name}
                                        onBlur={() => setCodeSeg(null)}
                                        onKeyDown={(e) => {
                                            if (e.code === 'Enter') changeNameSegmento(e.target.value, ar.id);
                                        }}
                                    />
                                    : <h3>{ar.name} </h3>
                                }
                            </div>
                            <div className="optionsTitleThis">
                                <nav><ul><li>
                                    <div>
                                        <button style={{ background: 'transparent', borderWidth: 0 }} onClick={() => deleteSegmento(ar.id)}>
                                            <span style={{ fontSize: 16 }}><MdOutlineDeleteOutline /></span>
                                        </button>
                                    </div>
                                </li></ul></nav>
                            </div>
                        </div>

                        <div className="AllElementsHere">
                            <div className="data">
                                <table>
                                    <tbody>
                                        {kit.itemKits?.length
                                            ? kit.itemKits.map((item, j) => {
                                                if (item.areaId != ar.id) return null;
                                                if (fast == item.id) return <ToFastEdit key={item.id} kit={kit} item={item} ParaElHijo={setFast} />;
                                                return (
                                                    <tr key={j + 1}>
                                                        <td className="larger">
                                                            <div className="codeAndName">
                                                                <h3><span>{item.materium.id}</span> - {item.materium.description}</h3>
                                                            </div>
                                                        </td>
                                                        <td className="edit"  onDoubleClick={() => setFast(item.id)}>
                                                            <div className="howMany">
                                                                <strong>{item.medida} <span>{item.materium.unidad}</span></strong>
                                                            </div>
                                                        </td>
                                                        <td className="edit">
                                                            <h3><ValorSelected item={item} /></h3>
                                                        </td>
                                                        <td className="option">
                                                            <ItemMenu
                                                                item={item}
                                                                onEdit={() => setFast(item.id)}
                                                                onDelete={() => deleteItem(item)}
                                                                onCalibre={() => {
                                                                    params.set('almacen', item.id);
                                                                    setParams(params);
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                            : null
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ))
                : null
            }

            <table>
                <thead>
                    <tr><th></th><th></th><th></th><th></th></tr>
                </thead>
                <tbody>
                    {kit.itemKits?.length
                        ? kit.itemKits.map((item, i) => {
                            if (item.areaId) return null;
                            if (fast === item.id) return <ToFastEdit key={item.id} kit={kit} item={item} ParaElHijo={setFast} />;
                            return (
                                <tr key={i + 1}>
                                    <td className="larger">
                                        <div className="codeAndName">
                                            <h3><span>{item.materium.id}</span> - {item.materium.description} </h3>
                                            <span>Calibre: {item.calibre}</span>
                                        </div>
                                    </td>
                                    <td className="edit" onDoubleClick={() => setFast(item.id)}>
                                        <div className="howMany">
                                            <strong>{item.medida} <span>{item.materium.unidad}</span></strong>
                                        </div>
                                    </td>
                                    <td className="edit">
                                        <h3><ValorSelected item={item} /></h3>
                                    </td>
                                    <td className="option">
                                        <ItemMenu
                                            item={item}
                                            onEdit={() => setFast(item.id)}
                                            onDelete={() => deleteItem(item)}
                                            onCalibre={() => {
                                                params.set('almacen', item.id);
                                                setParams(params);
                                            }}
                                        />
                                    </td>
                                </tr>
                            );
                        })
                        : null
                    }
                </tbody>
            </table>
        </div>
    );
}

function ToFastEdit({ item, ParaElHijo, kit }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(null);
    const [form, setForm] = useState({
        medida: item.medida || '',
        cantidad: item.cantidad || 1,
    });
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;
    const inputRef = useRef(null);
    const HandleClose = () => ParaElHijo(null);

    const updateKit = async () => {
        setLoading(true);
        const body = {
            itemKitId: item.id,
            medida: form.medida,
            kitId: kit.id,
            materiaId: item.materium.id,
            cantidad: form.cantidad,
            userId: user.user.id
        };
        await axios.put('api/kit/add/item', body)
            .then(() => {
                dispatch(actions.axiosToGetKit(false, kit.id));
                dispatch(actions.HandleAlerta('Item actualizado con éxito', 'positive'));
                HandleClose();
            })
            .catch(() => {
                dispatch(actions.HandleAlerta('No hemos logrado actualizar este item', 'mistake'));
            })
            .finally(() => {
                setLoading(false);
                HandleClose();
            });
    };

    useEffect(() => { inputRef.current.focus(); }, []);

    return (
        <tr>
            <td className="larger">
                <div className="codeAndName">
                    <h3><span>{item.materium.id}</span> - {item.materium.description}</h3>
                </div>
            </td>
            <td className="edit">
                <div className="medida">
                    <input
                        type="text"
                        ref={inputRef}
                        onChange={(e) => setForm({ ...form, medida: e.target.value })}
                        value={form.medida}
                        onKeyDown={(e) => {
                            if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                                if (!loading) updateKit();
                            }
                        }}
                        onBlur={() => HandleClose()}
                    />
                </div>
            </td>
            <td className="edit">
                {loading ? <span>Actualizando...</span> : <span>Enter para confirmar</span>}
            </td>
            <td></td>
        </tr>
    );
}

function ValorSelected({ item }) {
    const valor = OneElement(item);
    return (
        <span>{new Intl.NumberFormat('es-CO', { currency: 'COP' }).format(Number(valor).toFixed(0))}</span>
    );
}
