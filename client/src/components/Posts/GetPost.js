import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getPost } from '../../redux/actions/Posts/postActions';
import { Link } from 'react-router-dom';
import Spinner from '../layouts/Spinner';

const GetPost = props => {
    const { getPost, posts, isAuthenticated } = props;

    useEffect(() => {
        getPost(props.match.params.postId);
        //eslint-disable-next-line
    }, []);

    if(!isAuthenticated) {
        return <Spinner />
    } else {
        return (
            <div>
                {/* <h4>{posts.user.username}</h4> */}
                <p>{posts.post}</p><span> {posts.ts}</span>
                <ul>
                    <li></li>
                </ul>
            </div>
        )
    }
};

const mapStateToProps = state => ({
    posts: state.post.posts,
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { getPost })(GetPost);

