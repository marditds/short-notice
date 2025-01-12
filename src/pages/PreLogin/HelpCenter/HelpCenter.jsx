import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

const HelpCenter = () => {

    const helpCenterHeaders = [
        {
            title: 'Getting Started',
            description: 'iiiiiiiii',
            url: 'getting-started'
        },
        {
            title: 'Manage Account',
            description: 'jjjjjjjjjjj',
            url: 'manage-account'
        }
    ]

    return (
        <Container>
            <div className='d-flex justify-content-evenly'>
                {
                    helpCenterHeaders.map((header, idx) => {
                        return (
                            <Row key={idx} className='flex-column'>
                                <Link to={`../help-center/${header.url}`}>
                                    <Col>
                                        {header.title}
                                    </Col>
                                </Link>

                                <Col>
                                    {header.description}
                                </Col>
                            </Row>
                        )
                    })
                }
            </div>
            {/* <Outlet /> */}
        </Container>
    )
}

export default HelpCenter