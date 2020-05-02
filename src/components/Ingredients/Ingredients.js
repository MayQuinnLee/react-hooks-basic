import React, {useReducer, useState, useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (ingredients /*state*/, action) => {
  switch(action.type){
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...ingredients, action.ingredient];
    case 'DELETE':
      return ingredients.filter(ing => ing.id !== action.id);
    default: 
      throw new Error('This should not be here');
  }
};

const Ingredients = () => {
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  //dispatch: you can name it wtv you want, it is a function that you can call
  //2nd argument: initial state
  // const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] =useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', ingredients);
  }, [ingredients]);

  const filteredIngredientsHandler = useCallback(ingredient => {
    dispatch({
      type: 'SET',
      ingredients: ingredient
    })
    // setIngredients(ingredient)
  }, []);

  //browser function, send behind the scene http request. 2nd argument as a object that allows configuration. Firebase understand 'post' method not fetch. JSON is a class which takes stringify function to convert array/object to valid json format - a feature build into the browser. set headers that you want to append to the request. No need to do the same for Axios, because Axios did it for us (stringify & header)
  //response.json() will extract the response body, responseData will be return when the body has been extracted. ResponseData will be an object
  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://react-hooks-fae2f.firebaseio.com/ingredients.json', { 
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'} 
    }).then(response => {
      setIsLoading(false);
      return response.json();
    }).then(responseData => {
      dispatch({
        type: 'ADD',
        ingredient: {id: responseData.name, ...ingredient}
      })
      // setIngredients(prevIngredients => [
      //   ...prevIngredients, 
      //   {id: responseData.name, ...ingredient}
      // ]);
    })
  };

  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    fetch(`https://react-hooks-fae2f.firebaseio.com/ingredients/${ingredientId}.json`, { 
      method: 'DELETE'
    }).then(response => {
      setIsLoading(false);
      dispatch({
        type: 'DELETE',
        id: ingredientId
      })
      // setIngredients(prevIngredients => 
      //   prevIngredients.filter(ig => ig.id !== ingredientId)
      // );
    }).catch(err => {
      setError(err.message);
      setIsLoading(false);
    })
  }

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}> {error} </ErrorModal>}
      <IngredientForm 
      onAddIngredient={addIngredientHandler}
      loading={isLoading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList 
        ingredients={ingredients} 
        onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
