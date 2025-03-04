import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { footerData } from './FooterData.jsx';
import { screenUtils } from '../../../lib/utils/screenUtils.js';
import snLogo from '../../../assets/sn_long.png';
import './Footer.css';

const Footer = () => {

    const { isMediumScreen } = screenUtils();

    const copyrightText = footerData.copyright.split('newLine');

    const copyrightTextBreak = isMediumScreen && footerData.copyright.replace('newLine', '');

    return (
        <Container fluid className='footer__container'>
            <Container>
                <Row xs={1} lg={3} xl={6} className='flex-columns mt-5'>

                    {/* LOGO */}
                    <Col className='d-flex flex-column footer__col mb-3 mb-lg-0'>
                        <Link to='/'>
                            <Image src={snLogo} alt='shortnotice_logo' height='26px'
                                // width={!isSmallScreen ? 'auto' : '149.5px'} 
                                className='mb-2 footer__logo' fluid />
                        </Link>
                        {
                            !isMediumScreen ?
                                <div>
                                    {
                                        copyrightText.map((text, idx) => {
                                            return (
                                                <p key={idx} className='mb-0'>{text}</p>
                                            )
                                        })
                                    }
                                </div>
                                :
                                <>
                                    {copyrightTextBreak}
                                </>
                        }

                    </Col>

                    {/* COMPANY */}
                    <Col className='footer__col'>
                        <h4>Company</h4>
                        {
                            footerData.company.map((companyData, idx) => {
                                return (
                                    <Link key={idx} to={companyData.url}>

                                        <h6>{companyData.name}</h6>
                                    </Link>

                                )
                            })
                        }
                    </Col>

                    {/* EXPLORE */}
                    <Col className='footer__col'>
                        <h4>Explore</h4>
                        {
                            footerData.explore.map((exploreData, idx) => {
                                return (
                                    <Link key={idx} to={exploreData.url}>
                                        <h6>{exploreData.name}</h6>
                                    </Link>
                                )
                            })
                        }
                    </Col>

                    {/* LEGAL */}
                    <Col className='footer__col'>
                        <h4>Legal</h4>
                        {
                            footerData.legal.map((legalData, idx) => {
                                return (
                                    <Link key={idx} to={legalData.url}>
                                        <h6>{legalData.name}</h6>
                                    </Link>
                                )
                            })
                        }
                    </Col>


                    {/* SUPPORT */}
                    <Col className='footer__col'>
                        <h4>Support</h4>
                        {
                            footerData.support.map((supportData, idx) => {
                                return (
                                    <Link key={idx} to={supportData.url}>
                                        <h6>{supportData.name}</h6>
                                    </Link>
                                )
                            })
                        }
                    </Col>

                    {/* SOCIALS */}
                    <Col className='footer__col'>
                        <h4>Socials</h4>
                        {
                            footerData.followUs.map((followUsData, idx) => {
                                return (
                                    <Link key={idx} to={followUsData.url} target='_blank'>
                                        <h6>{followUsData.name}</h6>
                                    </Link>
                                )
                            })
                        }
                    </Col>
                </Row>



                {/* COPYRIGHT */}
                <Row md={12} className='flex-column justify-content-center mt-3 mb-4'>
                    {/* <Col className='footer__col d-flex justify-content-center'>
                        {footerData.copyright}
                    </Col> */}
                    <Col className='footer__col d-flex justify-content-center'>
                        {footerData.developer}
                    </Col>
                </Row>

            </Container>
        </Container>
    )
}

export default Footer