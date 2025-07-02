import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../../store/action/action';
import axios from 'axios';

export default function NewClient(){
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();

    const [divipolaData, setDivipolaData] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [municipios, setMunicipios] = useState([]);

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        nit:"",
        persona: 'juridica',
        code: "",
        nombre: null,
        name: null,
        lastName: null,
        siglas: null,
        email:null,
        direccion:null,
        ciudad: '',
        departamento:'',
        pais:'colombia',
        fijo:null,
        phone:null,
    });
    const usuario = useSelector(store => store.usuario);
    const { user } = usuario;

     const searchDeparamentos = async () => {
        try {
            const res = await axios.get("https://www.datos.gov.co/resource/gt2j-8ykr.json?$limit=2000");
            setDivipolaData(res.data);
            
            // CAMBIO: Usamos los nuevos nombres de campo de la API
            const uniqueDepartamentos = Array.from(new Set(res.data.map(d =>
                `${d.departamento_nom}-${d.departamento}` 
            )));

            setDepartamentos(uniqueDepartamentos);
        } catch (error) {
            console.error("Error fetching Divipola data:", error);
            dispatch(actions.HandleAlerta('No se pudo cargar la lista de departamentos', 'negative'));
        }
    }

    const createClient = async() => {
        if(form.persona == 'juridica' && !form.nombre) return dispatch(actions.HandleAlerta('Ingresa un nombre de empresa', 'negative'))
        if(form.persona == 'natural' && !form.name) return dispatch(actions.HandleAlerta('Ingresa nombre del proveedor ', 'negative'))
        if(form.persona == 'natural' && !form.lastName) return dispatch(actions.HandleAlerta('Ingresa apellidos del proveedor ', 'negative'))

        if(!form.nit || !form.email || !form.direccion || !form.ciudad ||  !form.fijo || !form.phone){
           
            return dispatch(actions.HandleAlerta('No puedes dejar campos vacios', 'negative'))
        }else{
            setLoading(true);
            const body = {
                type: form.persona,
                nit: form.code ? `${form.nit}-${form.code}` : `${form.nit}`,
                email: form.email,
                img:null, 
                nombre:form.persona == 'juridica' ? form.nombre : `${form.name} ${form.lastName}`,  
                siglas:form.siglas,
                direccion:form.direccion,
                ciudad: form.ciudad,
                departamento: form.departamento,
                pais:form.pais,
                fijos:[form.fijo],
                phone:form.phone,
                userId: user.user.id
            }  

            const sendPeticion = await axios.post('api/client/new', body)
            .then((res) => {
                dispatch(actions.HandleAlerta('Cliente creado con éxito', 'positive'))
                dispatch(actions.axiosToGetClients(false));
                params.delete('c');
                setParams(params);
            }).catch(err => {
                dispatch(actions.HandleAlerta('Ha ocurrido un error', 'mistake'))
            }).finally(f => {
                setLoading(false);
            });

            return sendPeticion;
        } 
    } 

    useEffect(() => {
        searchDeparamentos()
    }, [])


    useEffect(() => {
        if (form.departamento && divipolaData.length > 0) {
            const [codigoDepto] = form.departamento.split('-');
            // CAMBIO: Usamos el nuevo nombre de campo para filtrar
            const filtered = divipolaData.filter(m => m.departamento === codigoDepto);
            setMunicipios(filtered);
        } else {
            setMunicipios([]);
        }
    }, [form.departamento, divipolaData]);

    return (
        <div className="modal">
            <div className="hiddenModal" onClick={() => {
                params.delete('c');
                setParams(params);
            }}></div>
            <div className="containerModal">
                <div className="top">
                    <h3>
                        Nuevo cliente
                    </h3>
                </div>
                <div className="bodyModal">
                    <div className="form">
                        
                        <div className="inputDiv">
                            <label htmlFor="">Tipo {form.persona}</label><br />
                            <select name="" id="" onChange={(e) => {
                                setForm({
                                    ...form,
                                    persona: e.target.value
                                })
                            }} value={form.persona} >
                                <option value="juridica">Juridica</option>
                                <option value="natural">Natural</option>
                            </select>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">{form.persona == 'juridica' ? 'NIT' : 'Documento de indentificación'} {form.nit} - {form.code && (form.code)}</label><br />
                            <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                setForm({
                                    ...form,
                                    nit: e.target.value
                                })
                            }} value={form.nit} />
                        </div>
                        {
                            form.persona == 'juridica' ?
                                <div className="inputDiv">
                                    <label htmlFor="">Dígito de Verificación (DV) </label><br />
                                    <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                        setForm({
                                            ...form,
                                            code: e.target.value
                                        })
                                    }} value={form.code} />
                                    
                                
                                </div>
                            :null
                        }
                        {
                            form.persona == 'juridica' ?
                            <div className="inputDiv">
                                <label htmlFor="">Nombre de la empresa {form.nombre}</label><br />
                                <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                    setForm({
                                        ...form,
                                        nombre: e.target.value 
                                    })
                                }} value={form.nombre} />
                            </div>
                            :null
                        }
                        { 
                            form.persona == 'natural' ?
                            <div className="">
                                <div className="inputDiv">
                                    <label htmlFor="">Nombre {form.name} {form.lastName}</label><br />
                                    <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                        setForm({
                                            ...form,
                                            name: e.target.value
                                        })
                                    }} value={form.name} />
                                </div>
                                <div className="inputDiv">
                                    <label htmlFor="">Apellidos</label><br />
                                    <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                        setForm({
                                            ...form,
                                            lastName: e.target.value
                                        })
                                    }} value={form.lastName} />
                                </div>
                            </div>
                            :null
                        }
                        {
                            form.persona == 'juridica' ?
                            <div className="inputDiv">
                                <label htmlFor="">SIGLAS</label><br />
                                <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                    setForm({
                                        ...form,
                                        siglas: e.target.value
                                    })
                                }} value={form.siglas} />
                            </div>
                            :null
                        }
                        <div className="inputDiv"> 
                            <label htmlFor="">Dirección</label><br />
                            <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                setForm({
                                    ...form,
                                    direccion: e.target.value
                                })
                            }} value={form.direccion} />
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">País</label><br />
                            <select type="text" placeholder="Escribe aquí" onChange={(e) => {
                                setForm({
                                    ...form,
                                    pais: e.target.value
                                })
                            }} value={form.pais} >
                                <option value="colombia">Colombia</option>
                            </select>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Departamento </label><br />
                            <select onChange={(e) => {
                                setForm({
                                    ...form,
                                    departamento: e.target.value,
                                    // Reseteamos la ciudad al cambiar de depto
                                    ciudad: ""
                                })
                            }} value={form.departamento} >
                                <option value="">Selecciona un Departamento</option>
                                {departamentos.map(dep => {
                                    const [codigo, nombre] = dep.split('-');
                                    return <option key={codigo} value={dep}>{codigo}</option>;
                                })}
                            </select>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Municipio </label><br />
                            <select onChange={(e) => {
                                setForm({
                                    ...form,
                                    ciudad: e.target.value
                                })
                            }} value={form.ciudad} >
                                <option value="">Selecciona un municipio</option>
                                {municipios
    .filter(mun => mun && mun.municipio_nom && mun.municipio) // Filtramos por los nuevos nombres de campo
    .map(mun => (
        // Usamos mun.municipio para la 'key' y mun.municipio_nom para el valor y el texto
        <option key={mun.municipio} value={mun.municipio_nom}>
            {mun.municipio_nom}
        </option>
    ))
}
                            </select>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Correo {form.email}</label><br />
                            <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                setForm({
                                    ...form,
                                    email: e.target.value
                                })
                            }} value={form.email} />
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Teléfono fijo</label><br />
                            <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                setForm({
                                    ...form,
                                    fijo: e.target.value
                                })
                            }} value={form.fijo} />
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Teléfono</label><br />
                            <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                setForm({
                                    ...form,
                                    phone: e.target.value
                                })
                            }} value={form.phone} />
                        </div>
                        <div className="inputDiv">
                            {
                                !loading ?
                                <button className="create" onClick={() => createClient()}>
                                    <span>Crear cliente</span>
                                </button>
                                : 
                                <button className="create">
                                    <span>Creando...</span>
                                </button>
                            }
                        </div>
                    </div> 
                </div>
            </div>
        </div>
    )
}