import React, { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  // createHashRouter,
  createBrowserRouter,
  RouterProvider,
  redirect,
  Outlet
} from 'react-router-dom';
import ErrorPage from './routes/error-page.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { getAccount, getUserByEmail } from './lib/context/dbhandler.js';
import { UserProvider } from './lib/context/UserContext.jsx';
import { keysProvider } from './lib/context/keysProvider.js';
import App from './App.jsx';
import User from './pages/User/User.jsx';
import './index.css';
import CreateAccount from './pages/CreateAccount/CreateAccount.jsx';
import UserSettings from './pages/User/Settings/UserSettings.jsx';
import UserProfile from './pages/User/Home/UserProfile.jsx';
import UserFeed from './pages/User/Feed/UserFeed.jsx';
import OtherUserProfile from './pages/User/OtherUser/OtherUserProfile.jsx';
import { Loading } from './components/Loading/Loading.jsx';
import UserLegal from './pages/User/Legal/UserLegal.jsx';
import UserSupport from './pages/User/Support/UserSupport.jsx';
import UserHelpCenter from './pages/User/HelpCenter/UserHelpCenter.jsx';
import Home from './pages/PreLogin/Home/Home.jsx';
import About from './pages/PreLogin/About/About.jsx';
import SNPlus from './pages/PreLogin/SNPlus/SNPlus.jsx';
import TOS from './pages/PreLogin/TOS/TOS.jsx';
import Privacy from './components/Legal/PrivacyList.jsx';
import CommunityGuidelines from './pages/PreLogin/CommunityGuidelines/CommunityGuidelines.jsx';
import HelpCenter from './pages/PreLogin/HelpCenter/HelpCenter.jsx';
import HelpCenterTitles from './pages/PreLogin/HelpCenter/HelpCenterInfo/HelpCenterTitles.jsx';
import Attributions from './pages/PreLogin/Attributions/Attributions.jsx';
import Contact from './pages/PreLogin/Contact/Contact.jsx';
import HelpCenterData from './pages/PreLogin/HelpCenter/HelpCenterInfo/HelpCenterData.jsx';
import UserHelpCenterTitles from './pages/User/HelpCenter/UserHelpCenterTitles.jsx';
import UserHelpCenterData from './pages/User/HelpCenter/UserHelpCenterData.jsx';
import Header from './components/PreLogin/Header/Header.jsx';
import Footer from './components/PreLogin/Footer/Footer.jsx';
import { GoogleLoginForm } from './components/LoginForm/Google/GoogleLoginForm.jsx';
import useLogin from './lib/hooks/useLogin.js';
import Authenticate from './pages/User/Home/Authenticate.jsx';

const PreLoginLayout = () => {

  // const { onSuccess } = useLogin();

  return (
    <div className='home__body d-flex flex-column justify-content-between min-vh-100'>
      <Header>
        <GoogleLoginForm
        // onSuccess={onSuccess}
        />
      </Header>
      <Outlet />
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <PreLoginLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'sn-plus',
        element: <SNPlus />,
      },
      {
        path: 'tos',
        element: <TOS />,
      },
      {
        path: 'privacy',
        element: <Privacy />,
      },
      {
        path: 'legal',
        element: <Privacy />,
      },
      {
        path: 'community-guidelines',
        element: <CommunityGuidelines />,
      },
      {
        path: 'help-center',
        element: <HelpCenter />,
        children: [
          {
            path: ':helpCenterTitlesPath',
            element: <HelpCenterTitles />,
            children: [
              {
                path: ':helpCenterDataPath',
                element: <HelpCenterData />,
              }
            ]
          }
        ]
      },
      {
        path: 'attributions',
        element: <Attributions />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
    ]
  },
  {
    path: 'set-username',
    element: <CreateAccount />,
    loader: async () => {
      // const accessToken = localStorage.getItem('accessToken');
      // if (!accessToken) {
      //   return redirect('/');
      // }

      // const decoded = jwtDecode(accessToken);
      console.log('RUNNING <CreateAccount/> LOADER:');

      const authenticatedUser = await getAccount();

      const user = await getUserByEmail(authenticatedUser.email);
      if (user && user.username) {
        return redirect('/user/feed');
      }

      return null;
    },
  },
  {
    path: 'authenticate',
    loader: async () => {
      console.log('RUNNING <Authenticate/> LOADER:');
      return null;
    },
    element: <Authenticate />,
  },
  {
    path: 'user',
    element: <User />,
    loader: async () => {
      //   const accessToken = localStorage.getItem('accessToken');
      //   if (!accessToken) {
      //     return redirect('/');
      //   }
      // const decoded = jwtDecode(accessToken);
      console.log('RUNNING <USER/> LOADER:');

      const authenticatedUser = await getAccount();

      console.log('authenticatedUser in <USER/> LOADER:', authenticatedUser);

      if (!authenticatedUser) {
        console.warn('No authenticated user. Redirecting to /authenitcate');
        return redirect('authenticate');
      }

      const user = await getUserByEmail(authenticatedUser.email);

      if (!user || !user.username) {
        console.log('User profile incomplete. Redirecting to /set-username');
        return redirect('/set-username');
      }

      // console.log('User authenticated and profile complete. Redirecting to /profile');
      // return redirect('/user/profile');
      return null;
    },
    children: [
      {
        path: ':otherUsername',
        element: <OtherUserProfile />
      },
      {
        path: 'profile',
        element: <UserProfile />,
      },
      {
        path: 'settings',
        element: <UserSettings />,
      },
      {
        path: 'legal',
        element: <UserLegal />,
      },
      {
        path: 'support',
        element: <UserSupport />,
      },
      {
        path: 'help-center',
        element: <UserHelpCenter />,
        children: [
          {
            path: ':helpCenterTitlesPath',
            element: <UserHelpCenterTitles />,
            children: [
              {
                path: ':helpCenterDataPath',
                element: <UserHelpCenterData />,
              }
            ]
          }
        ]
      },
      {
        path: 'feed',
        element: <UserFeed />
      },
      {
        index: true,
        element: <UserFeed />,
      }
    ]
  },
]);

const MainRender = () => {

  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    keysProvider('google', setClientId);
  }, []);

  if (!clientId) return <p><Loading /> Loading Hakop...</p>;

  return (
    <StrictMode>
      <GoogleOAuthProvider clientId={clientId}>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </GoogleOAuthProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(
  <MainRender />
);
