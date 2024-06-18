import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { thunk } from 'redux-thunk';
import foodReducer from './reducers/foodReducer';
import recipeReducer from './reducers/recipeReducer';
import planReducer from './reducers/planReducer';

const rootReducer = combineReducers({
    foods: foodReducer,
    recipes: recipeReducer,
    plans: planReducer
});

const store = createStore(rootReducer, compose(applyMiddleware(thunk)));

export default store;
