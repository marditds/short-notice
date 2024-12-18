import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import snLogo from '../../../../assets/sn_long.png';
import './NavigationBar.css';

const NavigationBar = ({ children }) => {

    return (

        <Navbar expand='lg' className='px-4 navigationbar' sticky='top'>
            <Navbar.Brand href="/">
                <img src={snLogo} alt='short_notice_logo' height={23} className='navigation__logo' />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav abcd'
                style={{ marginRight: '146px' }}
            >
                <Nav className='ms-auto me-auto'>

                    <Nav.Link as={Link} to='/' className='me-lg-4'>Home</Nav.Link>
                    {children}
                    <Nav.Link as={Link} to='/sn-plus' className='ms-lg-4'>SN Plus</Nav.Link>
                    <Nav.Link as={Link} to='/contact' className='ms-lg-4'>Contact</Nav.Link>

                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavigationBar