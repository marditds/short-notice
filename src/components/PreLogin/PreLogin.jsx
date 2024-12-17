import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import { GoogleLoginForm } from '../LoginForm/Google/GoogleLoginForm';
import Home from '../../pages/Home/Home';
import About from '../../pages/About/About';
import Contact from '../../pages/Contact/Contact';
import './PreLogin.css';

const PreLogin = ({ onSuccess }) => {

    const location = useLocation();

    return (
        <div className='home__body d-flex flex-column justify-content-between min-vh-100'>
            <Header>
                <GoogleLoginForm
                    onSuccess={onSuccess}
                />
            </Header>
            {
                location.pathname === '/' && <Home />
            }
            {
                location.pathname === '/about' && <About />
            }
            {
                location.pathname === '/contact' && <Contact />
            }
            <Footer />
        </div>
    )
}

export default PreLogin