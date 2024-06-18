import * as actionTypes from '../../actions/actionTypes';

const initialState = {
    isInsertFoodModalOpen: false,
    showInsertRecipeModal: false
};

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.SHOW_INSERT_FOOD_MODAL:
            return {
                ...state,
                isInsertFoodModalOpen: true
            };
        case actionTypes.HIDE_INSERT_FOOD_MODAL:
            return {
                ...state,
                isInsertFoodModalOpen: false
            };
        case actionTypes.SHOW_INSERT_RECIPE_MODAL:
            return {
                ...state,
                showInsertRecipeModal: true
            };
        case actionTypes.HIDE_INSERT_RECIPE_MODAL:
            return {
                ...state,
                showInsertRecipeModal: false
            };
        default: return state;
    }
}

export default reducer;