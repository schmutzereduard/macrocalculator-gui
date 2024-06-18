import MacroCalculatorApi from '../../api/MacroCalculatorApi';
import * as actionTypes from './actionTypes';

const fetchPlansRequest = () => ({ type: actionTypes.FETCH_PLANS_REQUEST });
const fetchPlansSuccess = (plans) => ({ type: actionTypes.FETCH_PLANS_SUCCESS, plans });
const fetchPlansFail = (error) => ({ type: actionTypes.FETCH_PLANS_FAIL, error });

export const fetchPlans = () => {
    return dispatch => {
        dispatch(fetchPlansRequest());
        MacroCalculatorApi.getPlans()
            .then(response => {
                const plans = response.data;
                dispatch(fetchPlansSuccess(plans));
            })
            .catch(error => {
                dispatch(fetchPlansFail(error));
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
