import React , {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const {onLoadIngredients} = props; //object destructuring, function is a object, onLoadIngredients as a key 
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const timeout = setTimeout(() => {
      //is the 'enteredFilter' the same as the 'enteredFilter' 500ms ago? the old 'enteredFilter' will be lock in when we set the timer. 'current' & 'value' property of useRef(). inputRef is defined outside of the closure, not locked in, hence it is the current value
      if(enteredFilter === inputRef.current.value){
        const query = 
        enteredFilter.length===0 
        ? '' 
        : `?orderBy="title"&equalTo="${enteredFilter}"`
        //to filter the ingredients in the backend, need to fetch backend data
        //to only fetch information of 'enteredFilter' and not everything
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
      }
    },500);
    return () => {
      clearTimeout(timeout); //useEffect() can return a function, clear-up function will run before the next time the 'above' function runs. hence it will clear all the old timer on every keystroke, leaving the final timer running
    }
  },[enteredFilter, onLoadIngredients, inputRef])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
          ref={inputRef} //a special property supported by React, to connect useRef() to the DOM
          type="text"
          value={enteredFilter}
          onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
