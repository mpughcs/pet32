import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import '../style.css'
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <div className='bg-gradient-to-t from-lime-500 to-green-800 h-screen'>

            <App c />
        </div>
    </React.StrictMode>,
)
