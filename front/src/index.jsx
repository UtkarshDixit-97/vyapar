import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap/dist/js/bootstrap.js";
import 'bootstrap-icons/font/bootstrap-icons.css';
// import Popper from '@popperjs/core';
// import bg from '/backgroundimg.jpg'
import {AuthContextProvider} from './context/AuthContext'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3001/api';

// axios.defaults.baseURL = 'https://vyappar.openode.dev/api';


console.log("sweardkioujlfgh")
ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>  
  </React.StrictMode>,
  document.getElementById('root')
);
