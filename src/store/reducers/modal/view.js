import * as actionTypes from '../../actions/actionTypes';

const initialState = {
    isRecipeModalOpen: false,
};

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.SHOW_RECIPE_MODAL:
            return {
                ...state,
                isRecipeModalOpen: true
            };
        case actionTypes.HIDE_RECIPE_MODAL:
            return {
                ...state,
                isRecipeModalOpen: false
            };
        default: return state;
    }
}

export default reducer;