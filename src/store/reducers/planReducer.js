import * as actionTypes from '../actions/actionTypes';

const initialState = {
    plans: [],
    loading: false,
    error: null
};

const planReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_MONTH_PLANS_REQUEST:
        case actionTypes.FETCH_DAY_PLAN_REQUEST:
        case actionTypes.ADD_PLAN_REQUEST:
        case actionTypes.UPDATE_PLAN_REQUEST:
        case actionTypes.DELETE_PLAN_REQUEST:
            return { ...state, loading: true };
        case actionTypes.FETCH_MONTH_PLANS_SUCCESS:
            return { ...state, plans: action.plans, loading: false };
        case actionTypes.FETCH_DAY_PLAN_SUCCESS:
            return { ...state, plan: action.plan, loading: false };

        case actionTypes.ADD_PLAN_SUCCESS:
            return { ...state, plans: [...state.plans, action.plan], loading: false };

        case actionTypes.UPDATE_PLAN_SUCCESS:
            return {
                ...state,
                plans: state.plans.map(plan =>
                    plan.id === action.plan.id ? action.plan : plan
                ),
                loading: false
            };

        case actionTypes.DELETE_PLAN_SUCCESS:
            return {
                ...state,
                plans: state.plans.filter(plan => plan.id !== action.id),
                loading: false
            };

        case actionTypes.FETCH_DAY_PLAN_FAIL:
        case actionTypes.FETCH_MONTH_PLANS_FAIL:
        case actionTypes.ADD_PLAN_FAIL:
        case actionTypes.UPDATE_PLAN_FAIL:
        case actionTypes.DELETE_PLAN_FAIL:
            return { ...state, error: action.error, loading: false };

        default:
            return state;
    }
};

export default planReducer;
