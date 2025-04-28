import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as actions from '../../../store/action/action';
import { useDispatch } from "react-redux";
import axios from "axios";

export default function ModalUpdateProvider(){
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        proveedorId: null,
        nit:null,
        nombre: null,
        siglas: null,
        email:null,
        direccion:null,
        ciudad: null,
        departamento:null,
        pais:null,
        fijo:null,
        phone:null,
        type: 'MP'

    });

    const createProvider = async() => {
        if(!form.proveedorId){
            return dispatch(actions.HandleAlerta('No puedes dejar campos vacios', 'negative'))
        }else{
            const body = {
                type: form.type,
                nit:form.nit,
                email: form.email,
                img:null,
                nombre:form.nombre,  
                siglas:form.siglas,
                direccion:form.direccion,
                ciudad: form.ciudad,
                departamento: form.departamento,
                pais:form.pais,
                fijo:form.fijo,
                phone:form.phone
            }

            const sendPeticion = await axios.put('api/proveedores/new', body)
            .then((res) => {
                dispatch(actions.HandleAlerta('Proveedor creado con éxito', 'positive'))
                dispatch(actions.axiosToGetProviders(false))
                params.delete('w');
                setParams(params);
            }).catch(err => {
                dispatch(actions.HandleAlerta('Ha ocurrido un error', 'mistake'))
            });

            return sendPeticion;
        }
    }
    return(
        <div className="modal">
            <div className="hiddenModal" onClick={() => {
                params.delete('w');
                setParams(params);
            }}></div>
            <div className="containerModal">
                <div className="top">
                    <h3>
                        Nuevo proveedor
                    </h3>
                </div>
                <div className="bodyModal">
                    <div className="form">
                        <div className="inputDiv">
                            <label htmlFor="">NIT </label><br />
                            <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                setForm({
                                    ...form,
                                    nit: e.target.value
                                })
                            }} value={form.nit} />
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Nombre del proveedor</label><br />
                            <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                setForm({
                                    ...form,
                                    nombre: e.target.value
                                })
                            }} value={form.nombre} />
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">SIGLAS</label><br />
                            <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                setForm({
                                    ...form,
                                    siglas: e.target.value
                                })
                            }} value={form.siglas} />
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Correo eléctronico</label><br />
                            <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                setForm({
                                    ...form,
                                    email: e.target.value
                                })
                            }} value={form.email} />
                        </div>
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
                            <label htmlFor="">Ciudad</label><br />
                            <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                setForm({
                                    ...form,
                                    ciudad: e.target.value
                                })
                            }} value={form.ciudad} />
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Departamento</label><br />
                            <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                setForm({
                                    ...form,
                                    departamento: e.target.value
                                })
                            }} value={form.departamento} />
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">País</label><br />
                            <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                setForm({
                                    ...form,
                                    pais: e.target.value
                                })
                            }} value={form.pais} />
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
                            <label htmlFor="">Tipo de proveedor</label><br />
                            <select name="" id="" onChange={(e) => {
                                setForm({
                                    ...form,
                                    type: e.target.value
                                })
                            }} value={form.type} >
                                <option value="MP">Materia prima</option>
                                <option value="Comercial">Productos comercializables</option>
                            </select>
                        </div>
                        <div className="inputDiv">
                            <button className="create" onClick={() => createProvider()}>
                                <span>Crear proveedor</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}