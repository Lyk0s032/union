import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import store from './components/store/store.js';
import axios from 'axios';
 
axios.defaults.baseURL = 'https://unionapi-production.up.railway.app/';
// axios.defaults.baseURL = 'http://192.168.1.15:3000'; 
 
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode> 
      <App />           
    </StrictMode> 
  </Provider>,
)
   