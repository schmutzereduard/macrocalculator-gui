import MacroCalculatorApi from '../../api/MacroCalculatorApi';
import * as actionTypes from './actionTypes';

const fetchRecipesRequest = () => ({ type: actionTypes.FETCH_RECIPES_REQUEST });
const fetchRecipesSuccess = (recipes) => ({ type: actionTypes.FETCH_RECIPES_SUCCESS, recipes });
const fetchRecipesFail = (error) => ({ type: actionTypes.FETCH_RECIPES_FAIL, error });

export const fetchRecipes = () => {
    return dispatch => {
        dispatch(fetchRecipesRequest());
        MacroCalculatorApi.getAllRecipes()
            .then(response => {
                const recipes = response.data;
                dispatch(fetchRecipesSuccess(recipes));
            })
            .catch(error => {
                dispatch(fetchRecipesFail(error));
            });
    };
};

const fetchRecipeRequest = () => ({ type: actionTypes.FETCH_RECIPE_REQUEST });
const fetchRecipeSuccess = (recipe) => ({ type: actionTypes.FETCH_RECIPE_SUCCESS, recipe: recipe });
const fetchRecipeFail = (error) => ({ type: actionTypes.FETCH_RECIPE_FAIL, error });

export const fetchRecipe = (id) => {
    return dispatch => {
        dispatch(fetchRecipeRequest());
        MacroCalculatorApi.getRecipe(id)
            .then(response => {
                const recipe = response.data;
                dispatch(fetchRecipeSuccess(recipe));
            })
            .catch(error => {
                dispatch(fetchRecipeFail(error));
            });
    };
};

const addRecipeRequest = () => ({ type: actionTypes.ADD_RECIPE_REQUEST });
const addRecipeSuccess = (recipe) => ({ type: actionTypes.ADD_RECIPE_SUCCESS, recipe });
const addRecipeFail = (error) => ({ type: actionTypes.ADD_RECIPE_FAIL, error });

export const addRecipe = (recipe) => {
    return dispatch => {
        dispatch(addRecipeRequest());
        MacroCalculatorApi.addRecipe(recipe)
            .then(response => {
                const newRecipe = response.data;
                dispatch(addRecipeSuccess(newRecipe));
            })
            .catch(error => {
                dispatch(addRecipeFail(error));
            });
    };
};

const updateRecipeRequest = () => ({ type: actionTypes.UPDATE_RECIPE_REQUEST });
const updateRecipeSuccess = (recipe) => ({ type: actionTypes.UPDATE_RECIPE_SUCCESS, recipe });
const updateRecipeFail = (error) => ({ type: actionTypes.UPDATE_RECIPE_FAIL, error });

export const updateRecipe = (recipe) => {
    return dispatch => {
        dispatch(updateRecipeRequest());
        MacroCalculatorApi.updateRecipe(recipe)
            .then(response => {
                const updatedRecipe = response.data;
                dispatch(updateRecipeSuccess(updatedRecipe));
            })
            .catch(error => {
                dispatch(updateRecipeFail(error));
            });
    };
};

const deleteRecipeRequest = () => ({ type: actionTypes.DELETE_RECIPE_REQUEST });
const deleteRecipeSuccess = (id) => ({ type: actionTypes.DELETE_RECIPE_SUCCESS, id });
const deleteRecipeFail = (error) => ({ type: actionTypes.DELETE_RECIPE_FAIL, error });

export const deleteRecipe = (id) => {
    return dispatch => {
        dispatch(deleteRecipeRequest());
        MacroCalculatorApi.deleteRecipe(id)
            .then(() => {
                dispatch(deleteRecipeSuccess(id));
            })
            .catch(error => {
                dispatch(deleteRecipeFail(error));
            });
    };
};
