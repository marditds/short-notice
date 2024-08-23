import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { footerData } from './footerData.js';
import './Footer.css';


const Footer = () => {
    return (
        <Container fluid className='footer__container mt-auto'>
            <Container>
                <Row md={3} sm={2} xs={1} className='justify-content-lg-evenly align-items-start py-4'>
                    {footerData.map((item, index) => {
                        return (
                            <Col key={index} className='footer__col d-grid gap-2'>
                                <h5>{item.title}</h5>

                                {item.items.map((text, idx) => {

                                    if (idx % 2 === 0) {

                                        return (
                                            <a key={idx}>{text}</a>
                                        );

                                    } return null;

                                })}

                            </Col>
                        )
                    }
                    )
                    }

                    {/* <Col className='footer__col d-grid gap-2 mt-md-0 mt-2'>
                        <h5>Product</h5>
                        <a>ShortNotice</a>
                        <a>SN+</a>
                    </Col>
                    <Col className='footer__col d-grid gap-2 mt-md-0 mt-2'>
                        <h5>Legal</h5>
                        <a>Terms of use</a>
                        <a>Privacy Policy</a>
                    </Col>
                    <Col className='footer__col d-grid gap-2 mt-md-0 mt-2'>
                        <h5>Socials</h5>
                        <a>Facebook</a>
                        <a>Twitter</a>
                    </Col> */}
                </Row>
            </Container>
        </Container>
    )
}

export default Footer