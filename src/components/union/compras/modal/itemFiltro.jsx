import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { MdCheck } from "react-icons/md";

export default function ItemFiltro(props){
    const [canal, setCanal] = useState(null);
    const filtro = props.filt;

    const [form, setForm] = useState({
        code: filtro.code,
        name: filtro.name,
        description: filtro.description,
        type: filtro.type
    })
    return (
        !canal ?
            <tr >
                <td>{filtro.code}</td>
                <td>{filtro.name}</td>
                <td>{filtro.description}</td>
                <td>
                    {filtro.type}
                </td>
                <td>

                </td>
            </tr>       
            : 
            <tr className="new">
                    <td >
                        {form.code}
                    </td>
                    <td >
                        <input type="text" value={form.name} />
                    </td>           
                    <td>
                        <input type="text" value={form.description}/>
                    </td>
                    <td>
                        <select name="" id="" value={form.type}>
                            <option value="MP">Materia prima</option>
                            <option value="comercial">Comercializar</option>
                        </select>
                    </td>
                    <td className="closeItem">
                        <div className="flex">
                            <button className="great">
                                <MdCheck />
                            </button>
                            <button className="cancel" onClick={() => setCanal(null)}>
                                <AiOutlineClose />
                            </button>
                        </div>
                    </td>
                </tr>
    )
}