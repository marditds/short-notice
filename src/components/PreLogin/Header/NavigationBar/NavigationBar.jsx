import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import snLogo from '../../../../assets/sn_long.png';
import './NavigationBar.css';

const NavigationBar = ({ children }) => {

    return (

        <Navbar expand="lg" className="px-4 navigationbar">
            <Navbar.Brand href="/">
                <img src={snLogo} alt="short_notice_logo" height={23} className='navigation__logo' />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                    {/* <LoginForm
                        jwtDecode={jwtDecode}
                        googleUserData={googleUserData}
                        setGoogleUserData={setGoogleUserData}
                        isLoggedIn={isLoggedIn}
                        setIsLoggedIn={setIsLoggedIn}
                    /> */}
                    {/* <NavDropdown title="Join" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">
                           
                        </NavDropdown.Item>

                        {isLoggedIn === false ?
                            <NavDropdown.Item href="#action/3.2">
                                w/ Facebook
                            </NavDropdown.Item>
                            :
                            null
                        }

                        {isLoggedIn === false ?
                            <NavDropdown.Item href="#action/3.2">
                                w/ X
                            </NavDropdown.Item>
                            :
                            null
                        }

                    </NavDropdown> */}

                    <Nav.Link href="#link">Mission</Nav.Link>
                    <Nav.Link href="#link">SN+</Nav.Link>
                    {children}

                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavigationBar