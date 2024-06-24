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

export const showSavePlanChangesModal = () => ({
    type: actionTypes.SHOW_SAVE_PLAN_CHANGES_MODAL
});

export const hideEditPlanChangesModal = () => ({
    type: actionTypes.HIDE_SAVE_PLAN_CHANGES_MODAL
});