import React, { useState, useContext } from 'react';
import AlertContext from '../../context/alert/AlertContext';

import { connect } from 'react-redux';
import { createPost, clearCurrent } from '../../redux/actions/Posts/postActions';

const PostForm = ({ current, createPost, clearCurrent }) => {
    const alertContext = useContext(AlertContext);
    const { setAlert } = alertContext;

    const [ post, setNewPost ] = useState('');

    // useEffect(() => {
    //     if(current) {
    //         setNewPost(current);
    //     } else {
    //         setNewPost({
    //             post: ''
    //         });
    //     }
    // }, [current]);
    
    const onChange = event => setNewPost({ ...post, [event.target.name]: event.target.value });

    const onSubmit = event => {
        event.preventDefault();
        if(post === '') {
            setAlert('Please enter a post', 'danger');
        } else {
            const newPost = {
                post
            };
            createPost(newPost);
            setNewPost('');
            clearAll();
        }
    }

    const clearAll = () => {
        clearCurrent();
    }

    return (
        <form onSubmit={onSubmit}>
            <h6>New Post</h6>
            <input 
                type="text"
                placeholder="Create New Post"
                name="post"
                value={post}
                onChange={e => setNewPost(e.target.value)}
            />
            <div>
                <input type="submit" value="Post" />
            </div>
            {current && <div>
                <button onClick={clearAll}>Clear</button>
                </div>}
        </form>
    )
};

const mapStateToProps = state => {
    return {
        current: state.post.current
    }
};

export default connect(mapStateToProps, { createPost, clearCurrent })(PostForm);
