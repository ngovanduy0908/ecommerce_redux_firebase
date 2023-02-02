import React, { useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './header.css';

import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import logo from '../../assets/images/eco-logo.png';
import userIcon from '../../assets/images/user-icon.png';
import { Container, Row } from 'reactstrap';
import useAuth from '../../custom-hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase.config';
import { toast } from 'react-toastify';
const nav__links = [
    {
        path: 'home',
        display: 'Home',
    },
    {
        path: 'shop',
        display: 'Shop',
    },
    {
        path: 'cart',
        display: 'Cart',
    },
];

const Header = () => {
    const { currentUser } = useAuth();
    // console.log(currentUser.photoURL);
    const headerRef = useRef(null);
    const navigate = useNavigate();
    const totalQuantity = useSelector((state) => state.cart.totalQuantity);
    const profileActionRef = useRef(null);
    const menuRef = useRef(null);

    const stickyHeaderFunc = () => {
        window.addEventListener('scroll', () => {
            if (
                document.body.scrollTop > 80 ||
                document.documentElement.scrollTop > 80
            ) {
                headerRef.current.classList.add('sticky__header');
            } else {
                headerRef.current.classList.remove('sticky__header');
            }
        });
    };

    const logout = () => {
        signOut(auth)
            .then(() => {
                toast.success('Logged out ');
                navigate('/home');
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    useEffect(() => {
        stickyHeaderFunc();

        return () => window.removeEventListener('scroll', stickyHeaderFunc);
    });

    const menuToggle = () => {
        menuRef.current.classList.toggle('active__menu');
    };

    const navigationToCart = () => {
        navigate('/cart');
    };

    const toggleProfileActions = () =>
        profileActionRef.current.classList.toggle('show__profileActions');

    return (
        <header className="header" ref={headerRef}>
            <Container>
                <Row>
                    <div className="nav__wrapper">
                        <div className="logo">
                            <img src={logo} alt="logo" />
                            <div>
                                <h1>Multimart</h1>
                                {/* <p>Since 1995</p> */}
                            </div>
                        </div>

                        <div
                            className="navigation"
                            ref={menuRef}
                            onClick={menuToggle}
                        >
                            <ul className="menu">
                                {nav__links.map((item, index) => (
                                    <li className="nav__item" key={index}>
                                        <NavLink
                                            to={item.path}
                                            className={(navClass) =>
                                                navClass.isActive
                                                    ? 'nav__active'
                                                    : ''
                                            }
                                        >
                                            {item.display}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="nav__icons">
                            <span className="fav__icon">
                                <i class="ri-heart-line"></i>
                                <span className="badge">1</span>
                            </span>
                            <span
                                className="cart__icon"
                                onClick={navigationToCart}
                            >
                                <i class="ri-shopping-bag-line"></i>
                                <span className="badge">{totalQuantity}</span>
                            </span>
                            <div className="user__login profile">
                                <motion.img
                                    whileTap={{ scale: 1.2 }}
                                    src={
                                        currentUser
                                            ? currentUser.photoURL
                                            : userIcon
                                    }
                                    alt="user_icon"
                                    onClick={toggleProfileActions}
                                />
                                <div
                                    className="profile__actions"
                                    ref={profileActionRef}
                                    onClick={toggleProfileActions}
                                >
                                    {currentUser ? (
                                        <span onClick={logout}>Logout</span>
                                    ) : (
                                        <div className="d-flex flex-column align-items-center justify-content-center">
                                            <Link to="/signup">Signup</Link>
                                            <Link to="/login">Login</Link>
                                            <Link to="/dashboard">
                                                Dashboard
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                {/* <p>{currentUser.displayName}</p> */}
                                {/* <div className="login">
                                    <Link to="/login">Login</Link>
                                </div> */}
                            </div>
                            <div className="mobile__menu">
                                <span onClick={menuToggle}>
                                    <i class="ri-menu-line"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </Row>
            </Container>
        </header>
    );
};

export default Header;
