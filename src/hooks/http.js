import {useReducer, useCallback} from 'react';

// outside of functional component, do not need a re-render on every call
const httpReducer = (curHttpState, action) => {
    switch(action.type){
      case 'SEND':
        return {loading: true, error: null, data: null};
      case 'RESPONSE':
        return {...curHttpState, loading: false, data: action.responseData};
      case 'ERROR': 
        return {loading: false, error: action.errorMessage};
      case 'CLEAR':
        return{error: null};
      default: throw new Error('You should not get here')
    }
  }

//you can use stateful/ any hooks feature in this custom hook
const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, {
        loading: false, error: null, data: null});


    // to avoid http request from re-rending on every functional component call, create a new function for http request, only then when the function is call, the code will run
    const sendRequest = useCallback((url, method, body) => {
        dispatchHttp({type: 'SEND'});
        fetch(url, { 
        method: method,
        body: body,
        header: {'Content-Type': 'application/json'}
        }).then(response => {
            return response.json()
        }).then(responseData=> {
            dispatchHttp({type: 'RESPONSE', responseData: responseData});
        }).catch(err=> {
            dispatchHttp({type:'ERROR', errorMessage:err.message});
        })
    } ,[]);
    
    return {
        isLoading: httpState.loading,
        error: httpState.error,
        data: httpState.data,
        sendRequest: sendRequest
    };
};

    //all hooks can return something
export default useHttp;