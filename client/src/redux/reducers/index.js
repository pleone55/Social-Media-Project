import { combineReducers } from "redux";
import { persistReducer } from 'redux-persist';
import postReducer from "./postReducer";
import authReducer from "./authReducer";
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth']
};

export default persistReducer(persistConfig, combineReducers({
    auth: authReducer,
    post: postReducer
}));