// import * as actionTypes from './actionTypes';
// import SelfServicePortalAPI from '../../api/SelfServicePortalAPI';
// import nextId from "react-id-generator";

// // Fetch Monthly Expectations Actions
// const fetchMonthlyExpectationsRequest = () => {
//     return { type: actionTypes.FETCH_MONTHLY_EXPECTATIONS_REQUEST }
// }

// const fetchMonthlyExpectationsSuccess = (monthlyExpectations) => {
//     return { type: actionTypes.FETCH_MONTHLY_EXPECTATIONS_SUCCESS, monthlyExpectations }
// }

// const fetchMonthlyExpectationsFail = (error) => {
//     return { type: actionTypes.FETCH_MONTHLY_EXPECTATIONS_FAIL, error }
// }

// export const fetchMonthlyExpectations = () => {
//     return dispatch => {
//         dispatch(fetchMonthlyExpectationsRequest());
//         SelfServicePortalAPI.getMonthlyExpectations()
//             .then(response => {
//                 let monthlyExpectations = response.data ? response.data.map(item => {
//                     return { expectationId: nextId(), ...item }
//                 }) : [];
//                 dispatch(fetchMonthlyExpectationsSuccess(monthlyExpectations));
//             })
//             .catch(error => {
//                 dispatch(fetchMonthlyExpectationsFail(error));
//             })
//     }
// }

// // Update Monthly Expectation Values Actions
// const updateMonthlyExpectationValuesRequest = () => {
//     return { type: actionTypes.UPDATE_MONTHLY_EXPECTATION_VALUES_REQUEST }
// }

// const updateMonthlyExpectationValuesSuccess = () => {
//     return { type: actionTypes.UPDATE_MONTHLY_EXPECTATION_VALUES_SUCCESS }
// }

// const updateMonthlyExpectationValuesFail = (error) => {
//     return { type: actionTypes.UPDATE_MONTHLY_EXPECTATION_VALUES_FAIL, error }
// }

// export const updateMonthlyExpectationValues = (interfaceName, newExpectationValues) => {
//     return dispatch => {
//         dispatch(updateMonthlyExpectationValuesRequest());
//         SelfServicePortalAPI.updateMonthlyExpectation(interfaceName, newExpectationValues)
//             .then(() => {
//                 dispatch(updateMonthlyExpectationValuesSuccess());
//                 dispatch(fetchMonthlyExpectations());
//             })
//             .catch(error => {
//                 dispatch(updateMonthlyExpectationValuesFail(error));
//                 throw error;
//             })
//     }
// }

// // Delete Monthly Expectation Values Actions
// const deleteMonthlyExpectationValuesRequest = () => {
//     return { type: actionTypes.DELETE_MONTHLY_EXPECTATION_VALUES_REQUEST }
// }

// const deleteMonthlyExpectationValuesSuccess = () => {
//     return { type: actionTypes.DELETE_MONTHLY_EXPECTATION_VALUES_SUCCESS }
// }

// const deleteMonthlyExpectationValuesFail = (error) => {
//     return { type: actionTypes.DELETE_MONTHLY_EXPECTATION_VALUES_FAIL, error }
// }

// export const deleteMonthlyExpectationValue = (expectation) => {
//     return dispatch => {
//         dispatch(deleteMonthlyExpectationValuesRequest());
//         SelfServicePortalAPI.deleteMonthlyExpectation(expectation)
//             .then(() => {
//                 dispatch(deleteMonthlyExpectationValuesSuccess());
//                 dispatch(fetchMonthlyExpectations());
//             })
//             .catch(error => {
//                 dispatch(deleteMonthlyExpectationValuesFail(error));
//                 throw error;
//             })
//     }
// }

// // Insert Monthly Expectation Values Actions
// const insertMonthlyExpectationValuesRequest = () => {
//     return { type: actionTypes.INSERT_MONTHLY_EXPECTATION_VALUES_REQUEST }
// }

// const insertMonthlyExpectationValuesSuccess = () => {
//     return { type: actionTypes.INSERT_MONTHLY_EXPECTATION_VALUES_SUCCESS }
// }

// const insertMonthlyExpectationValuesFail = (error) => {
//     return { type: actionTypes.INSERT_MONTHLY_EXPECTATION_VALUES_FAIL, error }
// }

// export const insertMonthlyExpectationValue = (expectation) => {
//     return dispatch => {
//         dispatch(insertMonthlyExpectationValuesRequest());
//         SelfServicePortalAPI.insertMonthlyExpectation(expectation)
//             .then(() => {
//                 dispatch(insertMonthlyExpectationValuesSuccess());
//                 dispatch(fetchMonthlyExpectations());
//             })
//             .catch(error => {
//                 dispatch(insertMonthlyExpectationValuesFail(error));
//                 throw error;
//             })
//     }
// }