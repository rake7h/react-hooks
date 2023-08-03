import React, { useReducer } from 'react';

/**
    * A Ract hook for storing the xhr/api async states (data, loading, completed & error)
    *
    * Todo:
    *  response data can be stored in browser storage (for short time peroid) for caching purpose & avoiding the
    *  same api call from different location.
    */

const initialState = {
    data: null,
    error: false,
    loading: false,
    completed: false,
};

function reducer(state, action) {
    switch (action.type) {
        case 'error':
            return { ...state, error: action.error, completed: true, loading: false };
        case 'data':
            return { ...state, data: action.data, completed: true, loading: false, error: false };
        case 'loading':
            return { ...state, loading: action.loading, completed: false };
        default:
            return { ...state };
    }
}

// returning api state and trigger function
const useApiCall = (xhrFunction, hookOpts = {}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const makeApiCall = async (callOptions = {}) => {
        try {
            dispatch({ type: 'loading', loading: true });
            const res = await xhrFunction({ ...hookOpts, ...callOptions });
            dispatch({ type: 'data', data: res });
        } catch (e) {
            dispatch({ type: 'error', error: e });
        }
    };

    const start = (o) => makeApiCall(o);

    return [state, start];
};

export { useApiCall };
