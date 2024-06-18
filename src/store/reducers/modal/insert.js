import * as actionTypes from '../../actions/actionTypes';

const initialState = {
    showAddFoodModal: false,
    showAddRecipeModal: false
};

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.SHOW_INSERT_FOOD_MODAL:
            return {
                ...state,
                showAddFoodModal: true
            };
        case actionTypes.HIDE_INSERT_FOOD_MODAL:
            return {
                ...state,
                showAddFoddModal: false
            };
        case actionTypes.SHOW_INSERT_RECIPE_MODAL:
            return {
                ...state,
                showAddRecipeModal: true
            };
        case actionTypes.HIDE_INSERT_RECIPE_MODAL:
            return {
                ...state,
                showAddRecipeModal: false
            };
        default: return state;
    }
}

export default reducer;