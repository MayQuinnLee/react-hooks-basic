import React, {useState} from 'react';

export const AuthContext = React.createContext({
    isAuth: false,
    login: () => {}
});

const AuthContextProvided = props => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const loginHandler = () => setIsAuthenticated(true);

    return (
        <AuthContext.Provider 
        value={{isAuth: isAuthenticated, login: loginHandler}}> 
        {/*authContext provides a value that everyone is listening*/}
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvided;
