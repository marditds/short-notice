import React from 'react';
import { screenUtils } from '../../lib/utils/screenUtils';
import { LoadingSpinner } from './LoadingSpinner';
import { Col, Container, Image, Row } from 'react-bootstrap';
import sn_logo from '../../assets/sn_long.png';

export const LoadingComponent = () => {

    const { isSmallScreen } = screenUtils();

    return (
        <Container className='min-vh-100 d-flex justify-content-center align-items-center'>
            <Row>
                <Col className='d-flex align-items-baseline'>
                    <LoadingSpinner classAnun={'me-2'} /> Loading  <Image
                        src={sn_logo}
                        height={!isSmallScreen ? '20px' : '10px'}
                        alt='logo'
                        className='ms-2'
                    />...
                </Col>
            </Row>
        </Container>
    )
} 