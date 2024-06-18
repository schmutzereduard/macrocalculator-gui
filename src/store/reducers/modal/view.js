import * as actionTypes from '../../actions/actionTypes';

const initialState = {
    showRecipeModal: false,
};

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.SHOW_RECIPE_MODAL:
            return {
                ...state,
                showRecipeModal: true
            };
        case actionTypes.HIDE_RECIPE_MODAL:
            return {
                ...state,
                showRecipeModal: false
            };
        default: return state;
    }
}

export default reducer;