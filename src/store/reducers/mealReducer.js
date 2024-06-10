import * as actionTypes from '../actions/actionTypes';

const initialState = {
    meals: [],
    loading: false,
    error: null
};

const mealReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_MEALS_REQUEST:
        case actionTypes.ADD_MEAL_REQUEST:
        case actionTypes.DELETE_MEAL_REQUEST:
            return { ...state, loading: true };
        case actionTypes.FETCH_MEALS_SUCCESS:
            return { ...state, meals: action.meals, loading: false };
        case actionTypes.ADD_MEAL_SUCCESS:
            return { ...state, meals: [...state.meals, action.meal], loading: false };
        case actionTypes.DELETE_MEAL_SUCCESS:
            return { ...state, meals: state.meals.filter(meal => meal.id !== action.id), loading: false };
        case actionTypes.FETCH_MEALS_FAIL:
        case actionTypes.ADD_MEAL_FAIL:
        case actionTypes.DELETE_MEAL_FAIL:
            return { ...state, error: action.error, loading: false };
        default:
            return state;
    }
};

export default mealReducer;
