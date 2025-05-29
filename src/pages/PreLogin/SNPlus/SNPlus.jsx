import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import sn_large from '../../../assets/sn_large.png';

const SNPlus = () => {
    return (
        <div className='snplus__body'>
            <main className='flex-grow-1' aria-labelledby="under-dev-heading">
                <Container className='snplus__body-container mt-5 mt-lg-0'>
                    <Row>
                        <Col className='d-flex justify-content-center'>
                            <Image src={sn_large} alt="Short Notice Plus logo" role="img" fluid />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h2 id="under-dev-heading" className='text-center mt-5'>
                                Under Development
                                <br className='d-inline d-sm-none' />
                                {' '}👷‍♂️🏗🚧
                            </h2>
                        </Col>
                    </Row>
                </Container>
            </main>
        </div>
    )
}

export default SNPlus