import React, { useEffect } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import Header from '../../components/PreLogin/Header/Header';
import Footer from '../../components/PreLogin/Footer/Footer';
import { GoogleLoginForm } from '../../components/LoginForm/Google/GoogleLoginForm';
import Home from './Home/Home';
import About from './About/About';
import SNPlus from './SNPlus/SNPlus';
import TOS from './TOS/TOS';
import Privacy from './Privacy/Privacy';
import CommunityGuidelines from './CommunityGuidelines/CommunityGuidelines';
import HelpCenter from './HelpCenter/HelpCenter';
import Contact from './Contact/Contact';
import './PreLogin.css';
import HelpCenterTitles from './HelpCenter/HelpCenterInfo/HelpCenterTitles';
import HelpCenterData from './HelpCenter/HelpCenterInfo/HelpCenterData';
import Attributions from './Attributions/Attributions';

const PreLogin = () => {

    const location = useLocation();

    let { helpCenterTitlesPath, helpCenterDataPath } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        // <div className='home__body d-flex flex-column justify-content-between min-vh-100'>
        <>
            {
                location.pathname === '/' && <Home />
            }

            <Outlet />
        </>
        // </div> 
    )
}

export default PreLogin
