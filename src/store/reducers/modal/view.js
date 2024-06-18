import * as actionTypes from '../../actions/actionTypes';

const initialState = {
    showFoodModal: false,
    showRecipeModal: false,
};

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.SHOW_FOOD_MODAL:
            return {
                ...state,
                showFoodModal: true
            };
        case actionTypes.HIDE_FOOD_MODAL:
            return {
                ...state,
                showFoodModal: false
            };
        case actionTypes.SHOW_RECIPE_MODAL:
            return {
                ...state,
                showRecipeModal: true
            };
        case actionTypes.HIDE_RECIPE_MODAL:
            return {
                ...state,
                showRecipeModal: false
            };
        default: return state;
    }
}

export default reducer;