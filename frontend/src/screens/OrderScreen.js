import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'

const OrderScreen = ({ match, history }) => {

    const orderId = match.params.id;

    const [ sdkReady, setSdkReady ] = useState(false);

    const dispatch = useDispatch()

        
    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, loading, error } = orderDetails;

    const orderPay = useSelector((state) => state.orderPay);
    const { loading: loadingPay, success: successPay } = orderPay;

    const orderDeliver = useSelector((state) => state.orderDeliver);
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin;


    if(!loading) {
        // To add .00 at the End of Each Price
    const addDecimal = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }

    // Calculated Price
    order.itemsPrice = addDecimal(order.orderItems.reduce((acc, item) => 
        acc + item.price * item.qty
    , 0))
    }

    useEffect(() => {

        if(!userInfo) {
            history.push('login')
        }

        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal');

            // Dynamically Adding the PayPal SDK Script
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = () => {
                setSdkReady(true);
            }
            document.body.appendChild(script);
        }

        if(!order || successPay || successDeliver) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })
            dispatch(getOrderDetails(orderId))
        } else if (!order.isPaid) {
            if(!window.paypal) {
                addPayPalScript();
            } else {
                setSdkReady(true);
            }
        } 
    }, [dispatch, orderId, order, successPay, successDeliver, userInfo, history])

    const successPaymentHandler = (paymentResult) => {
        console.log(paymentResult);
        dispatch(payOrder(orderId, paymentResult));
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }


    return loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : 
    <>
        <h1>Номер заказа: {order._id}</h1>
        <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Доставка</h2>
                            <p>
                                <strong>Пользователь:</strong> {order.user.name}
                            </p>
                            <p>
                                <strong>Email: </strong>
                                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                            </p>
                            <p>
                                <strong>Адрес: </strong>
                                { order.shippingAddress.address }, { order.shippingAddress.city }, 
                                { order.shippingAddress.postalCode }, { order.shippingAddress.country },                           
                            </p>

                            { order.isDelivered ? <Message variant='success'>Delivered On: {order.deliveredAt}</Message> :
                                <Message variant='danger'>Не доставлен</Message>
                            }
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Способ оплаты</h2>
                            <p>
                                <strong>Метод оплаты: </strong>
                                { order.paymentMethod }
                            </p>

                            { order.isPaid ? <Message variant='success'>Оплачено {order.paidAt}</Message> :
                                <Message variant='danger'>Не оплачено</Message>
                            }
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Заказанные товары</h2>
                                { order.orderItems.length === 0 ? <Message>Корзина пуста</Message> : (
                                    <ListGroup variant='flush'>
                                        { order.orderItems.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image src={item.image} alt={item.name} fluid rounded></Image>
                                                    </Col>

                                                    <Col>
                                                        <Link to={`/product/${item.product}`}>
                                                            {item.name}
                                                        </Link>
                                                    </Col>

                                                    <Col md={4}>
                                                        {item.qty} x {item.price} = {item.qty * item.price} рублей
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        )) }
                                    </ListGroup>
                                ) }
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Итоговая сумма</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Товар</Col>
                                    <Col>{order.itemsPrice} руб. </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Доставка</Col>
                                    <Col>{order.shippingPrice} руб. </Col>
                                </Row>
                            </ListGroup.Item>

                            {/*<ListGroup.Item>*/}
                            {/*    <Row>*/}
                            {/*        <Col>Налог</Col>*/}
                            {/*        <Col>${order.taxPrice}</Col>*/}
                            {/*    </Row>*/}
                            {/*</ListGroup.Item>*/}

                            <ListGroup.Item>
                                <Row>
                                    <Col>Итого</Col>
                                    <Col>{order.itemsPrice} руб.</Col>
                                </Row>
                            </ListGroup.Item>

                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}
                                    {!sdkReady ? <Loader /> : (
                                        <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler} />
                                    )}
                                </ListGroup.Item>
                            )}

                            { loadingDeliver && <Loader /> }
                            { userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                <ListGroup.Item>
                                    <Button type='button' className='btn btn-block' onClick={deliverHandler}>
                                        Mark as Delivered
                                    </Button>
                                </ListGroup.Item>
                            ) }
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
            
    </>
}

export default OrderScreen
