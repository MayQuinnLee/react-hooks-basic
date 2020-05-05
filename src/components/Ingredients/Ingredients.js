import React, {useReducer, useEffect, useCallback, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientReducer = (curIngredients /*state*/, action) => {
  switch(action.type){
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...curIngredients, action.ingredient];
    case 'DELETE':
      return curIngredients.filter(ing => ing.id !== action.id);
    default: 
      throw new Error('This should not be here');
  }
};


const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  //dispatch: you can name it wtv you want, it is a function that you can call
  //2nd argument: initial state
  // const [ingredients, setIngredients] = useState([]);
  // const [isLoading, setIsLoading] =useState(false);
  // const [error, setError] = useState();
   const {isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear} = useHttp(); 
  //does not send request, only set up the state and function, returns our object


  useEffect(() => {
    if(!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT'){
      dispatch({type: 'DELETE', id: reqExtra});
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({type: 'ADD', ingredient: {id: data.name, ...reqExtra}})
    }
  }, [data, reqIdentifier, reqExtra, isLoading, error]); //dependencies: responseData from Http

  const filteredIngredientsHandler = useCallback(ingredient => {
    dispatch({
      type: 'SET',
      ingredients: ingredient
    })
    // setIngredients(ingredient)
  }, []);

  const addIngredientHandler = useCallback(
    ingredient => {
      sendRequest(
        'https://react-hooks-fae2f.firebaseio.com/ingredients.json', 
        'POST', 
        JSON.stringify(ingredient), 
        ingredient, 
        'ADD_INGREDIENT '
      );
    },
    [sendRequest]
  );

  const removeIngredientHandler = useCallback(
    ingredientId => {
      sendRequest(
        `https://react-hooks-fae2f.firebaseio.com/ingredients/${ingredientId}.json`,
        'DELETE', 
        null, 
        ingredientId,
        'REMOVE_INGREDIENT'
      );
    }, 
    [sendRequest]
  );

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients} 
        onRemoveItem={removeIngredientHandler}
      />
    );
  },[userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}> {error} </ErrorModal>}
      <IngredientForm 
      onAddIngredient={addIngredientHandler}
      loading={isLoading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
