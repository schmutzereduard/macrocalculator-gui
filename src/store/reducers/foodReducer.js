// reducers/foodReducer.js

import * as actionTypes from '../actions/actionTypes';

const initialState = {
    foods: [],
    foodTypes: [],
    loading: false,
    error: null
};

const foodReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_FOODS_REQUEST:
        case actionTypes.ADD_FOOD_REQUEST:
        case actionTypes.UPDATE_FOOD_REQUEST:
        case actionTypes.DELETE_FOOD_REQUEST:
        case actionTypes.FETCH_FOOD_TYPES_REQUEST:
            return { ...state, loading: true };
        
        case actionTypes.FETCH_FOODS_SUCCESS:
            return { ...state, foods: action.foods, loading: false };
        
        case actionTypes.ADD_FOOD_SUCCESS:
            return { ...state, foods: [...state.foods, action.food], loading: false };
        
        case actionTypes.UPDATE_FOOD_SUCCESS:
            return {
                ...state,
                foods: state.foods.map(food =>
                    food.id === action.food.id ? action.food : food
                ),
                loading: false
            };
        
        case actionTypes.DELETE_FOOD_SUCCESS:
            return {
                ...state,
                foods: state.foods.filter(food => food.id !== action.id),
                loading: false
            };
        
        case actionTypes.FETCH_FOOD_TYPES_SUCCESS:
            return { ...state, foodTypes: action.types, loading: false };

        case actionTypes.FETCH_FOODS_FAIL:
        case actionTypes.ADD_FOOD_FAIL:
        case actionTypes.UPDATE_FOOD_FAIL:
        case actionTypes.DELETE_FOOD_FAIL:
        case actionTypes.FETCH_FOOD_TYPES_FAIL:
            return { ...state, error: action.error, loading: false };
        
        default:
            return state;
    }
};

export default foodReducer;
