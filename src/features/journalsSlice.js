import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import MacroCalculatorApi from "../api/MacroCalculatorApi";

// Thunks for Journals

export const fetchMonthJournals = createAsyncThunk(
  "journals/fetchMonthJournals",
  async ({ year, month }) => {
    const response = await MacroCalculatorApi.getMonthJournals(year, month);
    return response.data;
  }
);

export const fetchDayJournal = createAsyncThunk(
  "journals/fetchDayJournal",
  async ({ year, month, day }) => {
    const response = await MacroCalculatorApi.getDayJournal(year, month, day);
    return response.data;
  }
);

export const addJournal = createAsyncThunk(
  "journals/addJournal",
  async (journal) => {
    const response = await MacroCalculatorApi.addJournal(journal);
    return response.data;
  }
);

export const updateJournal = createAsyncThunk(
  "journals/updateJournal",
  async (journal) => {
    const response = await MacroCalculatorApi.updateJournal(journal);
    return response.data;
  }
);

export const deleteJournal = createAsyncThunk(
  "journals/deleteJournal",
  async (id) => {
    await MacroCalculatorApi.deleteJournal(id);
    return id;
  }
);

// Slice for Journals

const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.error.message;
};

const journalsSlice = createSlice({
  name: "journals",
  initialState: {
    items: [],
    selectedItem: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthJournals.pending, handlePending)
      .addCase(fetchMonthJournals.rejected, handleRejected)
      .addCase(fetchMonthJournals.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDayJournal.pending, handlePending)
      .addCase(fetchDayJournal.rejected, handleRejected)
      .addCase(fetchDayJournal.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedItem = action.payload;
      })
      .addCase(addJournal.pending, handlePending)
      .addCase(addJournal.rejected, handleRejected)
      .addCase(addJournal.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(updateJournal.pending, handlePending)
      .addCase(updateJournal.rejected, handleRejected)
      .addCase(updateJournal.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((journal) =>
          journal.id === action.payload.id ? action.payload : journal
        );
      })
      .addCase(deleteJournal.pending, handlePending)
      .addCase(deleteJournal.rejected, handleRejected)
      .addCase(deleteJournal.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((journal) => journal.id !== action.payload);
      });
  },
});

export default journalsSlice.reducer;