import * as actionTypes from '../actions/actionTypes';

const initialState = {
    recipes: [],
    loading: false,
    error: null
};

const recipeReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_RECIPES_REQUEST:
        case actionTypes.FETCH_RECIPE_REQUEST:
        case actionTypes.ADD_RECIPE_REQUEST:
        case actionTypes.UPDATE_RECIPE_REQUEST:
        case actionTypes.DELETE_RECIPE_REQUEST:
            return { ...state, loading: true };
        case actionTypes.FETCH_RECIPES_SUCCESS:
            return { ...state, recipes: action.recipes, loading: false };
        case actionTypes.FETCH_RECIPE_SUCCESS:
            return { ...state, recipe: action.recipe, loading: false};
        case actionTypes.ADD_RECIPE_SUCCESS:
            return { ...state, recipes: [...state.recipes, action.recipe], loading: false };
        case actionTypes.UPDATE_RECIPE_SUCCESS:
            return {
                ...state,
                recipes: state.recipes.map(recipe =>
                    recipe.id === action.recipe.id ? action.recipe : recipe
                ),
                loading: false
            };
        case actionTypes.DELETE_RECIPE_SUCCESS:
            return { ...state, recipes: state.recipes.filter(recipe => recipe.id !== action.id), loading: false };
        case actionTypes.FETCH_RECIPES_FAIL:
        case actionTypes.FETCH_RECIPE_FAIL:
        case actionTypes.ADD_RECIPE_FAIL:
        case actionTypes.UPDATE_RECIPE_FAIL:
        case actionTypes.DELETE_RECIPE_FAIL:
            return { ...state, error: action.error, loading: false };
        default:
            return state;
    }
};

export default recipeReducer;
