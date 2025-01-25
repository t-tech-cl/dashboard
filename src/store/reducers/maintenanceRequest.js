import { createSlice } from '@reduxjs/toolkit';
import { REQUESTS_ENDPOINTS } from 'const/urls';

// project import
import { dispatch } from 'store';
import axiosServices from 'utils/axios';

const initialState = {
  requestNumber: null,
  requestList: [],
  applicant: {
    name: '',
    role: '',
    area: '',
    signature: null
  }
};

// ==============================|| maintenanceRequest - SLICE ||============================== //

const maintenanceRequest = createSlice({
  name: 'maintenanceRequest',
  initialState,
  reducers: {
    // update event
    updateRequest(state, action) {
      state.requestNumber = action.payload.requestNumber;
      const { name, role, area, signature, ...payload } = action.payload;
      state.applicant = { name, role, area, signature };
      state.request = payload;
    },
    getLastRequest(state, action) {
      state.requestNumber = action.payload.nextRequestNumber;
    },
    getAllRequests(state, action) {
      state.requestList = action.payload;
    }
  }
});

export default maintenanceRequest.reducer;

export const updateRequest = async (payload) => {
  try {
    const response = await axiosServices.post(REQUESTS_ENDPOINTS.CREATE_REQUEST, { ...payload });
    if (response.status === 200) {
      dispatch(maintenanceRequest.actions.updateRequest(payload));
    }
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const setCurrentRequest = async (requestNumber) => {
  try {
    const response = await axiosServices.get(REQUESTS_ENDPOINTS.GET_REQUEST, { params: { requestNumber } });
    if (response.status === 200) {
      dispatch(maintenanceRequest.actions.updateRequest(response.data));
    }
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getLastRequest = async () => {
  try {
    const { data } = await axiosServices.get(REQUESTS_ENDPOINTS.LAST_REQUEST);
    dispatch(maintenanceRequest.actions.getLastRequest(data));
  } catch (error) {
    console.log(error);
  }
};

export const getAllRequests = async () => {
  try {
    const { data } = await axiosServices.get(REQUESTS_ENDPOINTS.REQUEST_LIST);
    dispatch(maintenanceRequest.actions.getAllRequests(data));
  } catch (error) {
    console.log(error);
  }
};
