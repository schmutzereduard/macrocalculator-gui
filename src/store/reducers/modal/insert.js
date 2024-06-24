import * as actionTypes from '../../actions/actionTypes';

const initialState = {

    isSaveFoodChangesModalOpen: false,
    isSaveRecipeChangesModalOpen: false,
    isSavePlanChangesModalOpen: false
};

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.SHOW_SAVE_FOOD_CHANGES_MODAL:
            return {
                ...state,
                isSaveFoodChangesModalOpen: true
            };
        case actionTypes.HIDE_SAVE_FOOD_CHANGES_MODAL:
            return {
                ...state,
                isSaveFoodChangesModalOpen: false
            };
        case actionTypes.SHOW_SAVE_RECIPE_CHANGES_MODAL:
            return {
                ...state,
                isSaveRecipeChangesModalOpen: true
            };
        case actionTypes.HIDE_SAVE_RECIPE_CHANGES_MODAL:
            return {
                ...state,
                isSaveRecipeChangesModalOpen: false
            };
        case actionTypes.SHOW_SAVE_PLAN_CHANGES_MODAL:
            return {
                ...state,
                isSavePlanChangesModalOpen: true
            };
        case actionTypes.HIDE_SAVE_PLAN_CHANGES_MODAL:
            return {
                ...state,
                isSavePlanChangesModalOpen: false
            };
        default: return state;
    }
}

export default reducer;