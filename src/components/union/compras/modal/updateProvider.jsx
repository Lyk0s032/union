import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

export default function ModalUpdateProvider(){

    const prov = useSelector(store => store.provider);
    const { provider } = prov;

    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        proveedorId: provider.id,
        nit:provider.nit.split('-')[0],
        code: provider.nit.split('-')[1],
        nombre: provider.nombre,
        siglas: provider.siglas,
        email:provider.email,
        direccion:provider.direccion,
        ciudad: provider.ciudad,
        departamento:provider.departamento,
        pais:provider.pais,
        fijo:provider.fijo,
        phone:provider.phone,
        type: 'MP'

    });

    const createProvider = async() => {
        if(!provider.id){
            return dispatch(actions.HandleAlerta('No puedes dejar campos vacios', 'negative'))
        }else{
            if(!form.nit || !form.nombre) return dispatch(actions.HandleAlerta('No puedes actualizar sin NIT o nombre, verifica por favor', 'negative'));
            const body = {
                proveedorId: provider.id,
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
                dispatch(actions.axiosToGetProvider(false, provider.id))
                dispatch(actions.axiosToGetProviders(false)) 
                params.delete('w');
                setParams(params);
                return res
            }).catch(err => {
                dispatch(actions.HandleAlerta('Ha ocurrido un error', 'mistake'))
                return err;
            });

            return sendPeticion;
        }
    }
    return(
        <div className="modal">
            <div className="hiddenModal" onClick={() => {
                params.delete('u');
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
                            <label htmlFor="">Nro seguridad </label><br />
                            <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                setForm({
                                    ...form,
                                    code: e.target.value
                                })
                            }} value={form.code} />
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
                            <label htmlFor="">Pais</label><br />
                            <input type="text" placeholder="Escribe aquí" onChange={(e) => {
                                setForm({
                                    ...form,
                                    pais: e.target.value
                                })
                            }} value={form.pais} />
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Departamento</label><br />
                            <select onChange={(e) => {
                                setForm({
                                    ...form,
                                    departamento: e.target.value
                                })
                            }} value={form.departamento} >
                                <option value="">Selecciona departamento</option>
                                <option value="05">Amazonas</option>
                                <option value="08">Antioquia</option>
                                <option value="11">Arauca</option>
                                <option value="13">Atlántico</option>
                                <option value="15">Bolívar</option>
                                <option value="17">Boyacá</option>
                                <option value="18">Caldas</option>
                                <option value="19">Caquetá</option>
                                <option value="20">Casanare</option>
                                <option value="23">Cauca</option>
                                <option value="25">Cesar</option>
                                <option value="27">Chocó</option>
                                <option value="30">Córdoba</option>
                                <option value="32">Cundinamarca</option>
                                <option value="95">Guaviare</option>
                                <option value="97">Guainía</option>
                                <option value="41">Huila</option>
                                <option value="44">La Guajira</option>
                                <option value="47">Magdalena</option>
                                <option value="50">Meta</option>
                                <option value="52">Nariño</option>
                                <option value="54">Norte de Santander</option>
                                <option value="86">Putumayo</option>
                                <option value="63">Quindío</option>
                                <option value="66">Risaralda</option>
                                <option value="88">San Andrés y Providencia</option>
                                <option value="68">Santander</option>
                                <option value="70">Sucre</option>
                                <option value="73">Tolima</option>
                                <option value="76">Valle del Cauca</option>
                                <option value="86">Vaupés</option>
                                <option value="97">Vichada</option>
                                <option value="00">Bogotá (Distrito Capital)</option>
                            </select>
                        </div>
                        <div className="inputDiv">
                            <label htmlFor="">Municipio</label><br />
                            <select onChange={(e) => {
                                setForm({
                                    ...form,
                                    ciudad: e.target.value
                                })
                            }} value={form.ciudad} >
                                    <option value="">Selecciona municipio</option>
                                    <option value="76001">Cali</option>
                                    <option value="76002">Buenaventura</option>
                                    <option value="76003">Palmira</option>
                                    <option value="76004">Tuluá</option>
                                    <option value="76005">Buga</option>
                                    <option value="76006">Cartago</option>
                                    <option value="76007">Zarzal</option>
                                    <option value="76008">Roldanillo</option>
                                    <option value="76009">Guacarí</option>
                                    <option value="76010">El Cerrito</option>
                                    <option value="76011">Dagua</option>
                                    <option value="76012">Yumbo</option>
                                    <option value="76013">La Unión</option>
                                    <option value="76014">Versalles</option>
                                    <option value="76015">La Cumbre</option>
                                    <option value="76016">San Pedro</option>
                                    <option value="76017">Restrepo</option>
                                    <option value="76018">Riofrío</option>
                                    <option value="76019">Trujillo</option>
                                    <option value="76020">Tuluá</option>
                                    <option value="76021">El Águila</option>
                                    <option value="76022">Obando</option>
                                    <option value="76023">Andalucía</option>
                                    <option value="76024">Candelaria</option>
                                    <option value="76025">Ginebra</option>
                                    <option value="76026">Florida</option>
                                    <option value="76027">Restrepo</option>
                                    <option value="76028">Villarica</option>
                                    <option value="76029">La Victoria</option>
                                    <option value="76030">Yotoco</option>
                                    <option value="76031">Candelaria</option>
                                    <option value="76032">El Cairo</option>
                                    <option value="76033">Ansermanuevo</option>
                                    <option value="76034">Caicedonia</option>
                                    <option value="76035">La Cumbre</option>
                                    <option value="76036">Riofrío</option>
                                    <option value="76037">Roldanillo</option>
                                    <option value="76038">San Pedro</option>
                                    <option value="76039">Bugalagrande</option>
                                    <option value="76040">Ginebra</option>
                                    <option value="76041">Toro</option>
                                    <option value="76042">Argelia</option>
                                    <option value="76043">San Juan de los Morros</option>
                                    <option value="76044">Villarica</option>
                                    <option value="76045">La Victoria</option>
                                    <option value="76046">Guacari</option>
                            </select>
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
                                <span>Actualizar proveedor</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}