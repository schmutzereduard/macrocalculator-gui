import * as actionTypes from '../../actions/actionTypes';

const initialState = {
    isEditFoodModalOpen: false,
    isEditRecipeModalOpen: false,
    isEditJournalModalOpen: false
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
        case actionTypes.SHOW_EDIT_JOURNAL_MODAL:
            return {
                ...state,
                isEditJournalModalOpen: true
            };
        case actionTypes.HIDE_EDIT_JOURNAL_MODAL:
            return {
                ...state,
                isEditJournalModalOpen: false
            };
        default: return state;
    }
}

export default reducer;