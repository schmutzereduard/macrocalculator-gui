import * as actionTypes from '../actions/actionTypes';

const initialState = {
    journals: [],
    loading: false,
    error: null
};

const journalReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_MONTH_JOURNALS_REQUEST:
        case actionTypes.FETCH_DAY_JOURNAL_REQUEST:
        case actionTypes.ADD_JOURNAL_REQUEST:
        case actionTypes.UPDATE_JOURNAL_REQUEST:
        case actionTypes.DELETE_JOURNAL_REQUEST:
            return { ...state, loading: true };
        case actionTypes.FETCH_MONTH_JOURNALS_SUCCESS:
            return { ...state, journals: action.journals, loading: false };
        case actionTypes.FETCH_DAY_JOURNAL_SUCCESS:
            return { ...state, journal: action.journal, loading: false };

        case actionTypes.ADD_JOURNAL_SUCCESS:
            return { ...state, journals: [...state.journals, action.journal], loading: false };

        case actionTypes.UPDATE_JOURNAL_SUCCESS:
            return {
                ...state,
                journals: state.journals.map(journal =>
                    journal.id === action.journal.id ? action.journal : journal
                ),
                loading: false
            };

        case actionTypes.DELETE_JOURNAL_SUCCESS:
            return {
                ...state,
                journals: state.journals.filter(journal => journal.id !== action.id),
                loading: false
            };

        case actionTypes.FETCH_DAY_JOURNAL_FAIL:
        case actionTypes.FETCH_MONTH_JOURNALS_FAIL:
        case actionTypes.ADD_JOURNAL_FAIL:
        case actionTypes.UPDATE_JOURNAL_FAIL:
        case actionTypes.DELETE_JOURNAL_FAIL:
            return { ...state, error: action.error, loading: false };

        default:
            return state;
    }
};

export default journalReducer;
