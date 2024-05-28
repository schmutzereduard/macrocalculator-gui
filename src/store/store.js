import { createStore, combineReducers } from 'redux';
import foodReducer from './reducers/foodReducer';

const rootReducer = combineReducers({
    foods: foodReducer,
});

const store = createStore(rootReducer);

export default store;
