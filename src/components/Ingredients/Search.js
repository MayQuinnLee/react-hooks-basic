import React , {useState, useEffect} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const {onLoadIngredients} = props; //object destructuring, function is a object, onLoadIngredients as a key 
  const [enteredFilter, setEnteredFilter] = useState('');

  //to filter the ingredients in the backend, need to fetch backend data
  useEffect(() => {
    //to only fetch information of 'enteredFilter' and not everything
    const query = 
      enteredFilter.length===0 
      ? '' 
      : `?orderBy="title"&equalTo="${enteredFilter}"`
    fetch('https://react-hooks-fae2f.firebaseio.com/ingredients.json' + query)
    .then(response => response.json())
    .then(responseData => {
      const loadedIngredients = [];
      for (const key in responseData){
        loadedIngredients.push({
          id: key,
          title: responseData[key].title,
          amount: responseData[key].amount
        });
      }
      onLoadIngredients(loadedIngredients); //infinite loop, as parent will re-render when this function is being re-rendered, since this is a dependencies: solution useCallback() it cached your function for you, so that it survives re-render cycle
    })
  },[enteredFilter, onLoadIngredients])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
          type="text"
          value={enteredFilter}
          onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
