import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import sn_large from '../../assets/sn_large.png';

const SNPlus = () => {
    return (
        <div className='snplus__body'>
            <main className='flex-grow-1'>
                <Container className='snplus__body-container'>
                    <Row>
                        <Col className='d-flex justify-content-center'>
                            <Image src={sn_large} alt='short_notice_plus_logo' fluid />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h2 className='text-center mt-5'>
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