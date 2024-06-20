import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { thunk } from 'redux-thunk';
import foodReducer from './reducers/foodReducer';
import recipeReducer from './reducers/recipeReducer';
import planReducer from './reducers/planReducer';
import viewModalReducer from './reducers/modal/view';
import editModalReducer from './reducers/modal/edit';
import deleteModalReducer from './reducers/modal/delete';
import insertModalReducer from './reducers/modal/insert';

const rootReducer = combineReducers({
    foods: foodReducer,
    recipes: recipeReducer,
    plans: planReducer,
    viewModal: viewModalReducer,
    editModal: editModalReducer,
    deleteModal: deleteModalReducer,
    insertModal: insertModalReducer,
});

const store = createStore(rootReducer, compose(applyMiddleware(thunk)));

export default store;
