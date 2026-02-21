import { combineReducers } from "redux";

import usuario from './usuario';
import system from "./system";
import provider from "./provider";
import prima from "./mp";
import kits from "./kit";
import cotizacions from "./cotizacion";
import requisicion from "./requisicion";
import clients from "./clients";
import admin from "./administration";
import noti from "./notificaciones";
import almacen from './almacen';
import remisiones from './remisiones';



const appReducer = combineReducers({
    noti,
    usuario,
    system,
    provider,
    prima,
    kits,
    cotizacions,
    requisicion,
    clients,
    admin,
    almacen,
    remisiones
});

export default appReducer 