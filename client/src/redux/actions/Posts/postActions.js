import axios from 'axios';
import {
    GET_POSTS,
    POSTS_ERROR,
    SET_LOADING,
    CREATE_POST,
    SET_CURRENT,
    CLEAR_CURRENT,
    CLEAR_POSTS,
    GET_POST,
    DELETE_POST
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

// Get Post
export const getPost = postId => async dispatch => {
    try {
        setLoading();

        const res = await axios.get(`${localHost}/api/dashboard/get-post/${postId}`);

        dispatch({
            type: GET_POST,
            payload: res.data
        });

        console.log(res.data);

    } catch (err) {
        dispatch({
            type: POSTS_ERROR,
            payload: err.response.data
        });
    }
};

// Delete Post
export const deletePost = postId => async dispatch => {
    try {
        setLoading();

        const res = await axios.delete(`${localHost}/api/dashboard/delete-post/${postId}`, { data: postId });

        dispatch({
            type: DELETE_POST,
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