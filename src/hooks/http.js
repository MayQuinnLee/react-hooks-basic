import {useReducer, useCallback} from 'react';

const initialState = {
    loading: false, error: null, data: null, extra: null, identifier: null
};

// outside of functional component, do not need a re-render on every call
const httpReducer = (curHttpState, action) => {
    switch(action.type){
      case 'SEND':
        return {loading: true, error: null, data: null, extra: null, identifier: action.identifier};
      case 'RESPONSE':
        return {...curHttpState, loading: false, data: action.responseData, extra: action.extra}; 
      case 'ERROR': 
        return {loading: false, error: action.errorMessage};
      case 'CLEAR':
        return initialState;
      default: throw new Error('You should not get here')
    }
  }

//you can use stateful/ any hooks feature in this custom hook
const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

    const clear = useCallback(() => dispatchHttp({type: 'CLEAR'}), []);


    // to avoid http request from re-rending on every functional component call, create a new function for http request, only then when the function is call, the code will run
    const sendRequest = useCallback(
        (url, method, body, reqExtra, reqIdentifier) => {
            dispatchHttp({type: 'SEND', identifier: reqIdentifier});
            fetch(url, { 
            method: method,
            body: body,
            header: {'Content-Type': 'application/json'}
            }).then(response => {
                return response.json()
            }).then(responseData=> {
                dispatchHttp({type: 'RESPONSE', responseData: responseData, extra: reqExtra});
            }).catch(err=> {
                dispatchHttp({type:'ERROR', errorMessage:err.message});
            })
        }, []
    );
    
    return {
        isLoading: httpState.loading,
        error: httpState.error,
        data: httpState.data,
        reqExtra: httpState.extra,
        reqIdentifier: httpState.identifier,
        sendRequest: sendRequest,
        clear: clear
    };
};

    //all hooks can return something
export default useHttp;