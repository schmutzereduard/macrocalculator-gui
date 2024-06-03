// actions/foodActions.js

import MacroCalculatorAPI from '../../api/MacroCalculatorAPI';
import * as actionTypes from './actionTypes';

const fetchFoodsRequest = () => ({ type: actionTypes.FETCH_FOODS_REQUEST });
const fetchFoodsSuccess = (foods) => ({ type: actionTypes.FETCH_FOODS_SUCCESS, foods });
const fetchFoodsFail = (error) => ({ type: actionTypes.FETCH_FOODS_FAIL, error });

export const fetchFoods = () => {
    return dispatch => {
        dispatch(fetchFoodsRequest());
        MacroCalculatorAPI.getFoods()
            .then(response => {
                const foods = response.data;
                dispatch(fetchFoodsSuccess(foods));
            })
            .catch(error => {
                dispatch(fetchFoodsFail(error));
            });
    };
};

const fetchFoodTypesRequest = () => ({ type: actionTypes.FETCH_FOOD_TYPES_REQUEST });
const fetchFoodTypesSuccess = (types) => ({ type: actionTypes.FETCH_FOOD_TYPES_SUCCESS, types });
const fetchFoodTypesFail = (error) => ({ type: actionTypes.FETCH_FOOD_TYPES_FAIL, error });

export const fetchFoodTypes = () => {
    return dispatch => {
        dispatch(fetchFoodTypesRequest());
        MacroCalculatorAPI.getFoodTypes()
            .then(response => {
                const types = response.data;
                dispatch(fetchFoodTypesSuccess(types));
            })
            .catch(error => {
                dispatch(fetchFoodTypesFail(error));
            });
    };
};

const addFoodRequest = () => ({ type: actionTypes.ADD_FOOD_REQUEST });
const addFoodSuccess = (food) => ({ type: actionTypes.ADD_FOOD_SUCCESS, food });
const addFoodFail = (error) => ({ type: actionTypes.ADD_FOOD_FAIL, error });

export const addFood = (food) => {
    return dispatch => {
        dispatch(addFoodRequest());
        MacroCalculatorAPI.addFood(food)
            .then(response => {
                const newFood = response.data;
                dispatch(addFoodSuccess(newFood));
            })
            .catch(error => {
                dispatch(addFoodFail(error));
            });
    };
};

const updateFoodRequest = () => ({ type: actionTypes.UPDATE_FOOD_REQUEST });
const updateFoodSuccess = (food) => ({ type: actionTypes.UPDATE_FOOD_SUCCESS, food });
const updateFoodFail = (error) => ({ type: actionTypes.UPDATE_FOOD_FAIL, error });

export const updateFood = (food) => {
    return dispatch => {
        dispatch(updateFoodRequest());
        MacroCalculatorAPI.updateFood(food)
            .then(response => {
                const updatedFood = response.data;
                dispatch(updateFoodSuccess(updatedFood));
            })
            .catch(error => {
                dispatch(updateFoodFail(error));
            });
    };
};

const deleteFoodRequest = () => ({ type: actionTypes.DELETE_FOOD_REQUEST });
const deleteFoodSuccess = (id) => ({ type: actionTypes.DELETE_FOOD_SUCCESS, id });
const deleteFoodFail = (error) => ({ type: actionTypes.DELETE_FOOD_FAIL, error });

export const deleteFood = (id) => {
    return dispatch => {
        dispatch(deleteFoodRequest());
        MacroCalculatorAPI.deleteFood(id)
            .then(() => {
                dispatch(deleteFoodSuccess(id));
            })
            .catch(error => {
                dispatch(deleteFoodFail(error));
            });
    };
};
