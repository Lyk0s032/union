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




const appReducer = combineReducers({
    usuario,
    system,
    provider,
    prima,
    kits,
    cotizacions,
    requisicion,
    clients,
    admin
});

export default appReducer 