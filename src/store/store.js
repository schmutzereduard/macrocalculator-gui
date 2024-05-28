import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { thunk } from 'redux-thunk'; // Correct import
import foodReducer from './reducers/foodReducer'; // Correct import

const rootReducer = combineReducers({
    foods: foodReducer
});

const store = createStore(rootReducer, compose(applyMiddleware(thunk)));

export default store;
