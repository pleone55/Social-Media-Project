import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import rootReducer from './redux/reducers';

const initialState = {

};

const middleware = [thunk];

export const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export const persistor = persistStore(store);

// eslint-disable-next-line import/no-anonymous-default-export
export default { store, persistor };