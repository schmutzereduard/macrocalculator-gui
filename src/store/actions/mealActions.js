import MacroCalculatorApi from '../../api/MacroCalculatorApi';
import * as actionTypes from './actionTypes';

const fetchMealsRequest = () => ({ type: actionTypes.FETCH_MEALS_REQUEST });
const fetchMealsSuccess = (meals) => ({ type: actionTypes.FETCH_MEALS_SUCCESS, meals });
const fetchMealsFail = (error) => ({ type: actionTypes.FETCH_MEALS_FAIL, error });

export const fetchMeals = () => {
    return dispatch => {
        dispatch(fetchMealsRequest());
        MacroCalculatorApi.getAllMeals()
            .then(response => {
                const meals = response.data;
                dispatch(fetchMealsSuccess(meals));
            })
            .catch(error => {
                dispatch(fetchMealsFail(error));
            });
    };
};

const addMealRequest = () => ({ type: actionTypes.ADD_MEAL_REQUEST });
const addMealSuccess = (meal) => ({ type: actionTypes.ADD_MEAL_SUCCESS, meal });
const addMealFail = (error) => ({ type: actionTypes.ADD_MEAL_FAIL, error });

export const addMeal = (meal) => {
    return dispatch => {
        dispatch(addMealRequest());
        MacroCalculatorApi.addMeal(meal)
            .then(response => {
                const newMeal = response.data;
                dispatch(addMealSuccess(newMeal));
            })
            .catch(error => {
                dispatch(addMealFail(error));
            });
    };
};

const deleteMealRequest = () => ({ type: actionTypes.DELETE_MEAL_REQUEST });
const deleteMealSuccess = (id) => ({ type: actionTypes.DELETE_MEAL_SUCCESS, id });
const deleteMealFail = (error) => ({ type: actionTypes.DELETE_MEAL_FAIL, error });

export const deleteMeal = (id) => {
    return dispatch => {
        dispatch(deleteMealRequest());
        MacroCalculatorApi.deleteMeal(id)
            .then(() => {
                dispatch(deleteMealSuccess(id));
            })
            .catch(error => {
                dispatch(deleteMealFail(error));
            });
    };
};
