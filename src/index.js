import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import AuthContextProvider from './context/auth-context';

ReactDOM.render(
    <AuthContextProvider>  {/*So the entire app is able to reach/listen to AuthContext */}
        <App />
    </AuthContextProvider>
    , document.getElementById('root'));
