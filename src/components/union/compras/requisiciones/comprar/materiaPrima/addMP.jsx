import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ItemProject from './itemProject';
import ListProvider from './providerList';
import { useDispatch, useSelector } from 'react-redux';

export default function AddMP(){
    const [params, setParams] = useSearchParams();

    const req = useSelector(store => store.requisicion);
    const { itemRequisicion, loadingItemRequisicion } = req;


    return (
        <div className="addMPRight">
            {
                !itemRequisicion || loadingItemRequisicion ? 
                <h1>Cargando...</h1>
                :
                itemRequisicion == 'notrequest' || itemRequisicion == 404 ?
                    <h1>Intentalo más tarde</h1>
                :
                <div className="containerAddRight">
                    <div className="title">{console.log(itemRequisicion)}
                        <h3>{itemRequisicion.description}</h3>

                        <button onClick={() => {
                            params.delete('MP');
                            setParams(params);
                        }}>
                            <span>X</span>
                        </button>
                    </div>
                    <div className="dataAddMP">
                        <div className="containerAddThat">
                            {/* <div className="priceSimilar">
                                <span>Precio promedio</span>
                                <h3>$ 450.000 / <span>Unidad</span></h3>
                                <button>
                                    <span>Comprar</span>
                                </button>
                            </div> */}
                            <ListProvider item={itemRequisicion} />
                            <div className="projects">
                                {
                                    itemRequisicion.itemRequisicions?.map((item, i) => {
                                        return (
                                            <ItemProject item={item} key={i+1}/>
                                        )
                                    })
                                } 
                            </div>
                        </div>
                    </div>
                    <div className="bottomPrice">
                        <div className="containerPrice">
                            <div className="titlePrice">
                                <span>Precio</span>
                                <h3>$ 145.000 </h3>
                            </div>
                            <button>
                                <span>Guardar</span>
                            </button>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
} 
