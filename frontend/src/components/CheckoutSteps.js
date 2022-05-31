import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const CheckoutSteps = ({step2, step3, step4 }) => {
    return (
        <Nav className='justify-content-center mb-4'>
            <Nav.Item>
                { step2 ? (
                    <LinkContainer to='/shipping'>
                        <Nav.Link>Доставка</Nav.Link>
                    </LinkContainer>
                ) : 
                <Nav.Link disabled>Доставка</Nav.Link>
                }
            </Nav.Item>

            <Nav.Item>
                { step3 ? (
                    <LinkContainer to='/payment'>
                        <Nav.Link>Оплата</Nav.Link>
                    </LinkContainer>
                ) : 
                <Nav.Link disabled>Оплата</Nav.Link>
                }
            </Nav.Item>

            <Nav.Item>
                { step4 ? (
                    <LinkContainer to='/placeorder'>
                        <Nav.Link>Оформить заказ</Nav.Link>
                    </LinkContainer>
                ) : 
                <Nav.Link disabled>Оформить заказ</Nav.Link>
                }
            </Nav.Item>
        </Nav>
    )
}

export default CheckoutSteps
