import { createSlice } from '@reduxjs/toolkit';
import { REQUESTS_ENDPOINTS } from 'const/urls';

// project import
import { dispatch } from 'store';
import axiosServices from 'utils/axios';

const initialState = {
  requestList: [],
  request: {
    requestType: 'Preventiva',
    isClean: 'si',
    status: 'ongoing',
    requestDate: null,
    receptionDate: null,
    externalReport: {}
  }
};

// ==============================|| maintenanceRequest - SLICE ||============================== //

const maintenanceRequest = createSlice({
  name: 'maintenanceRequest',
  initialState,
  reducers: {
    // update event
    updateRequest(state, action) {
      state.request = action.payload;
    },
    getLastRequest(state, action) {
      state.request = {
        ...initialState.request,
        requestNumber: action.payload.nextRequestNumber
      };
    },
    getAllRequests(state, action) {
      state.requestList = action.payload;
    },
    initializeRequest(state) {
      state.request = initialState.request;
    }
  }
});

export default maintenanceRequest.reducer;
export const initializeRequest = async () => {
  dispatch(maintenanceRequest.actions.initializeRequest());
};

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

export const getRequest = async (requestNumber) => {
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
    let nextRequest = parseInt(data[0].requestNumber) + 1;
    nextRequest = `${nextRequest.toString().padStart(6, '0')}`;
    const array = [...data, { requestNumber: nextRequest }].sort((a, b) => b.requestNumber.localeCompare(a.requestNumber));
    dispatch(maintenanceRequest.actions.getAllRequests(array));
  } catch (error) {
    console.log(error);
  }
};
