import MacroCalculatorAPI from '../../api/MacroCalculatorAPI';
import * as actionTypes from './actionTypes';

const fetchFoodsRequest = () => {
    return { type: actionTypes.FETCH_FOODS_REQUEST };
}

const fetchFoodsSuccess = (foods) => {
    return { type: actionTypes.FETCH_FOODS_SUCCESS, foods };
}

const fetchFoodsFail = (error) => {
    return { type: actionTypes.FETCH_FOODS_FAIL, error };
}

export const fetchFoods = () => {
    return dispatch => {
        dispatch(fetchFoodsRequest());
        MacroCalculatorAPI.getFoods()
            .then(response => {
                let foods = response.data;
                dispatch(fetchFoodsSuccess(foods));
            })
            .catch(error => {
                dispatch(fetchFoodsFail(error));
            })
    } 
}