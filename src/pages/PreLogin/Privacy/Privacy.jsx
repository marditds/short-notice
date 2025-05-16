import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PrivacyList from '../../../components/Legal/PrivacyList';

const PrivacyPolicy = () => {

    return (
        <Container>
            <Row className='privacyPolicy__row my-3 my-sm-5'>
                <Col className='privacyPolicy__col px-3 px-sm-0'>
                    <PrivacyList />
                </Col>
            </Row>
        </Container>
    )
}

export default PrivacyPolicy;