import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Form, FormGroup, Row } from 'reactstrap';
import Helmet from '../components/Helmet/Helmet';
import { auth } from '../firebase.config';
import { storage } from '../firebase.config';
import { db } from '../firebase.config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

import '../styles/login.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');

    const [password, setPassword] = useState('');

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const signup = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );
            const user = userCredential.user;
            const storageRef = ref(storage, `images/${Date.now() + userName}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            // Pause the upload
            uploadTask.on(
                (error) => {
                    toast.error(error.message);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        async (downloadURL) => {
                            // update user profile
                            await updateProfile(user, {
                                displayName: userName,
                                photoURL: downloadURL,
                            });

                            // store user data in firestore database
                            await setDoc(doc(db, 'users', user.uid), {
                                uid: user.uid,
                                displayName: userName,
                                email,
                                photoURL: downloadURL,
                            });
                        },
                    );
                },
            );

            // console.log(user);
            setLoading(false);
            toast.success('Account created');
            navigate('/login');
        } catch (error) {
            // const errorCode = error.code;
            // const errorMessage = error.message;
            // console.log(errorMessage);
            setLoading(false);
            toast.error('Something went wrong');
            console.log(error);
        }
    };

    return (
        <Helmet title="Signup">
            <section>
                <Container>
                    <Row>
                        {loading ? (
                            <Col lg="12" className="text-center">
                                <h6 className="fw-bold">Loading...</h6>
                            </Col>
                        ) : (
                            <Col lg="6" className="m-auto text-center">
                                <h3 className="fw-bold mb-4">Signup</h3>

                                <Form className="auth__form" onSubmit={signup}>
                                    <FormGroup className="form__group">
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            value={userName}
                                            onChange={(e) =>
                                                setUserName(e.target.value)
                                            }
                                        />
                                    </FormGroup>
                                    <FormGroup className="form__group">
                                        <input
                                            type="email"
                                            placeholder="enter your email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                    </FormGroup>
                                    <FormGroup className="form__group">
                                        <input
                                            type="password"
                                            placeholder="enter your password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                        />
                                    </FormGroup>
                                    <FormGroup className="form__group">
                                        <input
                                            type="file"
                                            onChange={(e) =>
                                                setFile(e.target.files[0])
                                            }
                                        />
                                    </FormGroup>
                                    <button
                                        type="submit"
                                        className="buy__btn auth__btn"
                                    >
                                        Create an Account
                                    </button>
                                    <p>
                                        Already have an account?{' '}
                                        <Link to="/login">Login</Link>
                                    </p>
                                </Form>
                            </Col>
                        )}
                    </Row>
                </Container>
            </section>
        </Helmet>
    );
};

export default Signup;
