import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { reportCategories } from '../../../components/PreLogin/ComunityGuidelines/communityGuidelines';

const CommunityGuidelines = () => {
    return (
        <Container>
            <Row className='flex-column'>
                <Col>
                    <h4>
                        Community Guidelines
                    </h4>
                    <p>
                        ShortNotice is committed to fostering a respectful and safe environment. Users must adhere to the following guidelines when posting content or interacting with others on the platform.
                    </p>
                    <p>
                        Users may report content or accounts under the following categories:
                    </p>
                </Col>
                <Col>
                    <ListGroup as={'ol'}>
                        {
                            reportCategories.map((category, idx) => {
                                return (
                                    <ListGroup.Item key={idx} as={'li'}>
                                        {idx + 1}. {category.name}
                                    </ListGroup.Item>
                                )
                            })
                        }
                    </ListGroup>
                </Col>
                <Col>
                    <p>
                        Violations of these guidelines may result in content removal or account suspension at ShortNotice's discretion. Users are encouraged to review these guidelines regularly to remain informed about acceptable behavior on the platform.
                    </p>
                </Col>
            </Row>
        </Container>
    )
}

export default CommunityGuidelines;