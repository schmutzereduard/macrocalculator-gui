import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { thunk } from 'redux-thunk';
import foodReducer from './reducers/foodReducer';
import mealReducer from './reducers/mealReducer';

const rootReducer = combineReducers({
    foods: foodReducer,
    meals: mealReducer
});

const store = createStore(rootReducer, compose(applyMiddleware(thunk)));

export default store;
