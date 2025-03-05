import React, { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  redirect
} from 'react-router-dom';
import ErrorPage from './routes/error-page.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { getUserByEmail } from './lib/context/dbhandler.js';
import { UserProvider } from './lib/context/UserContext.jsx';
import { keysProvider } from './lib/context/keysProvider.js';
import App from './App.jsx';
import User from './pages/User/User.jsx';
import Home from './pages/PreLogin/Home/Home.jsx';
import About from './pages/PreLogin/About/About.jsx';
import SNPlus from './pages/PreLogin/SNPlus/SNPlus.jsx';
import TOS from './pages/PreLogin/TOS/TOS.jsx';
import HelpCenter from './pages/PreLogin/HelpCenter/HelpCenter.jsx';
import Contact from './pages/PreLogin/Contact/Contact.jsx';
import './index.css';
import CreateAccount from './pages/CreateAccount/CreateAccount.jsx';
import UserSettings from './pages/User/Settings/UserSettings.jsx';
import UserProfile from './pages/User/Home/UserProfile.jsx';
import UserFeed from './pages/User/Feed/UserFeed.jsx';
import OtherUserProfile from './pages/User/OtherUser/OtherUserProfile.jsx';
import HelpCenterTitles from './pages/PreLogin/HelpCenter/HelpCenterInfo/HelpCenterTitles.jsx';
import HelpCenterData from './pages/PreLogin/HelpCenter/HelpCenterInfo/HelpCenterData.jsx';
import Privacy from './pages/PreLogin/Privacy/Privacy.jsx';
import CommunityGuidelines from './pages/PreLogin/CommunityGuidelines/CommunityGuidelines.jsx';
import Attributions from './pages/PreLogin/Attributions/Attributions.jsx';
import { Loading } from './components/Loading/Loading.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/sn-plus',
        element: <SNPlus />
      },
      {
        path: '/tos',
        element: <TOS />
      },
      {
        path: '/privacy',
        element: <Privacy />
      },
      {
        path: '/community-guidelines',
        element: <CommunityGuidelines />
      },
      {
        path: '/help-center',
        element: <HelpCenter />,
        children: [
          {
            path: ':helpCenterTitlesPath',
            element: <HelpCenterTitles />,
            children: [
              {
                path: ':helpCenterDataPath',
                element: <HelpCenterData />
              }
            ]
          }
        ]
      },
      {
        path: '/attributions',
        element: <Attributions />
      },
      {
        path: '/contact',
        element: <Contact />
      },
      {
        path: 'set-username',
        element: <CreateAccount />,
        loader: async () => {
          const accessToken = localStorage.getItem('accessToken');
          if (!accessToken) {
            return redirect('/');
          }

          const decoded = jwtDecode(accessToken);
          const user = await getUserByEmail(decoded.email);
          if (user && user.username) {
            return redirect('/user/feed');
          }

          return null;
        },
      },
      {
        path: 'user',
        element: <User />,
        loader: async () => {
          const accessToken = localStorage.getItem('accessToken');
          if (!accessToken) {
            return redirect('/');
          }

          const decoded = jwtDecode(accessToken);
          const user = await getUserByEmail(decoded.email);
          if (!user || !user.username) {
            return redirect('/set-username');
          }
          return null;
        },
        children: [
          {
            path: 'profile',
            element: <UserProfile />,
          },
          {
            path: 'settings',
            element: <UserSettings />,
          },
          {
            path: 'feed',
            element: <UserFeed />
          },
          {
            path: ':otherUsername',
            element: <OtherUserProfile />
          },
          {
            index: true,
            element: <UserFeed />,
          }
        ]
      }
    ],
  },
]);

const MainRender = () => {

  const [clientId, setClientId] = useState(null);

  // useEffect(() => {
  //   fetch('/.netlify/functions/get-tokens?key=google')
  //     .then((res) => res.json())
  //     .then((data) => setClientId(data.token))
  //     .catch((err) => console.error('Error fetching Google tokens:', err));
  // }, []);

  useEffect(() => {
    keysProvider('google', setClientId);
  }, []);

  if (!clientId) return <p><Loading /> Loading...</p>;

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
