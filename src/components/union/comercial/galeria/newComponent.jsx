import axios from 'axios';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../store/action/action';
import { useDispatch, useSelector } from 'react-redux';
import ItemNewSuperKit from './itemNewSuperKit';

export default function NewComponent(){
    const [params, setParams] = useSearchParams(); 
    const [nav, setNav] = useState(null);
    
    const [selectedFile, setSelectedFile] = useState(null); // Para guardar el archivo seleccionado por el usuario
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // Para guardar la URL de Cloudinary que viene del backend
    const [form, setForm] = useState({
        name: null,
        description: null,
        show: true,
        categoriumId: null
    })
    const [loading, setLoading] = useState(false);
    const [kits, setKits] = useState(null);

    const dispatch = useDispatch();
    const superK = useSelector(store => store.kits);
    const { superKit, loadingSuperKit} = superK;
    console.log(superK)
    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Obtiene el primer archivo seleccionado
        if (file) {
          setSelectedFile(file); // Guarda el archivo en el estado
          setUploadedImageUrl(null); // Limpia resultados previos
        } else {
          setSelectedFile(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
          return;
        }
        setLoading(true); // Inicia el estado de carga
        setUploadedImageUrl(null); // Limpia la URL previa
    
        // Crea un objeto FormData. Es esencial para enviar archivos vía HTTP.
        const formData = new FormData();
        // Añade el archivo al FormData. 'image' es el NOMBRE DEL CAMPO que tu backend (Multer) espera.
        // Debe coincidir con lo que pusiste en upload.single('image')
        formData.append('image', selectedFile);
        formData.append('name', form.name);
        formData.append('description', form.description);
    
        // *** OPCIONAL: Si necesitas enviar otros datos junto con el archivo (ej: 'name', 'description', 'show') ***
        // formData.append('name', 'Nombre del Armado');
        // formData.append('description', 'Descripción del Armado');
        // formData.append('show', true); // O false, depende del valor que necesites enviar
        // Tu backend necesitará leer estos campos adicionales de req.body (Multer los parseará automáticamente si el body es multipart)
        // Asegúrate de que tu endpoint backend (newArmado) espera estos campos si los envías aquí.
        // La función newArmado que corregimos espera 'name', 'description', 'show' en req.body
    
        try {
          // *** Usa axios para enviar la solicitud POST con el FormData a tu backend ***
          const response = await axios.post('/api/superkit/post/new', formData, {
            headers: {
              // Axios a menudo establece el Content-Type correcto (multipart/form-data) automáticamente con FormData
              // Si tu backend requiere autenticación, añade headers aquí:
              // 'Authorization': `Bearer TU_TOKEN_DEL_USUARIO_LOGUEADO`
            },
            // Opcional: Configuración para mostrar el progreso de la subida
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              console.log(`Progreso de subida al backend: ${percentCompleted}%`);
              // Puedes usar este porcentaje para actualizar una barra de progreso en tu UI
            }
          });
          console.log(response)
          // Si la solicitud al backend fue exitosa (código 2xx)
    
          // *** El backend te envía la URL de Cloudinary y otros datos en response.data ***
          // Tu backend debería responder con algo como { msg: '...', url: '...', public_id: '...' }
          if (response.data) {
             // Si también enviaste name/description y tu backend creó el 'armado', la respuesta
             // podría incluir el objeto completo del armado creado (como en la última versión de newArmado).
             // console.log('Objeto Armado creado:', response.data.armado);
             setSelectedFile(null); // Limpia el archivo seleccionado después de subir
             dispatch(actions.axiosToGetSuperKits(false))
             dispatch(actions.axiosToGetSuperKit(false, response.data.id))
             setNav('kits'); 
          } else {
             // Si el backend respondió 2xx pero sin la URL esperada
             setUploadedImageUrl(null);
          }
         
    
        } catch (err) {     
          // Manejar errores: err.response contiene la respuesta del backend si hubo un error HTTP
          if (err.response) {
             // El backend respondió con un código de estado fuera del rango 2xx (ej: 400, 500)
             // Muestra el mensaje de error que viene del backend si está disponible
             setError(`Error del backend: ${err.response.data.msg || err.response.statusText}`);
          } else if (err.request) {
             // La solicitud se hizo pero no se recibió respuesta (ej: servidor backend no corriendo)
             setError('Error de conexión: No se pudo contactar al servidor backend.');
          } else {
             // Algo más causó el error (ej: error en el código del frontend antes de enviar)
          }
          setUploadedImageUrl(null); // Limpia la URL en caso de error
    
        } finally {
          setLoading(false); // Finaliza el estado de carga
        }
    };

    const searchKitsAxios = async (searchTerm) => {

        const response = await axios.get('/api/kit/get/s/search/',{
            params: { // Aquí definimos los parámetros de consulta que irán en la URL (ej: ?query=...)
              query: searchTerm // El nombre del parámetro 'query' debe coincidir con req.query.query en tu backend
            },
            // Si tu backend requiere autenticación, añade headers aquí:
            // headers: { 'Authorization': `Bearer TU_TOKEN_DEL_USUARIO` }
          })
          .then((res) => {
            setKits(res.data)
          }).catch(err => {
            setKits(404)
          });

          return response
    }
    return (
        <div className="modal">
            <div className="hiddenModal" onClick={() => {
                params.delete('c');
                setParams(params);
            }}></div>
            <div className="containerModal Avance">
                <div className="navTop">
                    <nav>
                        <ul>
                            <li>
                                <div className='active'>
                                    <span>
                                        Inicio
                                    </span>
                                </div>
                            </li>
                            <li>
                                <div  className={nav == 'kits' ? 'active' : null}>
                                    <span>
                                        Seleccionar kit's
                                    </span>
                                </div>
                            </li>

                            {/* <li >
                                <div className={nav == 'previa' ? 'active' : null}>
                                    <span>
                                        Vista previa
                                    </span>
                                </div>
                            </li> */}
                        </ul>
                    </nav>
                </div>
                <div className="bodyResults">
                    {
                        !nav ? 
                            <div className="containerThat">
                                {console.log(selectedFile)}
                                <div className="form">
                                    <div className="title">
                                        <h1>Ok, ¡Comencemos a construir!</h1>
                                    </div>
                                    <div className="dataForm">
                                        <div className="inputDiv">
                                            <label htmlFor="">Nombre del elemento</label><br />
                                            <input type="text" placeholder='Escribe aquí' onChange={(e) => {
                                                setForm({
                                                    ...form,
                                                    name: e.target.value
                                                })
                                            }} value={form.name} />
                                        </div>
                                        <div className="inputDiv">
                                            <label htmlFor="">Descripción</label><br />
                                            <textarea onChange={(e) => {
                                                setForm({
                                                    ...form,
                                                    description: e.target.value
                                                }) 
                                            }} value={form.description}></textarea>
                                        </div>

                                        <div className="inputDiv">
                                            <label htmlFor="">Imagen</label><br />
                                            <input type="file"
                                            id="armadoImage"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                             placeholder='Escribe aquí' />
                                        </div>

                                        <div className="divHorizontal">
                                            <div className="inputDiv">
                                                <label htmlFor="">Mostrar elementos en cotización</label><br />
                                                <select name="" id="">
                                                    <option value="">Si mostrar</option>
                                                    <option value="">No mostrar</option>

                                                </select>
                                            </div>

                                            <div className="inputDiv">
                                                <label htmlFor="">Categoría</label><br />
                                                <select name="" id="">
                                                    <option value="">Categoría A</option>
                                                    <option value="">Categoría B</option>

                                                </select>
                                            </div>
                                        </div>
                                        <div className="inputDiv">
                                            <button onClick={() => {
                                                !loading ?
                                                handleUpload()
                                                : null
                                            }}>
                                                <span>{!loading ? 'Avanzar' : 'Comprobando...'} </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        : nav == 'kits' ?
                            <div className="containerKits">
                                <div className="divide">
                                    <div className="searchT">
                                        <div className="topSearch">
                                            <div className="title">
                                                <h1>Buscar kit que deseas incluir</h1>
                                            </div>
                                            <div className="inputSearch">
                                                <input type="text" placeholder='Buscar' onChange={(e) => {
                                                    searchKitsAxios(e.target.value)
                                                }} />
                                            </div>
                                        </div>
                                        <div className="table">
                                            <div className="lista">
                                                {
                                                    kits == 404 ?
                                                        <h3>No hemos encontrado resultados</h3>
                                                    : kits && kits.length ?
                                                        kits.map((k, i) => {
                                                            return (
                                                                <ItemNewSuperKit key={i+1} kit={k} ky={i} superKitId={superKit.id}/>
                                                            )
                                                        })
                                                    : <h3>Buscar</h3>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="myComponent">
                                        <div className="titleTop">
                                            <h3>{superKit && superKit.name ? superKit.name : 'Superkit no disponible'}</h3>
                                        </div>
                                        <div className="listaDeMyKits">
                                            <div className="titleSmall">
                                                <span>{superKit && superKit.kits ? `${superKit.kits.length} kit's seleccionados` : null}</span>
                                            </div>
                                            <div className="lista">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Kit</th>
                                                            <th>Cantidad</th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            !superKit || loadingSuperKit ?
                                                                <h1>Cargando...</h1>
                                                            : superKit  ?
                                                                superKit.kits && superKit.kits.length ?
                                                                    superKit.kits.map((sp, i) => {
                                                                        return (
                                                                            <tr key={i+1}>
                                                                                <td>{sp.name}</td>
                                                                                <td>{sp.armadoKits.cantidad}</td>
                                                                                <th>
                                                                                    <button><span>X</span></button>
                                                                                </th>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                : <h1>No hay</h1>
                                                            :null
                                                        }
                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="bottomAvance">
                                            <button>
                                                <span>Finalizar</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        : nav == 'previa' ?
                            <div className="containerPrevia">
                                <h1>Previa</h1>
                            </div>
                        :null
                    }
                </div>
            </div>
        </div>
    )
}