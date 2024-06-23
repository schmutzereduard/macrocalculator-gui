import MacroCalculatorApi from '../../api/MacroCalculatorApi';
import * as actionTypes from './actionTypes';

const fetchDayPlanRequest = () => ({ type: actionTypes.FETCH_DAY_PLAN_REQUEST });
const fetchDayPlanSuccess = (plan) => ({ type: actionTypes.FETCH_DAY_PLAN_SUCCESS, plan });
const fetchDayPlanFail = (error) => ({ type: actionTypes.FETCH_DAY_PLAN_FAIL, error });


export const fetchDayPlan = (year, month, day) => {
    return dispatch => {
        dispatch(fetchDayPlanRequest());
        MacroCalculatorApi.getDayPlan(year, month, day)
            .then(response => {
                const plan = response.data;
                dispatch(fetchDayPlanSuccess(plan));
            })
            .catch(error => {
                dispatch(fetchDayPlanFail(error));
            });
    };
};

const fetchMonthPlansRequest = () => ({ type: actionTypes.FETCH_MONTH_PLANS_REQUEST });
const fetchMonthPlansSuccess = (plans) => ({ type: actionTypes.FETCH_MONTH_PLANS_SUCCESS, plans });
const fetchMonthPlansFail = (error) => ({ type: actionTypes.FETCH_MONTH_PLANS_FAIL, error });


export const fetchMonthPlans = (year, month) => {
    return dispatch => {
        dispatch(fetchMonthPlansRequest());
        MacroCalculatorApi.getMonthPlans(year, month)
            .then(response => {
                const plans = response.data;
                dispatch(fetchMonthPlansSuccess(plans));
            })
            .catch(error => {
                dispatch(fetchMonthPlansFail(error));
            });
    };
};


const addPlanRequest = () => ({ type: actionTypes.ADD_PLAN_REQUEST });
const addPlanSuccess = (plan) => ({ type: actionTypes.ADD_PLAN_SUCCESS, plan });
const addPlanFail = (error) => ({ type: actionTypes.ADD_PLAN_FAIL, error });

export const addPlan = (plan) => {
    return dispatch => {
        dispatch(addPlanRequest());
        MacroCalculatorApi.addPlan(plan)
            .then(response => {
                const newPlan = response.data;
                dispatch(addPlanSuccess(newPlan));
            })
            .catch(error => {
                dispatch(addPlanFail(error));
            });
    };
};

const updatePlanRequest = () => ({ type: actionTypes.UPDATE_PLAN_REQUEST });
const updatePlanSuccess = (plan) => ({ type: actionTypes.UPDATE_PLAN_SUCCESS, plan });
const updatePlanFail = (error) => ({ type: actionTypes.UPDATE_PLAN_FAIL, error });

export const updatePlan = (plan) => {
    return dispatch => {
        dispatch(updatePlanRequest());
        MacroCalculatorApi.updatePlan(plan)
            .then(response => {
                const updatedPlan = response.data;
                dispatch(updatePlanSuccess(updatedPlan));
            })
            .catch(error => {
                dispatch(updatePlanFail(error));
            });
    };
};

const deletePlanRequest = () => ({ type: actionTypes.DELETE_PLAN_REQUEST });
const deletePlanSuccess = (id) => ({ type: actionTypes.DELETE_PLAN_SUCCESS, id });
const deletePlanFail = (error) => ({ type: actionTypes.DELETE_PLAN_FAIL, error });

export const deletePlan = (id) => {
    return dispatch => {
        dispatch(deletePlanRequest());
        MacroCalculatorApi.deletePlan(id)
            .then(() => {
                dispatch(deletePlanSuccess(id));
            })
            .catch(error => {
                dispatch(deletePlanFail(error));
            });
    };
};
