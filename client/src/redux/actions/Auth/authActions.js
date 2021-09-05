import axios from 'axios';
import setAuthToken from '../../../components/util/setAuthToken';
import {
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGOUT,
    CLEAR_ERRORS
} from '../../types';

const localHost = 'http://localhost:7777';

// Load user
export const loadUser = () => async dispatch => {
    // Load token into global headers
    setAuthToken(localStorage.token);

    try {
        const res = await axios.get(`${localHost}/api/auth`);

        dispatch({
            type: USER_LOADED,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        });
    }
};

// Register User
export const registerUser = formData => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const res = await axios.post(`${localHost}/api/signup`, formData, config);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());

    } catch (err) {
        dispatch({
            type: REGISTER_FAIL,
            payload: err.response.data
        });
    }
};


// Login User
export const loginUser = formData => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const res = await axios.post(`${localHost}/api/login`, formData, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());

    } catch (err) {
        dispatch({
            type: LOGIN_FAIL,
            payload: err.response.data
        });
    }
};

// Logout User
export const logout = () => async dispatch => {
    try {
        const res = await axios.post(`${localHost}/api/logout`);

        dispatch({
            type: LOGOUT,
            payload: res.data
        });

    } catch (err) {
        console.log(err);
    }
};

export const clearErrors = () => async dispatch => dispatch({ type: CLEAR_ERRORS });