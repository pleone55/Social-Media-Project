import React, { useReducer } from 'react';
import axios from 'axios';
import authContext from './AuthContext';
import authReducer from './AuthReducer';
import setAuthToken from '../../components/util/setAuthToken';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_ERRORS
} from '../../context/types';

const AuthState = props => {
    const initialState = {
        token: localStorage.getItem('token'),
        isAuthenticated: null,
        user: null,
        loading: null,
        error: null
    };

    const [state, dispatch] = useReducer(authReducer, initialState);

    // //Load User
    // const loadUser = async() => {
    //     // Load token into gloabl headers
    //     setAuthToken(localStorage.token);

    //     try {
    //         const res = await axios.get('http://localhost:7777/api/auth');

    //         dispatch({
    //             type: USER_LOADED,
    //             payload: res.data
    //         });

    //         console.log(res.data);

    //     } catch (err) {
    //         dispatch({
    //             type: AUTH_ERROR
    //         });
    //     }
    // };

    // Register User
    const registerUser = async(formData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.post('http://localhost:7777/api/signup', formData, config);

            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            });

            // loadUser();

        } catch (err) {
            dispatch({
                type: REGISTER_FAIL,
                payload: err.response.data.msg
            });
        }
    };

    // Login User
    const loginUser = async(formData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.post('http://localhost:7777/api/login', formData, config);

            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });

            // loadUser();

        } catch (err) {
            dispatch({
                type: LOGIN_FAIL,
                payload: err.response.data.msg
            });
        }
    };

    // Logout User
    const logout = async() => {
        try {
            const res = await axios.post('http://localhost:7777/api/logout');

            dispatch({
                type: LOGOUT,
                payload: res.data
            });

        } catch (err) {
            console.log(err);
        }
    };

    const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

    return (
        <authContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                loading: state.loading,
                user: state.user,
                error: state.error,
                registerUser,
                loginUser,
                logout,
                clearErrors
            }}
        >
            { props.children }
        </authContext.Provider>
    );
};

export default AuthState;