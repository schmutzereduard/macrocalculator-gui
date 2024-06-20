import * as actionTypes from '../../actions/actionTypes';

const initialState = {
    isEditFoodModalOpen: false,
    isEditRecipeModalOpen: false
};

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.SHOW_EDIT_FOOD_MODAL:
            return {
                ...state,
                isEditFoodModalOpen: true
            };
        case actionTypes.HIDE_EDIT_FOOD_MODAL:
            return {
                ...state,
                isEditFoodModalOpen: false
            };
        case actionTypes.SHOW_EDIT_RECIPE_MODAL:
            return {
                ...state,
                isEditRecipeModalOpen: true
            };
        case actionTypes.HIDE_EDIT_RECIPE_MODAL:
            return {
                ...state,
                isEditRecipeModalOpen: false
            };
        default: return state;
    }
}

export default reducer;