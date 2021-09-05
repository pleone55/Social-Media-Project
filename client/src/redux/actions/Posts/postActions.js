import axios from 'axios';
import {
    GET_POSTS,
    POSTS_ERROR,
    SET_LOADING,
    CREATE_POST,
    SET_CURRENT,
    CLEAR_CURRENT,
    CLEAR_POSTS
} from '../../types';

const localHost = 'http://localhost:7777';

// Get Posts
export const getPosts = () => async dispatch => {
    try {
        setLoading();

        const res = await axios.get(`${localHost}/api/dashboard`);

        dispatch({
            type: GET_POSTS,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: POSTS_ERROR,
            payload: err.response.data
        });
        console.log(err);
    }
};

// Create Post
export const createPost = post => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    try {
        setLoading();

        const res = await axios.post(`${localHost}/api/dashboard/create-post`, post, config);

        console.log(res.data)
        dispatch({
            type: CREATE_POST,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: POSTS_ERROR,
            payload: err.response.data
        });
    }
};

//Set loading to true
export const setLoading = () => {
    return {
        type: SET_LOADING
    };
};

//Set Current Post
export const setCurrent = post => async dispatch => {
    dispatch({ type: SET_CURRENT, payload: post });
}

//Clear Current Post
export const clearCurrent = () => async dispatch => {
    dispatch({ type: CLEAR_CURRENT });
}

//Clear Posts
export const clearPosts = () => async dispatch => {
    dispatch({ type: CLEAR_POSTS })
}