import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ViewButton from '../layouts/ViewPostButton';
import { deletePost } from '../../redux/actions/Posts/postActions';

const PostItem = withRouter(({ post, deletePost }) => {
    const onDelete = () => {
        deletePost(post._id);
    }

    return (
        <div>
            <ViewButton post={post} /><span>
                <a href="#!" onClick={onDelete}>Delete</a>
            </span>
        </div>
    )
});

export default connect(null, { deletePost })(PostItem);
