import React from 'react';
import { connect } from 'react-redux';

const PostItem = ({ post }) => {
    return (
        <div>
            <p>{post.post}</p>
        </div>
    )
}

export default connect(null)(PostItem);
