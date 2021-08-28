import React, { useState, useContext, useEffect } from 'react';
import authContext from '../../context/Auth/AuthContext';
import AlertContext from '../../context/alert/AlertContext';

const Register = props => {
    const AuthContext = useContext(authContext);
    const { registerUser, error, clearErrors, isAuthenticated } = AuthContext;

    const alertContext = useContext(AlertContext);
    const { setAlert } = alertContext;

    useEffect(() => {
        if(isAuthenticated) {
            props.history.push('/login');
        }
        if(error) {
            setAlert(error, 'danger');
            clearErrors();
        }
        //eslint-disable-next-line
    }, [error, isAuthenticated, props.history]);

    const [user, setUser] = useState({
        name: {
            firstName: '',
            lastName: ''
        },
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const { firstName, lastName, username, email, password, confirmPassword } = user;

    const onChange = event => setUser({ ...user, [event.target.name]: event.target.value });

    const onSubmit = event => {
        event.preventDefault();
        if(firstName === '' || lastName === '' || username === '' || password === '') {
            setAlert('Please fill out each field appropriately', 'danger');
        } else if(confirmPassword !== password) {
            setAlert('Passwords do not match', 'danger');
        } else {
            registerUser({
                firstName,
                lastName,
                username,
                email,
                password
            });
        }
    }
    return (
        <div>
            <h1>
                Account <span className="text-primary">Register</span>
            </h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" name="firstName" value={firstName} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" name="lastName" value={lastName} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" value={username} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" value={email} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" value={password} onChange={onChange} minLength="6"/>
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" name="confirmPassword" value={confirmPassword} onChange={onChange} />
                </div>
                <input type="submit" value="Register" className="btn btn-primary btn-block" />
            </form>
        </div>
    )
}

export default Register;
