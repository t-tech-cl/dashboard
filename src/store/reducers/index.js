// third-party
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// project import
import maintenanceRequest from './maintenanceRequest';
import menu from './menu';
import snackbar from './snackbar';
import productReducer from './product';
import cartReducer from './cart';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  maintenanceRequest,
  menu,
  snackbar,
  cart: persistReducer(
    {
      key: 'cart',
      storage,
      keyPrefix: 'mantis-js-'
    },
    cartReducer
  ),
  product: productReducer
});

export default reducers;
