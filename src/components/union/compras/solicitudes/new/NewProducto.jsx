import React, { useState, useEffect } from 'react';

import * as actions from '../../../../store/action/action';

import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';

import {

    MdInventory2,

    MdStorefront,

    MdSearch,

    MdCheckCircle,

    MdArrowBack,

    MdAttachMoney,

    MdChevronRight,

} from 'react-icons/md';



export default function NewProducto({ requerimiento, close }) {

    const dispatch = useDispatch();

    const sistema = useSelector(store => store.system);

    const { categorias, lineas } = sistema;



    const [loading, setLoading] = useState(false);

    const [searchLoading, setSearchLoading] = useState(false);

    const [step, setStep] = useState(requerimiento?.productoId ? 'proveedor' : 'producto');

    const [productoId, setProductoId] = useState(requerimiento?.productoId || null);

    const [choose, setChoose] = useState(null);

    const [valor, setValor] = useState('');

    const [providerResults, setProviderResults] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');



    const [form, setForm] = useState({

        item: requerimiento?.nombre || '',

        description: requerimiento?.description || '',

        peso: null,

        criticidad: null,

        unidad: 'estatico',

        medida: 1,

        procedencia: 'nacional',

        volumen: null,

        lineaId: null,

        categoriumId: null,

    });



    useEffect(() => {

        if (!categorias?.length || !lineas?.length) {

            dispatch(actions.axiosToGetFiltros(false));

        }

    }, [dispatch, categorias, lineas]);



    const createProducto = async () => {

        if (!form.item || !form.description) {

            return dispatch(actions.HandleAlerta('Debes completar nombre y descripción', 'mistake'));

        }

        if (!form.lineaId || !form.categoriumId) {

            return dispatch(actions.HandleAlerta('Debes seleccionar línea y categoría', 'mistake'));

        }



        setLoading(true);

        try {

            const res = await axios.post('/api/materia/producto/new', form);

            const newProductoId = res.data.id;



            await axios.put('/api/kit/requerimiento/put/give/producto', {

                reqId: requerimiento.id,

                productoId: newProductoId,

            });



            setProductoId(newProductoId);

            setStep('proveedor');

            dispatch(actions.HandleAlerta('Producto registrado. Asigna proveedor y precio.', 'positive'));

            dispatch(actions.axiosToGetRequerimiento(false, requerimiento.id));

            dispatch(actions.axiosToGetRequerimientos(false, 'compras'));

        } catch (err) {

            console.error(err);

            dispatch(actions.HandleAlerta('No hemos logrado registrar el producto', 'mistake'));

        } finally {

            setLoading(false);

        }

    };



    const searchQuery = async (query) => {

        setSearchTerm(query);

        if (!query) {

            setProviderResults(null);

            return;

        }

        setSearchLoading(true);

        try {

            const res = await axios.get('/api/proveedores/get/query', { params: { query } });

            setProviderResults(res.data);

        } catch {

            setProviderResults(null);

        } finally {

            setSearchLoading(false);

        }

    };



    const finishWithProvider = async () => {

        if (!valor) return dispatch(actions.HandleAlerta('Debes ingresar un valor', 'mistake'));

        if (!choose) return dispatch(actions.HandleAlerta('Debes seleccionar un proveedor', 'mistake'));



        const iva = valor * 0.19;

        const total = Number(Number(valor) + Number(iva)).toFixed(0);

        const pid = productoId || requerimiento.productoId;



        setLoading(true);

        try {

            await axios.post('/api/mt/price/pt/give', {

                productoId: pid,

                pvId: choose.id,

                price: total,

                iva,

                descuentos: valor,

            });



            await axios.put('/api/kit/requerimiento/put/finish/producto', {

                reqId: requerimiento.id,

            });



            dispatch(actions.HandleAlerta('Solicitud completada con proveedor y precio', 'positive'));

            dispatch(actions.axiosToGetRequerimiento(false, requerimiento.id));

            dispatch(actions.axiosToGetRequerimientos(false, 'compras'));

            if (close) close();

        } catch (err) {

            console.error(err);

            dispatch(actions.HandleAlerta('No hemos logrado completar la solicitud', 'mistake'));

        } finally {

            setLoading(false);

        }

    };



    const ivaPreview = valor ? (valor * 0.19).toFixed(0) : 0;

    const totalPreview = valor ? Number(Number(valor) + Number(ivaPreview)).toFixed(0) : 0;



    const renderSteps = () => (

        <div className="form-steps">

            <div className={`step-chip ${step === 'producto' ? 'active' : productoId || requerimiento.productoId ? 'done' : ''}`}>

                1. Producto

            </div>

            <div className={`step-chip ${step === 'proveedor' ? 'active' : ''}`}>

                2. Proveedor

            </div>

        </div>

    );



    const renderProveedorStep = () => (

        <div className="solicitud-provider-form">

            {!choose ? (

                <>

                    <div className="form-field">

                        <label>Buscar proveedor</label>

                        <div className="provider-search-wrap">

                            <div className="search-input-wrap">

                                <MdSearch />

                                <input

                                    type="text"

                                    placeholder="NIT, nombre o razón social..."

                                    value={searchTerm}

                                    onChange={(e) => searchQuery(e.target.value)}

                                />

                            </div>

                        </div>

                    </div>



                    {searchLoading && (

                        <div className="provider-results empty">Buscando proveedores...</div>

                    )}



                    {!searchLoading && searchTerm && providerResults?.length > 0 && (

                        <div className="provider-results">

                            {providerResults.map((cl) => (

                                <div key={cl.id} className="provider-card" onClick={() => setChoose(cl)}>

                                    <div className="provider-avatar">

                                        <MdStorefront />

                                    </div>

                                    <div className="provider-info">

                                        <div className="provider-nit">NIT {cl.nit}</div>

                                        <div className="provider-name">{cl.nombre}</div>

                                    </div>

                                    <MdChevronRight className="provider-arrow" />

                                </div>

                            ))}

                        </div>

                    )}



                    {!searchLoading && searchTerm && providerResults && !providerResults.length && (

                        <div className="provider-results empty">No se encontraron proveedores</div>

                    )}



                    {!searchTerm && (

                        <div className="provider-results empty">

                            Escribe para buscar un proveedor

                        </div>

                    )}

                </>

            ) : (

                <>

                    <div className="provider-selected">

                        <div className="provider-avatar">

                            <MdStorefront />

                        </div>

                        <div className="provider-info">

                            <div className="provider-nit">NIT {choose.nit}</div>

                            <div className="provider-name">{choose.nombre}</div>

                        </div>

                        <button type="button" className="btn-change" onClick={() => setChoose(null)}>

                            Cambiar

                        </button>

                    </div>



                    <div className="form-field">

                        <label><MdAttachMoney style={{ verticalAlign: 'middle', marginRight: 4 }} />Precio base (sin puntos ni IVA)</label>

                        <input

                            type="text"

                            placeholder="Ej. 150000"

                            value={valor}

                            onChange={(e) => setValor(e.target.value.replace(/[^\d]/g, ''))}

                        />

                    </div>



                    {valor && (

                        <div className="price-summary">

                            IVA (19%): <strong>${Number(ivaPreview).toLocaleString('es-CO')}</strong>

                            {' · '}

                            Total: <strong>${Number(totalPreview).toLocaleString('es-CO')}</strong>

                        </div>

                    )}



                    <div className="form-actions" style={{ marginTop: 16, padding: 0, background: 'transparent', border: 'none' }}>

                        <button className="btn-secondary" onClick={() => setChoose(null)} disabled={loading}>

                            <MdArrowBack />

                            <span>Regresar</span>

                        </button>

                        <button className="btn-primary" onClick={finishWithProvider} disabled={loading}>

                            <MdCheckCircle />

                            <span>{loading ? 'Guardando...' : 'Completar solicitud'}</span>

                        </button>

                    </div>

                </>

            )}

        </div>

    );



    if (requerimiento.productoId && requerimiento.state !== 'finish' && step !== 'proveedor') {

        return (

            <div className="solicitud-inline-form success-banner">

                {renderSteps()}

                <div className="form-success">

                    <MdCheckCircle className="success-icon" />

                    <h4>Producto registrado</h4>

                    <p className="product-ref">

                        {requerimiento.producto

                            ? `${requerimiento.producto.id} — ${requerimiento.producto.item}`

                            : `#${requerimiento.productoId}`}

                    </p>

                    <p>Falta asignar proveedor y precio para completar la solicitud.</p>

                </div>

                <div className="form-actions">

                    <button className="btn-primary" onClick={() => setStep('proveedor')}>

                        <MdStorefront />

                        <span>Asignar proveedor</span>

                    </button>

                </div>

            </div>

        );

    }



    if (step === 'proveedor') {

        return (

            <div className="solicitud-inline-form">

                <div className="form-header">

                    <div className="form-header-icon">

                        <MdStorefront />

                    </div>

                    <h4>Asignar proveedor y precio</h4>

                    <p>Selecciona el proveedor y define el precio para completar el producto terminado.</p>

                </div>

                {renderSteps()}

                <div className="form-body">

                    {renderProveedorStep()}

                </div>

            </div>

        );

    }



    return (

        <div className="solicitud-inline-form">

            <div className="form-header">

                <div className="form-header-icon">

                    <MdInventory2 />

                </div>

                <h4>Registrar producto terminado</h4>

                <p>Los datos se pre-llenan desde la solicitud. Completa categoría y línea.</p>

            </div>

            {renderSteps()}

            <div className="form-body">

                <div className="form-field">

                    <label>Nombre del producto</label>

                    <input

                        type="text"

                        placeholder="Escribe aquí"

                        value={form.item || ''}

                        onChange={(e) => setForm({ ...form, item: e.target.value })}

                    />

                </div>

                <div className="form-field">

                    <label>Descripción</label>

                    <textarea

                        placeholder="Descripción del producto..."

                        value={form.description || ''}

                        onChange={(e) => setForm({ ...form, description: e.target.value })}

                    />

                </div>

                <div className="form-row">

                    <div className="form-field">

                        <label>Categoría</label>

                        <select

                            value={form.categoriumId || ''}

                            onChange={(e) => setForm({ ...form, categoriumId: parseInt(e.target.value) })}

                        >

                            <option value="">Seleccionar</option>

                            {categorias?.map((cat, i) => (

                                <option key={i} value={cat.id}>{cat.name}</option>

                            ))}

                        </select>

                    </div>

                    <div className="form-field">

                        <label>Línea</label>

                        <select

                            value={form.lineaId || ''}

                            onChange={(e) => setForm({ ...form, lineaId: parseInt(e.target.value) })}

                        >

                            <option value="">Seleccionar</option>

                            {lineas?.map((linea, i) => (

                                <option key={i} value={linea.id}>{linea.name}</option>

                            ))}

                        </select>

                    </div>

                </div>

            </div>

            <div className="form-actions">

                {close && (

                    <button className="btn-secondary" onClick={close} disabled={loading}>

                        <span>Cancelar</span>

                    </button>

                )}

                <button className="btn-primary" onClick={createProducto} disabled={loading}>

                    <MdInventory2 />

                    <span>{loading ? 'Registrando...' : 'Registrar producto'}</span>

                </button>

            </div>

        </div>

    );

}


