import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { reportCategories, commGuideParags } from '../../../components/PreLogin/ComunityGuidelines/communityGuidelines';

const CommunityGuidelines = () => {
    return (
        <Container>
            <Row className='flex-column my-3 my-sm-5'>
                <Col>
                    <h4 className='px-3'>
                        Community Guidelines
                    </h4>
                    <p className='mb-1 px-3'>
                        ShortNotice is committed to fostering a respectful and safe environment. Users must adhere to the following guidelines when posting content or interacting with others on the platform.
                    </p>
                    <p className='mb-1 px-3'>
                        Users may report content or accounts under the following categories:
                    </p>

                    <ListGroup as={'ol'} className='commGuide__list-group'>
                        {
                            reportCategories.map((category, idx) => {
                                return (
                                    <ListGroup.Item key={idx} as={'li'} className='commGuide__list-group-item'>
                                        {idx + 1}. {category.name}
                                    </ListGroup.Item>
                                )
                            })
                        }
                    </ListGroup>

                    <p className='mb-1 px-3'>
                        Violations of these guidelines may result in content removal or account suspension at ShortNotice's discretion. Users are encouraged to review these guidelines regularly to remain informed about acceptable behavior on the platform.
                    </p>
                </Col>
            </Row>
        </Container>
    )
}

export default CommunityGuidelines;