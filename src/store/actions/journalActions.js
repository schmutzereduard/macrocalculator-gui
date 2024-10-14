import MacroCalculatorApi from '../../api/MacroCalculatorApi';
import * as actionTypes from './actionTypes';

const fetchDayJournalRequest = () => ({ type: actionTypes.FETCH_DAY_JOURNAL_REQUEST });
const fetchDayJournalSuccess = (journal) => ({ type: actionTypes.FETCH_DAY_JOURNAL_SUCCESS, journal });
const fetchDayJournalFail = (error) => ({ type: actionTypes.FETCH_DAY_JOURNAL_FAIL, error });


export const fetchDayJournal = (year, month, day) => {
    return dispatch => {
        dispatch(fetchDayJournalRequest());
        MacroCalculatorApi.getDayJournal(year, month, day)
            .then(response => {
                const journal = response.data;
                dispatch(fetchDayJournalSuccess(journal));
            })
            .catch(error => {
                dispatch(fetchDayJournalFail(error));
            });
    };
};

const fetchMonthJournalsRequest = () => ({ type: actionTypes.FETCH_MONTH_JOURNALS_REQUEST });
const fetchMonthJournalsSuccess = (journals) => ({ type: actionTypes.FETCH_MONTH_JOURNALS_SUCCESS, journals });
const fetchMonthJournalsFail = (error) => ({ type: actionTypes.FETCH_MONTH_JOURNALS_FAIL, error });


export const fetchMonthJournals = (year, month) => {
    return dispatch => {
        dispatch(fetchMonthJournalsRequest());
        MacroCalculatorApi.getMonthJournals(year, month)
            .then(response => {
                const journals = response.data;
                dispatch(fetchMonthJournalsSuccess(journals));
            })
            .catch(error => {
                dispatch(fetchMonthJournalsFail(error));
            });
    };
};


const addJournalRequest = () => ({ type: actionTypes.ADD_JOURNAL_REQUEST });
const addJournalSuccess = (journal) => ({ type: actionTypes.ADD_JOURNAL_SUCCESS, journal });
const addJournalFail = (error) => ({ type: actionTypes.ADD_JOURNAL_FAIL, error });

export const addJournal = (journal) => {
    return dispatch => {
        dispatch(addJournalRequest());
        MacroCalculatorApi.addJournal(journal)
            .then(response => {
                const newJournal = response.data;
                dispatch(addJournalSuccess(newJournal));
            })
            .catch(error => {
                dispatch(addJournalFail(error));
            });
    };
};

const updateJournalRequest = () => ({ type: actionTypes.UPDATE_JOURNAL_REQUEST });
const updateJournalSuccess = (journal) => ({ type: actionTypes.UPDATE_JOURNAL_SUCCESS, journal });
const updateJournalFail = (error) => ({ type: actionTypes.UPDATE_JOURNAL_FAIL, error });

export const updateJournal = (journal) => {
    return dispatch => {
        dispatch(updateJournalRequest());
        MacroCalculatorApi.updateJournal(journal)
            .then(response => {
                const updatedJournal = response.data;
                dispatch(updateJournalSuccess(updatedJournal));
            })
            .catch(error => {
                dispatch(updateJournalFail(error));
            });
    };
};

const deleteJournalRequest = () => ({ type: actionTypes.DELETE_JOURNAL_REQUEST });
const deleteJournalSuccess = (id) => ({ type: actionTypes.DELETE_JOURNAL_SUCCESS, id });
const deleteJournalFail = (error) => ({ type: actionTypes.DELETE_JOURNAL_FAIL, error });

export const deleteJournal = (id) => {
    return dispatch => {
        dispatch(deleteJournalRequest());
        MacroCalculatorApi.deleteJournal(id)
            .then(() => {
                dispatch(deleteJournalSuccess(id));
            })
            .catch(error => {
                dispatch(deleteJournalFail(error));
            });
    };
};
