import * as actionTypes from '../actionTypes';

export const showSaveFoodChangesModal = () => ({
    type:  actionTypes.SHOW_SAVE_FOOD_CHANGES_MODAL
});

export const hideSaveFoodChangesModal = () => ({
    type:  actionTypes.HIDE_SAVE_FOOD_CHANGES_MODAL
});

export const showSaveRecipeChangesModal = () => ({
    type:  actionTypes.SHOW_SAVE_RECIPE_CHANGES_MODAL
});

export const hideSaveRecipeChangesModal = () => ({
    type:  actionTypes.HIDE_SAVE_RECIPE_CHANGES_MODAL
});

export const showSaveJournalChangesModal = () => ({
    type: actionTypes.SHOW_SAVE_JOURNAL_CHANGES_MODAL
});

export const hideSaveJournalChangesModal = () => ({
    type: actionTypes.HIDE_SAVE_JOURNAL_CHANGES_MODAL
});