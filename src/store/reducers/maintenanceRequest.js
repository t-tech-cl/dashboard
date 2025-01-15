import { createSlice } from '@reduxjs/toolkit';

// project import
import { dispatch } from 'store';

const initialState = {
  request: null,
  requestor: {
    applicantName: '',
    applicantRole: '',
    applicantArea: '',
    applicantSignature: null
  }
};

// ==============================|| maintenanceRequest - SLICE ||============================== //

const maintenanceRequest = createSlice({
  name: 'maintenanceRequest',
  initialState,
  reducers: {
    // update event
    updateRequest(state, action) {
      state.request = action.payload.request;
      state.requestor = action.payload.requestor;
    }
  }
});

export default maintenanceRequest.reducer;

export function updateRequest(payload) {
  return async () => {
    dispatch(maintenanceRequest.actions.updateRequest(payload));
  };
}
