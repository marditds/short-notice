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
            <div className='help-center__welcome-msg mb-5'>
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
            </div>
            <Row className=''>
                {
                    helpCenterHeaders.map((header, idx) => {
                        return (
                            <Col key={idx} className='help-center__header-col'>
                                <Link to={`../help-center/${header.url}`} className='h-100 help-center__header-a'>
                                    <div className='help-center__header-inner-div px-3 py-3 text-center'>
                                        <h4 className='help-center__header-title mb-3'>
                                            {header.title}
                                        </h4>

                                        <p className='mb-0'>{header.description}</p>
                                    </div>
                                </Link>
                            </Col>

                        )
                    })
                }
            </Row>
            {/* <Outlet /> */}
        </Container>
    )
}

export default HelpCenter