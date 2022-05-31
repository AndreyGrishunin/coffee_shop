import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form } from 'react-bootstrap';
import Rating from '../components/Rating';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
// import products from '../products';
// import axios from 'axios';
import { listProductDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

const ProductScreen = ({ history, match }) => {

    // const [product, setProduct] = useState({});

    
    const [ qty, setQty ] = useState(1);
    const [ rating, setRating ] = useState(0);
    const [ comment, setComment ] = useState('');

    const dispatch = useDispatch();

    const productDetails = useSelector(state => state.productDetails);
    const { loading, error, product } = productDetails;

    const productReviewCreate = useSelector(state => state.productReviewCreate);
    const { success: successProductReview, error: errorProductReview } = productReviewCreate;

    const userLogin = useSelector(state => state.userLogin);
    const {  userInfo } = userLogin;

    useEffect(() => {
        if(successProductReview) {
            alert('Review Submitted')
            setRating(0)
            setComment('')
            dispatch({
                type: PRODUCT_CREATE_REVIEW_RESET
            })
        }

        dispatch(listProductDetails(match.params.id));
        
    }, [dispatch, match, successProductReview]);


    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }


    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(createProductReview(match.params.id, {
            rating, comment
        }))
    }
    

    return (
        <>
            <Link className='btn btn-light my-3' to='/'>Назад</Link>
            { loading ? (<Loader />) : error ? (<Message variant='danger'>{error}</Message>) : ( 
            
            <>
                <Meta title={product.name}  />

                <Row>
                <Col md={6}>
                    <Image src={product.image} alt={product.name} fluid></Image>
                </Col>

                <Col md={3}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h3>{product.name}</h3>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                        </ListGroup.Item>

                        <ListGroup.Item>
                            Цена: {product.price} рублей
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Описание: {product.description}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={3}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Цена:
                                    </Col>
                                    <Col>
                                        <strong>{product.price} рублей</strong>
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Наличие:
                                    </Col>
                                    <Col>
                                        {product.countInStock > 0 ? 'В наличии' : 'Закончился'}
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            { product.countInStock > 0 && (
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Количество</Col>
                                        <Col>
                                            <Form.Control as='select' value={qty} onChange={(e) => setQty(e.target.value)}>

                                                {
                                                    [...Array(product.countInStock).keys()].map((x) => (
                                                        <option key={x+1} value={x+1}>
                                                            {x+1}
                                                        </option>
                                                    ))
                                                }

                                            </Form.Control>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ) }

                            <ListGroup.Item>
                                <Button onClick={addToCartHandler} className='btn-block' type='button' disabled={product.countInStock === 0}>
                                    Добавить в корзину
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                    </Col>
                </Row>


                <Row>
                    <Col md={6}>
                        <h2>Рейтинг</h2>
                        { product.reviews.length === 0 && <Message>Рейтинг отсутствует</Message>  }
                        <ListGroup variant='flush'>
                            { product.reviews.map(review => (
                                <ListGroup.Item key={review._id}>
                                    <strong>{review.name}</strong>
                                    <Rating value={review.rating} />
                                    <p>{review.createdAt.substring(0, 10)}</p>
                                    <p>{review.comment}</p>
                                </ListGroup.Item>
                            )) }

                            <ListGroup.Item>
                                <h2>Добавить отзыв</h2>
                                { errorProductReview && <Message variant='danger'>{errorProductReview}</Message> }
                                { userInfo ? (
                                <Form onSubmit={submitHandler}>
                                    <Form.Group controlId='rating'>
                                        <Form.Label>Оценка</Form.Label>
                                        <Form.Control as='select' value={rating} 
                                        onChange={(e) => setRating(e.target.value)}>
                                            <option value=''>Выберите оценку</option>
                                            <option value='5'>Отлично </option>
                                            <option value='4'>Хорошо</option>
                                            <option value='3'>Удовлетворительно</option>
                                            <option value='2'>Плохо</option>
                                            <option value='1'>Ужасно</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId='comment'>
                                        <Form.Label>Комментарий</Form.Label>
                                        <Form.Control as='textarea' row='3' value={comment} 
                                        onChange={(e) => setComment(e.target.value)}>
                                        </Form.Control>
                                    </Form.Group>

                                    <Button type='submit' variant='primary'>Добавить отзыв</Button>
                                </Form>) : 
                                (<Message>Пожалуйста, <Link to='/login'>войдите</Link> в систему, чтобы добавить отзыв</Message>
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>

            </>
            
            )}
            
        </>
    )
}

export default ProductScreen
