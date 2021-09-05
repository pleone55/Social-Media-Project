/* eslint-disable import/no-anonymous-default-export */
import {
    GET_POSTS,
    POSTS_ERROR,
    SET_LOADING,
    CREATE_POST,
    SET_CURRENT,
    CLEAR_CURRENT,
    CLEAR_POSTS
} from '../types';

const initialState = {
    posts: null,
    loading: false,
    current: null,
    error: null
};

export default(state = initialState, action) => {
    switch(action.type) {
        case GET_POSTS:
            return {
                ...state,
                posts: action.payload,
                loading: false
            }
        case CREATE_POST:
            return {
                ...state,
                posts: [action.payload, ...state.posts],
                loading: false
            }
        case SET_LOADING:
            return {
                ...state,
                loading: true
            }
        case POSTS_ERROR:
            return {
                ...state,
                error: action.payload
            }
        case SET_CURRENT:
            return {
                ...state,
                current: action.payload
            }
        case CLEAR_CURRENT:
            return {
                ...state,
                current: null
            }
        case CLEAR_POSTS:
            return {
                ...state,
                posts: null,
                loading: true,
                current: null,
                error: null
            }
        default:
            return state;
    }
};