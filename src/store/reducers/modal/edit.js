import * as actionTypes from '../../actions/actionTypes';

const initialState = {
    showEditFoodModal: false,
    showEditRecipeModal: false
};

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.SHOW_EDIT_FOOD_MODAL:
            return {
                ...state,
                showEditFoodModal: true
            };
        case actionTypes.HIDE_EDIT_FOOD_MODAL:
            return {
                ...state,
                showEditFoddModal: false
            };
        case actionTypes.SHOW_EDIT_RECIPE_MODAL:
            return {
                ...state,
                showEditRecipeModal: true
            };
        case actionTypes.HIDE_EDIT_RECIPE_MODAL:
            return {
                ...state,
                showEditRecipeModal: false
            };
        default: return state;
    }
}

export default reducer;