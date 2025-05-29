import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import NewComponent from './newComponent';
import * as actions from './../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';

export default function Home(){
    const [params, setParams] = useSearchParams();
    const dispatch = useDispatch();
    const superK = useSelector(store => store.kits);
    const { superKits, loadingSuperKits, superKit, loadingSuperKit} = superK;

    console.log(superK)
 
    useEffect(() => {
       if(!superKits){
            dispatch(actions.axiosToGetSuperKits(false))
       }
    }, [])
    return (
        <div className="homeViewGaleria">
            <div className="containerHomeView">
                <div className="topPage">
                    <div className="left">
                        <h3>Librería de componentes</h3>
                    </div>
                    <div className="rightOptions">
                        <nav>
                            <ul>
                                <li>
                                    <div>
                                        <span>Solicitar kit</span>
                                    </div>
                                </li>
                                <li>
                                    <button onClick={() => {
                                        params.set('c', 'new')
                                        setParams(params);
                                    }}>
                                        <span>Nuevo componente</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <div className="divideParallaxToWork">
                    <div className="containerDivide">
                        <div className="leftParallax">
                            <div className="topSearch">
                                <div className="leftSearch">
                                    <input type="text" placeholder='Buscar componente' />
                                </div>
                                <div className="rightFilter" style={{
                                    display:'flex',
                                    justifyContent:'end',
                                    alignItems:'center'
                                }}>
                                    <nav>
                                        <ul>
                                            <li>
                                                <label htmlFor="">Categoría</label><br />
                                                <select name="" id="">
                                                    <option value="">Seleccionar</option>
                                                    <option value="">Escritorio</option>
                                                    <option value="">Sillas</option>
                                                </select>
                                            </li>
                                        </ul>
                                    </nav>
                                    <button onClick={() => dispatch(actions.axiosToGetSuperKits(false))} 
                                        style={{marginLeft:10}}>
                                        <span>Reload</span>
                                    </button>
                                </div>
                            </div>
                            <div className="allComponentsDiv">
                                <div className="containerAll">
                                    <div className="title">
                                        <span>2 Elementos encontrados</span>
                                    </div>
                                    <div className="listaComponents">
                                        <div className="containerLista">

                                        {
                                            !superKits || loadingSuperKits ?
                                                <h1>Cargando...</h1>
                                            :
                                            superKits && superKits.length ?
                                                superKits.map((k, i) => {
                                                    return (
                                                    <div className="component" key={i+1} onClick={() => {
                                                        dispatch(actions.axiosToGetSuperKit(true, k.id))
                                                    }}> 
                                                        <div className="img">
                                                        <img src={k.img} alt="" />
                                                        </div>
                                                        <div className="nameComponente">
                                                            <span>{k.name}</span>
                                                        </div>
                                                    </div>
                                                    )
                                                })
                                            : <h1>Sin resultados</h1>
                                        }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rightWatch">
                            <div className="topTitle">
                                <h3>Visualizar</h3>
                            </div>
                            {
                                
                                loadingSuperKit ?
                                    <h1>Cargando</h1>
                                : !superKit ?
                                    <h1>Selecciona un SuperKit para visualizar</h1>
                                : 
                                    <div className="boxVisualizarChoose">
                                        <div className="topImg">
                                            <img src={superKit.img} alt="" />
                                        </div>
                                        <div className="generalDetails">
                
                                            <div className="data">
                                                <div className="items">
                                                    <span>Nombre</span>
                                                    <h3>{superKit.name}</h3>
                                                </div>
                                                <div className="items">
                                                    <span>Creado el</span>
                                                    <h3>{superKit.createdAt.split('T')[0]}</h3>
                                                </div> 
                                                <div className="items">
                                                    <span>Creado por</span>
                                                    <h3>Kevin Andrés</h3>
                                                </div>
                                                <div className="items">
                                                    <span>Mostrar Kit's en Cotización</span>
                                                    <h3>{superKit.show ? 'Si' : 'No'}</h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="kitsDetails">
                                            <div className="title">
                                                <span>Kit's</span>
                                                <button>
                                                    <span>Editar</span>
                                                </button>
                                            </div>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Kit</th>
                                                        <th>Cantidad</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        superKit.kits && superKit.kits.length ?
                                                            superKit.kits.map((it, i) => {
                                                                return (
                                                                    <tr key={i+1}>
                                                                        <td>{it.name}</td>
                                                                        <td>{it.armadoKits.cantidad}</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        : null 
                                                    }

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                </div> 
            </div> 
            { 
                params.get('c') == 'new' ?
                    <NewComponent />
                : null
            }
        </div>
    )
}