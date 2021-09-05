import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Dashboard from './components/pages/Dashboard';
import Alerts from './components/layouts/Alerts';
import PrivateRoute from './components/routes/PrivateRoute';

import AlertState from './context/alert/AlertState';
import setAuthToken from './components/util/setAuthToken';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor} from './store';
import Navbar from './components/layouts/Navbar';

if(localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AlertState>
            <BrowserRouter>
              <>
                <Navbar title='Leone Media' />
                <div className='container'>
                  <Alerts />
                  <Switch>
                    <PrivateRoute exact path='/dashboard' component={Dashboard} />
                    <Route exact path='/register' component={Register} />
                    <Route exact path='/login' component={Login} />
                  </Switch>
                </div>
              </>
            </BrowserRouter>
        </AlertState>
      </PersistGate>
    </Provider>
  )
};

export default App;
