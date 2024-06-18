import * as actionTypes from '../../actions/actionTypes';

const initialState = {
    showDeleteFoodModal: false,
    showDeleteRecipeModal: false
};

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.SHOW_DELETE_FOOD_MODAL:
            return {
                ...state,
                showDeleteFoodModal: true
            };
        case actionTypes.HIDE_DELETE_FOOD_MODAL:
            return {
                ...state,
                showDeleteFoddModal: false
            };
        case actionTypes.SHOW_DELETE_RECIPE_MODAL:
            return {
                ...state,
                showDeleteRecipeModal: true
            };
        case actionTypes.HIDE_DELETE_RECIPE_MODAL:
            return {
                ...state,
                showDeleteRecipeModal: false
            };
        default: return state;
    }
}

export default reducer;