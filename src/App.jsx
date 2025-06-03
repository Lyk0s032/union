import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import './css/index.css'
import * as actions from './components/store/action/action';
import { useDispatch, useSelector } from 'react-redux'
import Login from './components/home/login';
import Logged from './components/union/logged';
import RouterPanel from './components/union/routerPanel';

function App() { 
  const dispatch = useDispatch();

  const usuario = useSelector(store => store.usuario);
  const { user, loadingUser } = usuario;

  const log = JSON.parse(window.localStorage.getItem("loggedPeople"));
  console.log(user) 
  useEffect(() => {
      if(log && !user){    
          dispatch(actions.AxiosAuthUser(log, true));
      }else{
        window.localStorage.removeItem('loggedPeople'); 
      }  
  }, [])  
  return (
    loadingUser ? 
      <div className="loadingPanel">
        <div className="containerLoading">
            <h1>Accediendo...</h1>
            <span>Estamos cargando la información básica...</span>
        </div>
      </div>
    :
    <>
      <Router>
        <Routes>
          <Route path="/*" element={user ? <RouterPanel user={user.user} /> : <Login />} />
          <Route path="/sign/"  element={user && !loadingUser ? <Navigate to="/" /> : <Login />} /> 

        </Routes>
      </Router>
    </>
  )
}

export default App