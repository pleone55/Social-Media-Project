import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { logout, loadUser } from '../../redux/actions/Auth/authActions';
import { clearPosts } from '../../redux/actions/Posts/postActions';

const Navbar = ({ title, isAuthenticated, logout, user, loadUser, clearPosts }) => {
    useEffect(() => {
        loadUser();
        //eslint-disable-next-line
    }, []);

    const onLogout = () => {
        logout();
        clearPosts();
    }

    const authLinks = (
        <>
            <li>Welcome {user && user.username}</li>
            <li>
                <a onClick={onLogout} href="#!"><i className="fas fa-sign-out-alt"></i><span className="hide-sm">Logout</span></a>
            </li>
        </>
    );

    const guestLinks = (
        <>
            <li>
                <Link to="/register">Register</Link>
            </li>
            <li>
                <Link to="/login">Login</Link>
            </li>
        </>
    );

    return (
        <div className="navbar bg-primary">
            <h1>
                {title}
            </h1>
            <ul>
                {isAuthenticated ? authLinks : guestLinks}
            </ul>
        </div>
    )
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
});

export default connect(mapStateToProps, { logout, clearPosts, loadUser } )(Navbar);