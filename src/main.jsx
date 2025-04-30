import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
  Outlet,
  useLocation
} from 'react-router-dom';
import { UserProvider, useUserContext } from './lib/context/UserContext.jsx';
import { addAuthGuards } from './routes/routesUtils.js';
import { routes } from './routes/routes.jsx';

// import ErrorPage from './routes/error-page.jsx';
// import { getAccount, getUserByEmail } from './lib/context/dbhandler.js';
// import App from './App.jsx';
// import User from './pages/User/User.jsx';
// import './index.css';
// import CreateAccount from './pages/CreateAccount/CreateAccount.jsx';
// import UserSettings from './pages/User/Settings/UserSettings.jsx';
// import UserProfile from './pages/User/Home/UserProfile.jsx';
// import UserFeed from './pages/User/Feed/UserFeed.jsx';
// import OtherUserProfile from './pages/User/OtherUser/OtherUserProfile.jsx';
// import UserLegal from './pages/User/Legal/UserLegal.jsx';
// import UserSupport from './pages/User/Support/UserSupport.jsx';
// import UserHelpCenter from './pages/User/HelpCenter/UserHelpCenter.jsx';
// import About from './pages/PreLogin/About/About.jsx';
// import SNPlus from './pages/PreLogin/SNPlus/SNPlus.jsx';
// import TOS from './pages/PreLogin/TOS/TOS.jsx';
// import Privacy from './components/Legal/PrivacyList.jsx';
// import CommunityGuidelines from './pages/PreLogin/CommunityGuidelines/CommunityGuidelines.jsx';
// import HelpCenter from './pages/PreLogin/HelpCenter/HelpCenter.jsx';
// import HelpCenterTitles from './pages/PreLogin/HelpCenter/HelpCenterInfo/HelpCenterTitles.jsx';
// import Attributions from './pages/PreLogin/Attributions/Attributions.jsx';
// import Contact from './pages/PreLogin/Contact/Contact.jsx';
// import HelpCenterData from './pages/PreLogin/HelpCenter/HelpCenterInfo/HelpCenterData.jsx';
// import UserHelpCenterTitles from './pages/User/HelpCenter/UserHelpCenterTitles.jsx';
// import UserHelpCenterData from './pages/User/HelpCenter/UserHelpCenterData.jsx';
// import Header from './components/PreLogin/Header/Header.jsx';
// import Footer from './components/PreLogin/Footer/Footer.jsx';
// import { GoogleLoginForm } from './components/LoginForm/Google/GoogleLoginForm.jsx';
// import Authenticate from './pages/User/Home/Authenticate.jsx';
// import { LoadingComponent } from './components/Loading/LoadingComponent.jsx';


// const PreLoginLayout = () => {

//   const location = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [location]);

//   return (
//     <div className='home__body d-flex flex-column justify-content-between min-vh-100'>
//       <Header>
//         <GoogleLoginForm />
//       </Header>
//       <Outlet />
//       <Footer />
//     </div>
//   );
// };

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <PreLoginLayout />,
//     errorElement: <ErrorPage />,
//     loader: async () => {
//       console.log('RUNNING ROOT LOADER:');

//       const authenticatedUser = await getAccount();

//       if (authenticatedUser) {
//         console.log('User is already authenticated, checking if they have a username');

//         const user = await getUserByEmail(authenticatedUser.email);

//         if (user && user?.username) {
//           console.log('User has username, redirecting to feed');
//           return redirect('/user/feed');
//         }
//       }

//       return null;
//     },
//     children: [
//       {
//         index: true,
//         element: <App />,
//       },
//       {
//         path: 'about',
//         element: <About />,
//       },
//       {
//         path: 'sn-plus',
//         element: <SNPlus />,
//       },
//       {
//         path: 'tos',
//         element: <TOS />,
//       },
//       {
//         path: 'privacy',
//         element: <Privacy />,
//       },
//       {
//         path: 'legal',
//         element: <Privacy />,
//       },
//       {
//         path: 'community-guidelines',
//         element: <CommunityGuidelines />,
//       },
//       {
//         path: 'help-center',
//         element: <HelpCenter />,
//         children: [
//           {
//             path: ':helpCenterTitlesPath',
//             element: <HelpCenterTitles />,
//             children: [
//               {
//                 path: ':helpCenterDataPath',
//                 element: <HelpCenterData />,
//               }
//             ]
//           }
//         ]
//       },
//       {
//         path: 'attributions',
//         element: <Attributions />,
//       },
//       {
//         path: 'contact',
//         element: <Contact />,
//       },
//     ]
//   },
//   {
//     path: 'create-account',
//     element: <CreateAccount />,
//     loader: async () => {

//       console.log('RUNNING <CreateAccount/> LOADER:');

//       const authenticatedUser = await getAccount();

//       console.log('authenticatedUser in /create-account loader:', authenticatedUser);

//       if (!authenticatedUser) {
//         return redirect('/');
//       } else {
//         const user = await getUserByEmail(authenticatedUser.email);
//         if (user && user.username) {
//           return redirect('/user/feed');
//         }
//       }

//       return null;
//     },
//   },
//   {
//     path: 'authenticate',
//     element: <Authenticate />,
//     loader: async () => {
//       console.log('RUNNING <Authenticate/> LOADER:');
//       return null;
//     },
//   },
//   {
//     path: 'user',
//     element: <User />,
//     loader: async () => {

//       console.log('RUNNING <USER/> LOADER:');

//       const authenticatedUser = await getAccount();

//       console.log('authenticatedUser in <USER/> LOADER:', authenticatedUser);

//       if (!authenticatedUser) {
//         console.warn('No authenticated user. Redirecting to /');
//         return redirect('/');
//       }

//       return null;
//     },
//     children: [
//       {
//         index: true,
//         element: <UserFeed />,
//       },
//       {
//         path: 'feed',
//         element: <UserFeed />
//       },
//       {
//         path: ':otherUsername',
//         element: <OtherUserProfile />
//       },
//       {
//         path: 'profile',
//         element: <UserProfile />,
//       },
//       {
//         path: 'settings',
//         element: <UserSettings />,
//       },
//       {
//         path: 'legal',
//         element: <UserLegal />,
//       },
//       {
//         path: 'support',
//         element: <UserSupport />,
//       },
//       {
//         path: 'help-center',
//         element: <UserHelpCenter />,
//         children: [
//           {
//             path: ':helpCenterTitlesPath',
//             element: <UserHelpCenterTitles />,
//             children: [
//               {
//                 path: ':helpCenterDataPath',
//                 element: <UserHelpCenterData />,
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   },
// ]);

const router = createBrowserRouter(addAuthGuards(routes));

const MainRender = () => {

  return (
    <StrictMode>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(
  <MainRender />
);
