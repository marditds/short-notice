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

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
      },
      {
        path: '/about',
      },
      {
        path: '/sn-plus',
      },
      {
        path: '/tos',
      },
      {
        path: '/privacy',
      },
      {
        path: '/community-guidelines',
      },
      {
        path: '/help-center',
        children: [
          {
            path: ':helpCenterTitlesPath',
            children: [
              {
                path: ':helpCenterDataPath',
              }
            ]
          }
        ]
      },
      {
        path: '/attributions',
      },
      {
        path: '/contact',
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
                children: [
                  {
                    path: ':helpCenterDataPath',
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
