// mport * as actionTypes from '../actions/actionTypes';

// const initialState = {
//     monthlyExpectations: [],
//     isLoading: false,
//     error: null,
//     isActive: false,
//     updateExpectationValuesSuccess: false,
//     deleteExpectationValuesSuccess: false,
//     insertExpectationSuccess: false
// };

// const reducer = (state = initialState, action) => {
//     switch (action.type) {
//         case actionTypes.FETCH_MONTHLY_EXPECTATIONS_REQUEST:
//             return { ...state, isLoading: true };
//         case actionTypes.FETCH_MONTHLY_EXPECTATIONS_SUCCESS:
//             return { 
//                 ...state, 
//                 monthlyExpectations: action.monthlyExpectations, 
//                 isLoading: false, 
//                 error: null 
//             };
//         case actionTypes.FETCH_MONTHLY_EXPECTATIONS_FAIL:
//             return { ...state, isLoading: false, error: action.error };
//         case actionTypes.UPDATE_MONTHLY_EXPECTATION_VALUES_SUCCESS:
//             return { ...state, updateExpectationValuesSuccess: true };
//         case actionTypes.UPDATE_MONTHLY_EXPECTATION_VALUES_FAIL:
//             return { 
//                 ...state, 
//                 isLoading: false, 
//                 error: action.error, 
//                 isActive: true, 
//                 updateExpectationValuesSuccess: false 
//             };
//         case actionTypes.DELETE_MONTHLY_EXPECTATION_VALUES_SUCCESS:
//             return { ...state, deleteExpectationValuesSuccess: true };
//         case actionTypes.DELETE_MONTHLY_EXPECTATION_VALUES_FAIL:
//             return { 
//                 ...state, 
//                 isLoading: false, 
//                 error: action.error, 
//                 isActive: true, 
//                 deleteExpectationValuesSuccess: false 
//             };
//         case actionTypes.INSERT_MONTHLY_EXPECTATION_VALUES_SUCCESS:
//             return { ...state, insertExpectationSuccess: true };
//         case actionTypes.CLEAR_ALERT_DATA:
//             return { 
//                 ...state, 
//                 isLoading: false, 
//                 error: null, 
//                 updateExpectationValuesSuccess: false, 
//                 deleteExpectationValuesSuccess: false, 
//                 insertExpectationSuccess: false 
//             };
//         default:
//             return state;
//     }
// };

// export default reducer;