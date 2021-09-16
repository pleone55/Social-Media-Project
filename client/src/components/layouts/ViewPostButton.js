import React from 'react';
import { withRouter } from 'react-router-dom';

const ViewButton = withRouter(({ post, history }) => {
    const { _id } = post;

    return (
        <button type="button" value={_id} name="postId" onClick={() => history.push(`/dashboard/posts/${_id}`)}>{post.post}</button>
    )
});

export default ViewButton;