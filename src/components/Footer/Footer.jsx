import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { footerData } from './footerData.js';
import './Footer.css';


// About | Contact | Privacy Policy | Terms of Service | Help Center  
// Follow Us: [Facebook][Twitter][Instagram]  
// Download our app: [App Store Icon][Google Play Icon]  
// © 2024 SocialMediaApp.All rights reserved.  



// --------------------------------------------------
// | Home | About | Contact | Privacy | Terms | Help |
//     --------------------------------------------------
//         Follow Us: [FB][IG][X][YT]
//         © 2024 SocialApp.All rights reserved.
// --------------------------------------------------


const Footer = () => {
    return (
        <Container fluid className='footer__container mt-auto'>
            <Container>
                <Row md={12} className='pt-4 pb-2'>
                    {footerData.navigationLinks.map((nav, index) => {
                        return (
                            <Col key={index} className='footer__col d-flex justify-content-evenly'>
                                <h6 className='mb-0'>{nav.name}</h6>
                            </Col>
                        )
                    }
                    )
                    }
                </Row>
                <Row className='justify-content-center py-2'>
                    {footerData.socialLinks.map((social, index) => {
                        return (
                            <Col xs={1} key={index}
                                className='footer__col d-flex justify-content-center'>
                                <h6 className='mb-0'>{social.name}</h6>
                            </Col>
                        )
                    })}
                </Row>
                <Row md={12} className='justify-content-center pt-2 pb-4'>
                    <Col className='footer__col d-flex justify-content-center'>
                        {footerData.copyright}
                    </Col>

                </Row>
            </Container>
        </Container>
    )
}

export default Footer