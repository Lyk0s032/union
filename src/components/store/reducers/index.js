import { combineReducers } from "redux";

import usuario from './usuario';
import system from "./system";
import provider from "./provider";
import prima from "./mp";
import kits from "./kit";
import cotizacions from "./cotizacion";



const appReducer = combineReducers({
    usuario,
    system,
    provider,
    prima,
    kits,
    cotizacions
});

export default appReducer 