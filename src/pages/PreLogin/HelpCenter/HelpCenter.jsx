import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import sn_small from '../../../assets/sn_long.png';

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
            <h2 className='help-center__h2 mb-0'>
                Hello,
            </h2>

            <h3 className='help-center__h3'>
                You have arrived to
                <Image src={sn_small} width={218} className='ms-2' fluid />
                's help center.
            </h3>

            <h3 className='help-center__h3'>
                Here you will find the answers to your questions.
            </h3>

            <div className='d-flex justify-content-evenly'>
                {
                    helpCenterHeaders.map((header, idx) => {
                        return (
                            <Link to={`../help-center/${header.url}`} key={idx}>
                                <Row className='flex-column help__header-row px-2 py-2'>
                                    <Col className='help__header-col'>
                                        {header.title}
                                    </Col>

                                    <Col className='help__header-col text-center'>
                                        {header.description}
                                    </Col>
                                </Row>
                            </Link>
                        )
                    })
                }
            </div>
            {/* <Outlet /> */}
        </Container>
    )
}

export default HelpCenter