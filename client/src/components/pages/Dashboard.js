import React from 'react';

import Posts from '../Posts/Posts';
import PostForm from '../Posts/PostForm';

const Dashboard = () => {
    return (
        <div>
            <div>
                <PostForm />
            </div>
            <div>
                <Posts />
            </div>
        </div>
    )
}

export default Dashboard;
