import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
// import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import 'typeface-roboto';
import './index.css';

ReactDOM.render(
    <BrowserRouter>
    <App />
    </BrowserRouter>,
    document.getElementById('root')
);

// registerServiceWorker();
