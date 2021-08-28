import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Alerts from './components/layouts/Alerts';

import AuthState from './context/Auth/AuthState';
import AlertState from './context/alert/AlertState';
import setAuthToken from './components/util/setAuthToken';

if(localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  return (
    <AuthState>
      <AlertState>
        <BrowserRouter>
          <>
            <div className='container'>
              <Alerts />
              <Switch>
                <Route exact path='/register' component={Register} />
                <Route exact path='/login' component={Login} />
              </Switch>
            </div>
          </>
        </BrowserRouter>
      </AlertState>
    </AuthState>
  )
};

export default App;
