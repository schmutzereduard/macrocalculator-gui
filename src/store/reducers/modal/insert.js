import * as actionTypes from '../../actions/actionTypes';

const initialState = {

    isSaveFoodChangesModalOpen: false,
    isSaveRecipeChangesModalOpen: false,
    isSaveJournalChangesModalOpen: false
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
        case actionTypes.SHOW_SAVE_JOURNAL_CHANGES_MODAL:
            return {
                ...state,
                isSaveJournalChangesModalOpen: true
            };
        case actionTypes.HIDE_SAVE_JOURNAL_CHANGES_MODAL:
            return {
                ...state,
                isSaveJournalChangesModalOpen: false
            };
        default: return state;
    }
}

export default reducer;