import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { tosData } from './tosData';

const TOS = () => {
    return (
        <Container className={'tos__contianer'}>
            <Row className={'tos__row my-3 my-md-5'}>
                <Col className={'tos__col'}>
                    <h4 className='px-3 mb-1'>Terms of Service</h4>
                    <ListGroup as={'ol'} className={'tos__list-group'}>
                        {
                            tosData.map((term, idx) => {
                                return (
                                    <ListGroup.Item key={idx} as={'li'} className={'tos__list-group-item'}>
                                        <h5 className='mb-1'>{idx + 1}. {term.title}</h5>
                                        <p>{term.description}</p>
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

export default TOS