import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Header from '../../components/PreLogin/Header/Header';
import Footer from '../../components/PreLogin/Footer/Footer';
import { GoogleLoginForm } from '../../components/LoginForm/Google/GoogleLoginForm';
import Home from './Home/Home';
import About from './About/About';
import SNPlus from './SNPlus/SNPlus';
import TOS from './TOS/TOS';
import HelpCenter from './HelpCenter/HelpCenter';
import Contact from './Contact/Contact';
import './PreLogin.css';
import HelpCenterData from './HelpCenter/HelpCenterData/HelpCenterData';
import GettingStartedData from './HelpCenter/HelpCenterData/GettingStartedData/GettingStartedData';

const PreLogin = ({ onSuccess }) => {

    const location = useLocation();
    let { helpCenterPath, gettingStartedPath } = useParams();

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
                location.pathname === `/help-center/${helpCenterPath}` && <HelpCenterData />
            }
            {
                location.pathname === `/help-center/${helpCenterPath}/${gettingStartedPath}` && <GettingStartedData />
            }
            {
                location.pathname === '/contact' && <Contact />
            }

            <Footer />
        </div>
    )
}

export default PreLogin
