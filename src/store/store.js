import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { thunk } from 'redux-thunk';
import foodReducer from './reducers/foodReducer';
import recipeReducer from './reducers/recipeReducer';

const rootReducer = combineReducers({
    foods: foodReducer,
    recipes: recipeReducer
});

const store = createStore(rootReducer, compose(applyMiddleware(thunk)));

export default store;
