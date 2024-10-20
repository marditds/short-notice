import { useEffect, useCallback } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Home from './pages/Home/Home';
import CreateUsername from './pages/CreateUsername/CreateUsername.jsx';
import { jwtDecode } from "jwt-decode";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { createUser, getUserByEmail, account } from './lib/context/dbhandler.js';
import { useUserContext } from './lib/context/UserContext';
import { ID } from 'appwrite';
import useUserInfo from './lib/hooks/useUserInfo.js';

function App() {

  const {
    googleUserData, setGoogleUserData,
    isLoggedIn, setIsLoggedIn,
    username, setUsername,
    registeredUsername, setRegisteredUsername,
    hasUsername, setHasUsername,
  } = useUserContext();

  const navigate = useNavigate();

  const {
    registerUser,
    createSession,
    getSessionDetails,
    checkingIdInAuth,
    checkingEmailInAuth
  } = useUserInfo(googleUserData);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');

    if (storedToken) {
      const decoded = jwtDecode(storedToken);
      setGoogleUserData(decoded);
      setIsLoggedIn(preVal => true);
      console.log('Logged in successfully - 1st useEffect');

      checkUsernameInDatabase(decoded.email);
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const startSession = async () => {
      if (googleUserData.email !== undefined) {
        try {
          let newLoginSession = await createSession(googleUserData?.email)
          console.log('newLoginSession - startSession:', newLoginSession);
        } catch (error) {
          console.error('Error starting session:', error);
        }
      }
    }
    const sessionDetails = getSessionDetails();
    if (!sessionDetails) {
      startSession();
    } else {
      console.log('Session already in progress for ', googleUserData.email);
    }
  }, [googleUserData])


  const checkUsernameInDatabase = async (email) => {
    try {
      const user = await getUserByEmail(email);

      if (user && user.username) {
        setUsername(user.username);
        setRegisteredUsername(user.username);
        localStorage.setItem('username', user.username);
        setHasUsername(true);

      } else {
        setHasUsername(false);
        navigate('/set-username');
      }
    } catch (error) {
      console.error('Error checking username:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn && hasUsername) {
      const currentPath = window.location.pathname;
      if (currentPath === '/' || currentPath === '/user') {
        navigate('/user/feed');
      } else {
        navigate(currentPath);
      }
    }
  }, [isLoggedIn, hasUsername, navigate]);

  // Triggered for returning users 
  const onSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse?.credential);
    console.log('Logged in successfully. - onSuccess');
    setGoogleUserData(preData => decoded);

    setIsLoggedIn(preVal => true);

    const accessToken = credentialResponse?.credential;
    console.log('Access Token:', accessToken);

    localStorage.setItem('accessToken', accessToken);

    checkUsernameInDatabase(decoded.email);
  };


  const setUser = async () => {

    console.log('setUser 1:', username);

    if (googleUserData?.email && googleUserData?.given_name && username) {

      const usrEmail = await checkingEmailInAuth();

      if (usrEmail !== googleUserData.email) {
        const usrID = ID.unique();
        console.log('usrID', usrID);

        try {
          // Add user to Auth
          let newUsr = await registerUser(
            usrID,
            googleUserData.email,
            username.toLowerCase()
          );
          console.log('newUsr - App.jsx:', newUsr);

          let newUsrSession = await createSession(googleUserData.email)
          console.log('newUsrSession - App.jsx:', newUsrSession);

          // Add user to collection
          await createUser({
            id: usrID,
            email: googleUserData.email,
            given_name: googleUserData.given_name,
            username: username.toLowerCase()
          });

          localStorage.setItem('username', username.toLowerCase());

          setHasUsername(true);

          setTimeout(() => {
            navigate('/user/profile');
          }, 1000);

        } catch (error) {
          console.error('Error creating user:', error);
        }
      } else {
        const authId = await checkingIdInAuth();
        console.log('authId', authId);

        // Add user to collection
        await createUser({
          id: authId,
          email: googleUserData.email,
          given_name: googleUserData.given_name,
          username: username.toLowerCase()
        });

        localStorage.setItem('username', username.toLowerCase());

        setHasUsername(true);
      }

    }
    console.log('setUser 2:', username);

  };




  return (
    <>
      {isLoggedIn ? (
        hasUsername ? (
          <Outlet
            context={{
              googleUserData, setGoogleUserData,
              isLoggedIn, setIsLoggedIn,
              username, setUsername,
              registeredUsername, setRegisteredUsername,
              hasUsername, setHasUsername
            }}
          />
        ) : (
          <CreateUsername
            username={username}
            setUsername={setUsername}
            setUser={setUser}
            setHasUsername={setHasUsername}
            setIsLoggedIn={setIsLoggedIn}
            setGoogleUserData={setGoogleUserData}
          />
        )
      ) : (
        <Home onSuccess={onSuccess} />
      )}
    </>
  )
}

export default App
