import { ADD_FOOD, DELETE_FOOD, UPDATE_FOOD } from '../actions/foodActions';

const initialState = {
    food: [],
};

const foodReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_FOOD:
            return { ...state, food: [...state.food, action.payload] };
        case DELETE_FOOD:
            return { ...state, food: state.food.filter(food => food.id !== action.payload) };
        case UPDATE_FOOD:
            return {
                ...state,
                food: state.food.map(food =>
                    food.id === action.payload.id ? action.payload : food
                ),
            };
        default:
            return state;
    }
};

export default foodReducer;
