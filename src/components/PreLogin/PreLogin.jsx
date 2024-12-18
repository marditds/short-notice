import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import { GoogleLoginForm } from '../LoginForm/Google/GoogleLoginForm';
import Home from '../../pages/Home/Home';
import About from '../../pages/About/About';
import SNPlus from '../../pages/SNPlus/SNPlus';
import TOS from '../../pages/TOS/TOS';
import HelpCenter from '../../pages/HelpCenter/HelpCenter';
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
                location.pathname === '/sn-plus' && <SNPlus />
            }
            {
                location.pathname === '/tos' && <TOS />
            }
            {
                location.pathname === '/help-center' && <HelpCenter />
            }
            {
                location.pathname === '/contact' && <Contact />
            }

            <Footer />
        </div>
    )
}

export default PreLogin
