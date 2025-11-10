import React from 'react';
import { MdOutlineEdgesensorHigh, MdOutlineEmojiObjects, MdOutlineFolderDelete, MdOutlineNewspaper, MdOutlineSpaceDashboard } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

export default function LeftNavComprar(){
    const [params, setParams] = useSearchParams();
    return (
        <div className="leftNav">
            <nav>
                <ul>
                    <li onClick={() => {
                        params.set('s', 'proyectos');
                        setParams(params);
                    }}>
                        <div>
                            <MdOutlineSpaceDashboard className="icon" /><br />
                            <span>Proyectos</span>
                        </div>
                    </li>
                    <li onClick={() => {
                        params.set('s', 'kits');
                        setParams(params);
                    }}>
                        <div>
                            <MdOutlineNewspaper className="icon" /><br />
                            <span>Kit's</span>
                        </div>
                    </li>
                    <li onClick={() => {
                        params.set('s', 'productos');
                        setParams(params);
                    }}>
                        <div>
                            <MdOutlineEmojiObjects className='icon'/><br />
                            <span>Productos</span>
                        </div>
                    </li>
                    <li onClick={() => {
                        params.set('s', 'materia');
                        setParams(params);
                    }}>
                        <div>
                            <MdOutlineEdgesensorHigh className="icon" /><br />
                            <span>Necesidad</span>
                        </div>
                    </li>
                    <li onClick={() => {
                        params.set('s', 'borradores');
                        setParams(params);
                    }}>
                        <div>
                            <MdOutlineFolderDelete className="icon" /><br />
                            <span>Borrador de compras</span>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
    )
}