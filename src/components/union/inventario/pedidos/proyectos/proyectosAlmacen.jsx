import React, { useEffect } from 'react';
import ListProyectos from './listProyectosAlmacen';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../../../store/action/action';

export default function ProyectosAlmacen(){

    const dispatch = useDispatch();
    const almacen = useSelector(store => store.almacen)
    const { proyectos, loadingProyectos } = almacen;

    useEffect(() => {
        dispatch(actions.axiosToGetProjects(true));
    }, []) 
    console.log(proyectos)
    return (
        <div className="">
            {
                !proyectos || loadingProyectos ? <h1>Cargando</h1>
                : proyectos == 'notrequest' || proyectos == 404? 
                <h1>NO hemos encontrado esto</h1>
                : !proyectos ? null :
                <ListProyectos proyectos={proyectos} /> 

            }
        </div>
    )
}