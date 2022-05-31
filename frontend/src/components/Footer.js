import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer style={{'backgroundColor': '#1e1b1b', 'color': 'white'}}>
            <Row>
                <Col className='text-center py-3'>&copy;Coffee4you | 2022</Col>
            </Row>

        </footer>
    )
}

export default Footer
