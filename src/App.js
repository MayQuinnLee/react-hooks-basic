import React, { useContext } from 'react';

import Ingredients from './components/Ingredients/Ingredients';
import Auth from './components/Auth';
import {AuthContext} from './context/auth-context';

const App = props => {
  const authContext = useContext(AuthContext);

  let content = <Auth />;
  if(authContext.isAuth){ content = <Ingredients /> } 
  //this will be rebuild whenever 'AuthContext' changes

  return content;
};

export default App;
