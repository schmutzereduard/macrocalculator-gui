import * as actionTypes from '../../actions/actionTypes';

const initialState = {
    isDeleteFoodModalOpen: false,
    isDeleteRecipeModalOpen: false
};

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.SHOW_DELETE_FOOD_MODAL:
            return {
                ...state,
                isDeleteFoodModalOpen: true
            };
        case actionTypes.HIDE_DELETE_FOOD_MODAL:
            return {
                ...state,
                isDeleteFoodModalOpen: false
            };
        case actionTypes.SHOW_DELETE_RECIPE_MODAL:
            return {
                ...state,
                isDeleteRecipeModalOpen: true
            };
        case actionTypes.HIDE_DELETE_RECIPE_MODAL:
            return {
                ...state,
                isDeleteRecipeModalOpen: false
            };
        default: return state;
    }
}

export default reducer;