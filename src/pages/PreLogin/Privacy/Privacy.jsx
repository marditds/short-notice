import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { PrivacyData } from '../../../components/PreLogin/Privacy/privacyData';

const PrivacyPolicy = () => {

    const { privacyPolicyData } = PrivacyData();

    return (
        <Container className='privacyPolicy__container'>
            <Row className='privacyPolicy__row my-3 my-sm-5'>
                <Col className='privacyPolicy__col'>
                    <h4 className='mb-0'>Privacy Policy</h4>
                    <ListGroup as={'ul'} className='privacyPolicy__list-group'>
                        {
                            privacyPolicyData.map((privacyPolicy, idx) => {
                                return (
                                    <ListGroup.Item as={'li'} key={idx} className='privacyPolicy__list-group-item px-0 my-1'>
                                        <h5 className='mb-1'>{privacyPolicy.title}</h5>
                                        {privacyPolicy.description}
                                    </ListGroup.Item>
                                )
                            })
                        }
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    )
}

export default PrivacyPolicy;