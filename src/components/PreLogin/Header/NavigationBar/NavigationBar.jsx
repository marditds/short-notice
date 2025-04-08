import React from 'react';
import { Link } from 'react-router-dom';
import { screenUtils } from '../../../../lib/utils/screenUtils';
import { Nav, Navbar, Image } from 'react-bootstrap';
import snLogo from '../../../../assets/sn_long.png';
import './NavigationBar.css';

const NavigationBar = ({ children }) => {

    const { isSmallScreen, isMediumScreen } = screenUtils();

    return (

        <Navbar expand='md' className=' px-sm-4 navigationbar' sticky='top'>
            <Navbar.Brand href="/">
                <Image src={snLogo} alt='short_notice_logo' height={!isSmallScreen ? '23px' : '20px'} className='navigation__logo' />
            </Navbar.Brand>
            <Navbar.Toggle className='navigation__toggle-btn' aria-controls='basic-navbar-nav'>
                <i className='bi bi-three-dots-vertical navigation__burger-menu' />
            </Navbar.Toggle>
            <Navbar.Collapse id='basic-navbar-nav abcd'
                style={{ marginRight: isMediumScreen ? '0px' : '165.5px' }}
            >
                <Nav className='ms-auto me-lg-auto'>

                    <Nav.Link as={Link} to='/' className='me-lg-4 navigation__nav-link'>Home</Nav.Link>
                    <Nav.Item className='d-flex navigation__nav-link'>{children}</Nav.Item>
                    <Nav.Link as={Link} to='/sn-plus' className='ms-lg-4 navigation__nav-link'>SN Plus</Nav.Link>
                    <Nav.Link as={Link} to='/contact' className='ms-lg-4 navigation__nav-link'>Contact</Nav.Link>

                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavigationBar