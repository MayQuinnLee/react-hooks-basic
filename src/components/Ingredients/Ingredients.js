import React, {useState, useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';


const Ingredients = () => {

  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] =useState(false);

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', ingredients);
  }, [ingredients]);

  const filteredIngredientsHandler = useCallback(ingredient => {
    setIngredients(ingredient)
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
      return response.json();
    }).then(responseData => {
      setIsLoading(false);
      setIngredients(prevIngredients => [
        ...prevIngredients, 
        {id: responseData.name, ...ingredient}
      ]);
    })
  };

  const removeIngredientHandler = ingredientId => {
    fetch(`https://react-hooks-fae2f.firebaseio.com/ingredients/${ingredientId}.json`, { 
      method: 'DELETE'
    }).then(response => {
      setIngredients(prevIngredients => 
        prevIngredients.filter(ig => ig.id !== ingredientId)
      );
    })
  }

  return (
    <div className="App">
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
