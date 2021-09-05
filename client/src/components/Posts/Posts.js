import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getPosts } from '../../redux/actions/Posts/postActions';

import PostItem from './PostItem';
import Spinner from '../layouts/Spinner';

const Posts = ({ post: { posts, loading }, getPosts, isAuthenticated }) => {
    useEffect(() => {
        getPosts();
        //eslint-disable-next-line
    }, []);

    if(loading || posts === null) {
        return <Spinner />
    }

    if(isAuthenticated) {
        return (
            <div>
                <h1>Dashboard</h1>
                {!loading && posts.length === 0 ? (<p>Create your first post...</p>) : (
                    posts.map(post => <PostItem post={post} key={post._id} />)
                )}
            </div>
        )
    }
};

const mapStateToProps = state => ({
    post: state.post,
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { getPosts })(Posts);
