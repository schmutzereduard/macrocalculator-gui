import * as actionTypes from '../actions/actionTypes';

const initialState = {
    isLoading: false,
    foods: [],
    error: null
};

const foodReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_FOODS_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case actionTypes.FETCH_FOODS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
                foods: action.foods
            };
        case actionTypes.FETCH_FOODS_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        default:
            return state;
    }
};

export default foodReducer;
