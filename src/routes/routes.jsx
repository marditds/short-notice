import { Outlet, redirect, useLocation, useNavigation } from 'react-router-dom';
import { getAccount, getUserByEmail } from '../lib/context/dbhandler.js';
import ErrorPage from './error-page.jsx';
import App from '../App.jsx';
import User from '../pages/User/User.jsx';
import CreateAccount from '../pages/CreateAccount/CreateAccount.jsx';
import UserSettings from '../pages/User/Settings/UserSettings.jsx';
import UserProfile from '../pages/User/Home/UserProfile.jsx';
import UserFeed from '../pages/User/Feed/UserFeed.jsx';
import OtherUserProfile from '../pages/User/OtherUser/OtherUserProfile.jsx';
import UserLegal from '../pages/User/Legal/UserLegal.jsx';
import UserSupport from '../pages/User/Support/UserSupport.jsx';
import UserHelpCenter from '../pages/User/HelpCenter/UserHelpCenter.jsx';
import About from '../pages/PreLogin/About/About.jsx';
import SNPlus from '../pages/PreLogin/SNPlus/SNPlus.jsx';
import TOS from '../pages/PreLogin/TOS/TOS.jsx';
import Privacy from '../components/Legal/PrivacyList.jsx';
import CommunityGuidelines from '../pages/PreLogin/CommunityGuidelines/CommunityGuidelines.jsx';
import HelpCenter from '../pages/PreLogin/HelpCenter/HelpCenter.jsx';
import HelpCenterTitles from '../pages/PreLogin/HelpCenter/HelpCenterInfo/HelpCenterTitles.jsx';
import Attributions from '../pages/PreLogin/Attributions/Attributions.jsx';
import Contact from '../pages/PreLogin/Contact/Contact.jsx';
import HelpCenterData from '../pages/PreLogin/HelpCenter/HelpCenterInfo/HelpCenterData.jsx';
import UserHelpCenterTitles from '../pages/User/HelpCenter/UserHelpCenterTitles.jsx';
import UserHelpCenterData from '../pages/User/HelpCenter/UserHelpCenterData.jsx';
import Header from '../components/PreLogin/Header/Header.jsx';
import Footer from '../components/PreLogin/Footer/Footer.jsx';
import { GoogleLoginForm } from '../components/LoginForm/Google/GoogleLoginForm.jsx';
import Authenticate from '../pages/User/Home/Authenticate.jsx';
import { useState, useEffect } from 'react';
import { LoadingComponent } from '../components/Loading/LoadingComponent.jsx';
import SignUp from '../pages/SignUp/SignUp.jsx';
import Login from '../pages/Login/Login.jsx';

const PreLoginLayout = () => {

    const location = useLocation();
    const navigation = useNavigation();

    const isLoading = navigation.state === 'loading';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    if (isLoading) {
        return <LoadingComponent />
    }

    return (
        <div className='home__body d-flex flex-column justify-content-between min-vh-100'>

            {
                !location.pathname.startsWith('/authenticate') && location.pathname !== '/set-username' && location.pathname !== '/signup' &&
                <Header>
                    <GoogleLoginForm />
                </Header>
            }


            <Outlet />

            {
                !location.pathname.startsWith('/authenticate') && location.pathname !== '/set-username' && location.pathname !== '/signup' &&
                <Footer />
            }


        </div>
    );
};

export const routes = [
    {
        path: '/', element: <PreLoginLayout />,
        errorElement: <ErrorPage />,
        loader: async () => {
            console.log('RUNNING \'/\' LOADER:');

            const authenticatedUser = await getAccount();

            if (authenticatedUser) {
                console.log('User is already authenticated, checking if they have a username');

                const user = await getUserByEmail(authenticatedUser.email);

                if (user && user?.username) {
                    console.log('User has username, redirecting to feed');
                    return redirect('/user/feed');
                }
            }
            return null;
        },
        children: [
            {
                index: true, element: <App />,
            },
            {
                path: 'about', element: <About />,
            },
            {
                path: 'sn-plus', element: <SNPlus />,
            },
            {
                path: 'tos', element: <TOS />,
            },
            {
                path: 'privacy', element: <Privacy />,
            },
            {
                path: 'legal', element: <Privacy />,
            },
            {
                path: 'community-guidelines', element: <CommunityGuidelines />,
            },
            {
                path: 'help-center', element: <HelpCenter />,
                children: [
                    {
                        path: ':helpCenterTitlesPath', element: <HelpCenterTitles />,
                        children: [
                            {
                                path: ':helpCenterDataPath', element: <HelpCenterData />,
                            }
                        ]
                    }
                ]
            },
            {
                path: 'attributions', element: <Attributions />,
            },
            {
                path: 'contact', element: <Contact />,
            },
            {
                path: 'set-username', element: <CreateAccount />,
                authRequired: true,
                loader: async () => {
                    console.log('RUNNING <CreateAccount/> LOADER:');

                    const authenticatedUser = await getAccount();

                    console.log('CHECKING IF USER ALREADY EXISTS IN COLLECTION.');

                    const user = await getUserByEmail(authenticatedUser.email);
                    if (user?.username) {
                        console.log('USER ALREADY EXISTS IN COLLECTION. REDIRECTING TO /user/feed');
                        return redirect('/user/feed');
                    }
                    return null;
                }
            },
            {
                path: 'authenticate', element: <Authenticate />,
                loader: async () => {
                    console.log('RUNNING <Authenticate/> LOADER:');

                    const authenticatedUser = await getAccount();

                    console.log('CHECKING IF USER ALREADY EXISTS IN COLLECTION.');

                    if (authenticatedUser) {
                        const user = await getUserByEmail(authenticatedUser?.email);
                        if (user?.username) {
                            console.log('USER ALREADY EXISTS IN COLLECTION. REDIRECTING TO /user/feed');
                            return redirect('/user/feed');
                        }
                    }

                    return null;
                },
            },
            {
                path: 'signup', element: <SignUp />,
                loader: async () => {
                    console.log('RUNNING <SignUp/> LOADER:');

                    // const authenticatedUser = await getAccount();

                    // console.log('CHECKING IF USER ALREADY EXISTS IN COLLECTION.');

                    // const user = await getUserByEmail(authenticatedUser.email);
                    // if (user?.username) {
                    //     console.log('USER ALREADY EXISTS IN COLLECTION. REDIRECTING TO /user/feed');
                    //     return redirect('/user/feed');
                    // }
                    return null;
                }
            },
            {
                path: 'login', element: <Login />,
                loader: async () => {
                    console.log('RUNNING <Login/> LOADER:');

                    // const authenticatedUser = await getAccount();

                    // console.log('CHECKING IF USER ALREADY EXISTS IN COLLECTION.');

                    // const user = await getUserByEmail(authenticatedUser.email);
                    // if (user?.username) {
                    //     console.log('USER ALREADY EXISTS IN COLLECTION. REDIRECTING TO /user/feed');
                    //     return redirect('/user/feed');
                    // }
                    return null;
                }
            },
        ]
    },
    {
        path: 'user', element: <User />,
        authRequired: true,
        loader: async () => {

            console.log('RUNNING <USER/> LOADER:');

            return null;
        },
        children: [
            {
                index: true, element: <UserFeed />,
            },
            {
                path: 'feed', element: <UserFeed />
            },
            {
                path: ':otherUsername', element: <OtherUserProfile />
            },
            {
                path: 'profile', element: <UserProfile />,
            },
            {
                path: 'settings', element: <UserSettings />,
            },
            {
                path: 'legal', element: <UserLegal />,
            },
            {
                path: 'support', element: <UserSupport />,
            },
            {
                path: 'help-center', element: <UserHelpCenter />,
                children: [
                    {
                        path: ':helpCenterTitlesPath', element: <UserHelpCenterTitles />,
                        children: [
                            {
                                path: ':helpCenterDataPath',
                                element: <UserHelpCenterData />,
                            }
                        ]
                    }
                ]
            }
        ]
    }
];