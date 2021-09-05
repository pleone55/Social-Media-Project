import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({ isAuthenticated, loading, component: Component, ...rest}) => {
    return (
        <div>
            <Route {...rest} render={props => !isAuthenticated && !loading ? (
                <Redirect to='/login' />
            ) : (
                <Component {...props} />
            )} />
        </div>
    )
};

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        loading: state.auth.isAuthenticated
    }
};

export default connect(mapStateToProps)(PrivateRoute);
