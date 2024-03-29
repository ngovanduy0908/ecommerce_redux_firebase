import { motion } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import Helmet from '../components/Helmet/Helmet';
import CommonSection from '../components/UI/CommonSection';
import ProductsList from '../components/UI/ProductsList';
import '../styles/product-details.css';
import { useDispatch } from 'react-redux';
import { cartActions } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';

import { db } from '../firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import useGetData from '../custom-hooks/useGetData';

const ProductDetail = () => {
    const [product, setProduct] = useState({});
    const { id } = useParams();

    const { data: products } = useGetData('products');

    const docRef = doc(db, 'products', id);

    useEffect(() => {
        const getProduct = async () => {
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setProduct(docSnap.data());
            } else {
                console.log('no product');
            }
        };
        getProduct();
    }, []);

    const dispatch = useDispatch();
    const [tab, setTab] = useState('desc');
    const reviewUser = useRef('');
    const reviewMsg = useRef('');

    const [rating, setRating] = useState(null);
    // const product = products.find((item) => item.id === id);

    const { imgUrl, productName, price, shortDesc, description, category } =
        product;

    const relatedProducts = products.filter(
        (item) => item.category === category,
    );

    const submitHandler = (e) => {
        e.preventDefault();
        const reviewUserName = reviewUser.current.value;
        const reviewUserMsg = reviewMsg.current.value;

        const reviewObj = {
            userName: reviewUserName,
            text: reviewUserMsg,
            rating: rating,
        };

        console.log(reviewObj);
        toast.success('Review successfully');
        setRating(null);
        reviewUser.current.value = '';
        reviewMsg.current.value = '';
    };

    const addToCart = () => {
        dispatch(
            cartActions.addItem({
                id,
                image: imgUrl,
                productName,
                price,
            }),
        );
        toast.success('Product add to cart');
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [product]);

    return (
        <Helmet title={productName}>
            <CommonSection title={productName} />

            <section className="pt-0">
                <Container>
                    <Row>
                        <Col lg="6">
                            <img src={imgUrl} alt="" />
                        </Col>
                        <Col lg="6">
                            <div className="product__details">
                                <h2>{productName}</h2>
                                <div className="product__rating d-flex align-items-center gap-5 mb-3">
                                    <div>
                                        <span>
                                            <i class="ri-star-fill"></i>
                                        </span>
                                        <span>
                                            <i class="ri-star-fill"></i>
                                        </span>
                                        <span>
                                            <i class="ri-star-fill"></i>
                                        </span>
                                        <span>
                                            <i class="ri-star-fill"></i>
                                        </span>

                                        <span>
                                            <i class="ri-star-half-line"></i>
                                        </span>
                                    </div>
                                    <p>
                                        {/* ( <span>{avgRating}</span> ratings) */}
                                    </p>
                                </div>
                                <div className="d-flex align-items-center gap-5">
                                    <span className="product__price">
                                        ${price}
                                    </span>
                                    <span>Category: {category}</span>
                                </div>
                                <p className="mt-3">{shortDesc}</p>

                                <motion.button
                                    whileTap={{ scale: 1.2 }}
                                    className="buy__btn"
                                    onClick={addToCart}
                                >
                                    Add to Cart
                                </motion.button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section>
                <Container>
                    <Row>
                        <Col lg="12">
                            <div className="tab__wrapper d-flex align-items-center gap-5">
                                <h6
                                    className={`${
                                        tab === 'desc' ? 'active__tab' : ''
                                    }`}
                                    onClick={() => setTab('desc')}
                                >
                                    Description
                                </h6>
                                {/* <h6
                                    className={`${
                                        tab === 'rev' ? 'active__tab' : ''
                                    }`}
                                    onClick={() => setTab('rev')}
                                >
                                    Reviews ({reviews.length})
                                </h6> */}
                            </div>
                            {tab === 'desc' ? (
                                <div className="tab__content mt-5">
                                    <p>{description}</p>
                                </div>
                            ) : (
                                <div className="product__review mt-5">
                                    <div className="review__wrapper">
                                        {/* <ul>
                                            {reviews.map((item, index) => {
                                                return (
                                                    <li
                                                        key={index}
                                                        className="mb-4"
                                                    >
                                                        <h6>Jhon Doe</h6>
                                                        <span>
                                                            {item.rating} (
                                                            rating)
                                                        </span>
                                                        <p>{item.text}</p>
                                                    </li>
                                                );
                                            })}
                                        </ul> */}

                                        <div className="review__form">
                                            <h4>Leave your experience</h4>
                                            <form
                                                action=""
                                                onSubmit={submitHandler}
                                            >
                                                <div className="form__group">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter name"
                                                        ref={reviewUser}
                                                        required
                                                    />
                                                </div>
                                                <div className="form__group d-flex align-items-center gap-5 rating__group">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (item) => (
                                                            <motion.span
                                                                whileTap={{
                                                                    scale: 1.2,
                                                                }}
                                                                onClick={() =>
                                                                    setRating(
                                                                        item,
                                                                    )
                                                                }
                                                                className={`${
                                                                    rating ===
                                                                    item
                                                                        ? 'star__active'
                                                                        : ''
                                                                }`}
                                                            >
                                                                {item}
                                                                <i class="ri-star-fill"></i>
                                                            </motion.span>
                                                        ),
                                                    )}
                                                    {/* <span
                                                        onClick={() =>
                                                            setRating(1)
                                                        }
                                                    >
                                                        1
                                                        <i class="ri-star-fill"></i>
                                                    </span>
                                                    <span
                                                        onClick={() =>
                                                            setRating(2)
                                                        }
                                                    >
                                                        2
                                                        <i class="ri-star-fill"></i>
                                                    </span>
                                                    <span
                                                        onClick={() =>
                                                            setRating(3)
                                                        }
                                                    >
                                                        3
                                                        <i class="ri-star-fill"></i>
                                                    </span>
                                                    <span
                                                        onClick={() =>
                                                            setRating(4)
                                                        }
                                                    >
                                                        4
                                                        <i class="ri-star-fill"></i>
                                                    </span>
                                                    <span
                                                        onClick={() =>
                                                            setRating(5)
                                                        }
                                                    >
                                                        5
                                                        <i class="ri-star-fill"></i>
                                                    </span> */}
                                                </div>
                                                <div className="form__group">
                                                    <textarea
                                                        rows={4}
                                                        type="text"
                                                        placeholder="Review message ..."
                                                        ref={reviewMsg}
                                                        required
                                                    />
                                                </div>
                                                <motion.button
                                                    type="submit"
                                                    className="buy__btn"
                                                    whileTap={{ scale: 1.2 }}
                                                >
                                                    Submit
                                                </motion.button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Col>
                        <Col lg="12" className="mt-5">
                            <h2 className="related__title">
                                You might also like
                            </h2>
                        </Col>
                        <ProductsList data={relatedProducts} />
                    </Row>
                </Container>
            </section>
        </Helmet>
    );
};

export default ProductDetail;
