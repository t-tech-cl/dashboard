// third-party
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import other from 'menu-items/other';

// project import
// import axios from 'utils/axios';

// initial state
const initialState = {
  openItem: ['maintenance-request'],
  openComponent: 'buttons',
  selectedID: null,
  drawerOpen: false,
  componentDrawerOpen: true,
  menu: {},
  error: null
};

// ==============================|| SLICE - MENU ||============================== //

export const fetchMenu = createAsyncThunk('', async () => {
  // const response = await axios.get('/api/menu/dashboard');
  // return response.data;
  return other;
});

const menu = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    activeItem(state, action) {
      state.openItem = action.payload.openItem;
    },

    activeID(state, action) {
      state.selectedID = action.payload;
    },

    activeComponent(state, action) {
      state.openComponent = action.payload.openComponent;
    },

    openDrawer(state, action) {
      state.drawerOpen = action.payload;
    },

    openComponentDrawer(state, action) {
      state.componentDrawerOpen = action.payload.componentDrawerOpen;
    },

    hasError(state, action) {
      state.error = action.payload;
    }
  },

  extraReducers(state) {
    // builder.addCase(fetchMenu.fulfilled, (state, action) => {
    state.menu = other;
    // });
  }
});

export default menu.reducer;

export const { activeItem, activeComponent, openDrawer, openComponentDrawer, activeID } = menu.actions;
