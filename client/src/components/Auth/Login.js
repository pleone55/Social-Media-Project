import React, { useState, useContext, useEffect } from 'react';
import AlertContext from '../../context/alert/AlertContext';

import { connect } from 'react-redux';
import { loginUser, clearErrors } from '../../redux/actions/Auth/authActions';

const Login = props => {
    const { auth: { isAuthenticated, error }, loginUser, clearErrors } = props;
    const alertContext = useContext(AlertContext);
    const { setAlert } = alertContext;

    useEffect(() => {
        if(isAuthenticated) {
            props.history.push('/dashboard');
        }

        if(error) {
            setAlert(error, 'danger');
            clearErrors();
        }
        //eslint-disable-next-line
    }, [error, isAuthenticated, props.history]);


    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const { email, password } = user;

    const onChange = event => setUser({ ...user, [event.target.name]: [event.target.value] });

    const onSubmit = event => {
        event.preventDefault();

        if(email === '' || password === '') {
            setAlert('Please fill in all fields', 'danger');
        } else {
            loginUser({
                email, 
                password
            });
        }
    };

    return (
        <div className="form-container">
            <h1>
                Account <span className="text-primary">Login</span>
            </h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" value={email} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" value={password} onChange={onChange} />
                </div>
                <input type="submit" value="Login" className="btn btn-primary btn-block" />
            </form>
        </div>
    )
};

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps, { loginUser, clearErrors })(Login);
