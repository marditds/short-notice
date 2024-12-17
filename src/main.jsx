import { StrictMode } from 'react';
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
import App from './App.jsx';
import User from './pages/User/User.jsx';
import Home from './pages/Home/Home.jsx';
import './index.css';
import CreateAccount from './pages/CreateAccount/CreateAccount.jsx';
import UserSettings from './pages/User/Settings/UserSettings.jsx';
import UserProfile from './pages/User/Home/UserProfile.jsx';
import UserFeed from './pages/User/Feed/UserFeed.jsx';
import OtherUserProfile from './pages/User/OtherUser/OtherUserProfile.jsx';

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
        element: <Home />
      },
      {
        path: '/privacy-policy',
        element: <Home />
      },
      {
        path: '/tos',
        element: <Home />
      },
      {
        path: '/help-center',
        element: <Home />
      },
      {
        path: '/contact',
        element: <Home />
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

createRoot(document.getElementById('root')).render(


  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_API_TOKEN}>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </GoogleOAuthProvider>


  </StrictMode>

)
