import * as actionTypes from '../actionTypes';

export const showDeleteFoodModal = () => ({
    type: actionTypes.SHOW_DELETE_FOOD_MODAL
});

export const hideDeleteFoodModal = () => ({
    type: actionTypes.HIDE_DELETE_FOOD_MODAL
});

export const showDeleteRecipeModal = () => ({
    type:  actionTypes.SHOW_DELETE_RECIPE_MODAL
});

export const hideDeleteRecipeModal = () => ({
    type:  actionTypes.HIDE_DELETE_RECIPE_MODAL
});

export const showDeletePlanModal = () => ({
    type:  actionTypes.SHOW_DELETE_PLAN_MODAL
});

export const hideDeletePlaneModal = () => ({
    type:  actionTypes.HIDE_DELETE_PLAN_MODAL
});