import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import PreLogin from './pages/PreLogin/PreLogin.jsx';
import CreateAccount from './pages/CreateAccount/CreateAccount.jsx';
import { jwtDecode } from "jwt-decode";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import { useUserContext } from './lib/context/UserContext';
import useUserInfo from './lib/hooks/useUserInfo.js';
import useGoogleLogin from './lib/hooks/useGoogleLogin.js';
import appwrite_logo from '../src/assets/appwrite_logo.svg';

function App() {

  const {
    googleUserData, setGoogleUserData,
    isLoggedIn, setIsLoggedIn,
    username, setUsername,
    registeredUsername, setRegisteredUsername,
    accountType, setAccountType,
    hasAccountType, setHasAccountType,
    hasUsername, setHasUsername
  } = useUserContext();

  const navigate = useNavigate();

  const {
    createSession,
    getSessionDetails
  } = useUserInfo(googleUserData);

  const { onSuccess, checkUsernameInDatabase } = useGoogleLogin();

  const [isServerDown, setIsServerDown] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const mainSetUp = async () => {
      if (storedToken) {
        const decoded = jwtDecode(storedToken);
        setGoogleUserData(decoded);
        setIsLoggedIn(preVal => true);
        console.log('Logged in successfully - 1st useEffect');


        await checkUsernameInDatabase(decoded.email);

        const sessionStatus = await getSessionDetails();
        console.log('sessionStatus', sessionStatus);

        if (!sessionStatus || sessionStatus === undefined) {
          console.log('Creating a session.');
          await createSession(decoded.email);
        } else {
          console.log('Session already in progress.');
        }

      } else {
        navigate('/');
      }
    }
    mainSetUp();
  }, [navigate]);

  useEffect(() => {
    if (hasUsername) {
      const currentPath = window.location.pathname;

      if (currentPath === '/') {
        navigate('/user/feed');
      } else {
        navigate(currentPath)
      }

      // if ((currentPath === '/tos' || currentPath === '/privacy' || currentPath === '/legal')) {
      //   navigate('/user/legal')
      // }
      // if (currentPath === '/help-center') {
      //   navigate('/user/help-center')
      // } 
    }
  }, [hasUsername]);

  useEffect(() => {
    console.log('[hasUsername]', hasUsername);
  }, [hasUsername])

  if (isServerDown === true) {
    return (
      <div className='d-flex justify-content-center' style={{ fontSize: '20px', marginTop: '200px', maxWidth: 'calc(100% - 20px)', marginLeft: 'auto', marginRight: 'auto' }}>
        <p className=' text-wrap text-center'>
          The server is under maintanence.
          <br />
          👷‍♂️🚧
          <br />
          We apologize for any inconvinience.
          <br />
          🙏
          <br />
          Please try again later.
          <br />
          <br />
          To stay updated on the server's availability, please visit
          <br />
          <a href='https://status.appwrite.online'>
            https://status.appwrite.online
          </a>.
          <br />
          <a href='https://status.appwrite.online'>
            <img src={appwrite_logo} alt='appwrite_logo' height={25} style={{ marginRight: '7px' }} />
          </a>
        </p>
      </div>
    )
  }

  return (
    <>
      {!isLoggedIn ? (
        <>
          <PreLogin onSuccess={onSuccess} />
        </>
      ) : !hasUsername ? (
        <CreateAccount
          username={username}
          setUsername={setUsername}
          setHasUsername={setHasUsername}
          setIsLoggedIn={setIsLoggedIn}
          setGoogleUserData={setGoogleUserData}
        />
      ) : (
        <Outlet
          context={{
            googleUserData, setGoogleUserData,
            isLoggedIn, setIsLoggedIn,
            username, setUsername,
            registeredUsername, setRegisteredUsername,
            hasUsername, setHasUsername,
            accountType, setAccountType,
            hasAccountType, setHasAccountType
          }}
        />
      )}
    </>
  );

}

export default App;