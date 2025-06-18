import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as actions from '../../../store/action/action';
export default function AddNotes({ cancelar, cotizacion }){

    const [params, setParams] = useSearchParams(); 
    
    const [texto, setTexto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null); // Para guardar el archivo seleccionado por el usuario
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // Para guardar la URL de Cloudinary que viene del backend

    const dispatch = useDispatch();
    

    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Obtiene el primer archivo seleccionado
        console.log(file)
        if (file) {
          setSelectedFile(file); // Guarda el archivo en el estado
          setUploadedImageUrl(null); // Limpia resultados previos
        } else {
          setSelectedFile(null);
        }
    };

    const handleUpload = async () => {
        setLoading(true); // Inicia el estado de carga
        setUploadedImageUrl(null); // Limpia la URL previa
    
        // Crea un objeto FormData. Es esencial para enviar archivos vía HTTP.
        const formData = new FormData();
        // Añade el archivo al FormData. 'image' es el NOMBRE DEL CAMPO que tu backend (Multer) espera.
        // Debe coincidir con lo que pusiste en upload.single('image')
        formData.append('image', selectedFile?selectedFile:null);
        formData.append('texto', texto);
        formData.append('cotizacionId', cotizacion.id);
    
        // *** OPCIONAL: Si necesitas enviar otros datos junto con el archivo (ej: 'name', 'description', 'show') ***
        // formData.append('name', 'Nombre del Armado');
        // formData.append('description', 'Descripción del Armado');
        // formData.append('show', true); // O false, depende del valor que necesites enviar
        // Tu backend necesitará leer estos campos adicionales de req.body (Multer los parseará automáticamente si el body es multipart)
        // Asegúrate de que tu endpoint backend (newArmado) espera estos campos si los envías aquí.
        // La función newArmado que corregimos espera 'name', 'description', 'show' en req.body
    
        try {
          // *** Usa axios para enviar la solicitud POST con el FormData a tu backend ***
          const response = await axios.post('/api/cotizacion/post/register/new', formData, {
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
          })
          .then((res) => {
            setTexto('');
            dispatch(actions.axiosToGetCotizaciones(false))
            dispatch(actions.axiosToGetCotizacion(false, cotizacion.id))
          })
          // Si la solicitud al backend fue exitosa (código 2xx)
    
          // *** El backend te envía la URL de Cloudinary y otros datos en response.data ***
          // Tu backend debería responder con algo como { msg: '...', url: '...', public_id: '...' }
          if (response.data) {
             // Si también enviaste name/description y tu backend creó el 'armado', la respuesta
             // podría incluir el objeto completo del armado creado (como en la última versión de newArmado).
             // console.log('Objeto Armado creado:', response.data.armado);
             setSelectedFile(null); // Limpia el archivo seleccionado después de subir
            
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

    const chatEndRef = useRef(null); 

    useEffect(() => {
        // Scroll automático cuando cambia la lista de mensajes
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [cotizacion]); // Dependencia: cuando cambian los mensajes

    return (
        <div className="addNotes">
            <div className="containerAddNotes">
                {/* <div className="topTitle">
                    <h3>Notas</h3>
                </div> */}
                <div className="notas" >
                    <div className="containerNotas" >
                        {
                            cotizacion.notaCotizacions?.length ?
                                cotizacion.notaCotizacions.map((nt, i) => {
                                    return (
                                        nt.type == 'texto' ?
                                            <div className="texto" key={i+1}>
                                                <h3 style={{ whiteSpace: 'pre-line' }}>{nt.texto}</h3>
                                            </div>
                                        : nt.type == 'imagen' ?
                                            <div className="img" key={i+1}>
                                                <img src={nt.imagen} alt="" />
                                            </div>
                                        : 
                                            <div className="mixto" key={i+1}>
                                                <img src={nt.imagen} alt="" /><br />
                                                <h3 style={{ whiteSpace: 'pre-line' }}>{nt.texto}</h3>
                                            </div>
                                    )
                                })
                            :null
                        }
                        <br />
                        <div ref={chatEndRef}></div>
                    </div>
                </div>
                <div className="inputDiv">
                    <div className="containerInput">
                        <div className="input">
                            <div className="file">
                               <input type="file"
                                    id="armadoImage"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    placeholder='Escribe aquí' />
                            </div>
                            <textarea name="" id="" onKeyDown={(k) => {
                                if(k.code == 'Escape'){
                                    cancelar(false)
                                }
                            }} onChange={(e) => setTexto(e.target.value)} value={texto}></textarea>
                        </div>
                        
                        <div className="send">
                            <button onClick={() => handleUpload()}>
                                <span>Enviar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}