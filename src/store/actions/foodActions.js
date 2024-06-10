import MacroCalculatorApi from '../../api/MacroCalculatorApi';
import * as actionTypes from './actionTypes';

const fetchFoodsRequest = () => ({ type: actionTypes.FETCH_FOODS_REQUEST });
const fetchFoodsSuccess = (foods) => ({ type: actionTypes.FETCH_FOODS_SUCCESS, foods });
const fetchFoodsFail = (error) => ({ type: actionTypes.FETCH_FOODS_FAIL, error });

export const fetchFoods = () => {
    return dispatch => {
        dispatch(fetchFoodsRequest());
        MacroCalculatorApi.getFoods()
            .then(response => {
                const foods = response.data;
                dispatch(fetchFoodsSuccess(foods));
            })
            .catch(error => {
                dispatch(fetchFoodsFail(error));
            });
    };
};

const fetchFoodRequest = () => ({ type: actionTypes.FETCH_FOODS_REQUEST });
const fetchFoodSuccess = (id) => ({ type: actionTypes.FETCH_FOODS_SUCCESS, id });
const fetchFoodFail = (error) => ({ type: actionTypes.FETCH_FOODS_FAIL, error });

export const fetchFood = (id) => {
    return dispatch => {
        dispatch(fetchFoodRequest());
        MacroCalculatorApi.getFood(id)
            .then(response => {
                const food = response.data;
                dispatch(fetchFoodSuccess(food));
            })
            .catch(error => {
                dispatch(fetchFoodFail(error));
            });
    };
};

const fetchFoodTypesRequest = () => ({ type: actionTypes.FETCH_FOOD_TYPES_REQUEST });
const fetchFoodTypesSuccess = (types) => ({ type: actionTypes.FETCH_FOOD_TYPES_SUCCESS, types });
const fetchFoodTypesFail = (error) => ({ type: actionTypes.FETCH_FOOD_TYPES_FAIL, error });

export const fetchFoodTypes = () => {
    return dispatch => {
        dispatch(fetchFoodTypesRequest());
        MacroCalculatorApi.getFoodTypes()
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
        MacroCalculatorApi.addFood(food)
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
        MacroCalculatorApi.updateFood(food)
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
        MacroCalculatorApi.deleteFood(id)
            .then(() => {
                dispatch(deleteFoodSuccess(id));
            })
            .catch(error => {
                dispatch(deleteFoodFail(error));
            });
    };
};
