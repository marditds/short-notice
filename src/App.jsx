import { useEffect, useCallback } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Home from './pages/Home/Home';
import CreateUsername from './pages/CreateUsername/CreateUsername.jsx';
import { jwtDecode } from "jwt-decode";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { createUser, getUserByEmail } from './lib/context/dbhandler.js';
import { UserProvider, useUserContext } from './lib/context/UserContext';

function App() {

  const {
    googleUserData, setGoogleUserData,
    isLoggedIn, setIsLoggedIn,
    username, setUsername,
    hasUsername, setHasUsername
  } = useUserContext();

  const navigate = useNavigate();

  const resetState = useCallback(() => {
    setGoogleUserData(null);
    setIsLoggedIn(false);
    setUsername('');
    setHasUsername(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
  }, [setGoogleUserData, setIsLoggedIn, setUsername, setHasUsername]);



  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');

    if (storedToken) {
      const decoded = jwtDecode(storedToken);
      setGoogleUserData(decoded);
      setIsLoggedIn(true);
      checkUsernameInDatabase(decoded.email);
    } else {
      navigate('/');
    }
  }, [navigate]);


  const checkUsernameInDatabase = async (email) => {

    console.log('checkUsernameInDatabase 1:', username);

    const user = await getUserByEmail(email);
    if (user && user.username) {

      console.log('checkUsernameInDatabase 2:', user.username);

      setUsername(user.username);
      localStorage.setItem('username', user.username);
      setHasUsername(preVal => true);

      console.log('checkUsernameInDatabase 3:', user.username);

    } else {
      setHasUsername(preVal => false);
      navigate('/set-username');
    }
  };

  useEffect(() => {
    if (isLoggedIn && hasUsername) {
      const currentPath = window.location.pathname;
      if (currentPath === '/' || currentPath === '/user') {
        navigate('/user/profile');
      } else {
        navigate(currentPath);
      }
    }
  }, [isLoggedIn, hasUsername, navigate]);

  const onSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse?.credential);
    console.log('Logged in successfully.');
    setGoogleUserData(preData => decoded);
    setIsLoggedIn(preVal => true);

    const accessToken = credentialResponse?.credential;
    console.log('Access Token:', accessToken);

    localStorage.setItem('accessToken', accessToken);

    checkUsernameInDatabase(decoded.email);
  };

  const setUser = async (usrnm) => {

    console.log('setUser 1:', { email: googleUserData?.email, given_name: googleUserData?.given_name, usrnm });

    if (googleUserData?.email && googleUserData?.given_name && usrnm) {
      try {
        console.log('Attempting to create user in Appwrite');
        await createUser({
          email: googleUserData.email,
          given_name: googleUserData.given_name,
          username: usrnm.toLowerCase()
        });

        console.log('User created successfully');

        localStorage.setItem('username', usrnm.toLowerCase());
        setHasUsername(true);

        setTimeout(() => {
          navigate('/user/profile');
        }, 1000);

      } catch (error) {
        console.error('Error creating user:', error);
        setErrorMessage('Failed to create user. Please try again.');
      }
    } else {
      console.warn('Missing data:', { email: googleUserData?.email, given_name: googleUserData?.given_name, usrnm });
    }
    console.log('setUser 2:', usrnm);

  };




  return (
    <>
      <UserProvider
        value={{
          googleUserData, setGoogleUserData,
          isLoggedIn, setIsLoggedIn,
          username, setUsername,
          hasUsername, setHasUsername,
          resetState
        }}
      >
        {isLoggedIn ? (
          hasUsername ? (
            <Outlet />
          ) : (
            <CreateUsername setUser={setUser} />
          )
        ) : (
          <Home onSuccess={onSuccess} />
        )}
      </UserProvider>
      {/* <UserProvider
        value={{
          googleUserData, setGoogleUserData,
          isLoggedIn, setIsLoggedIn,
          username, setUsername,
          hasUsername, setHasUsername,
          resetState
        }}
      >
        {isLoggedIn ? (
          hasUsername ? (
            <Outlet
              context={{ setUser }}

            />
          )
            : (
              <CreateUsername
                username={username}
                setUsername={setUsername}
                setHasUsername={setHasUsername}
                setIsLoggedIn={setIsLoggedIn}
                setGoogleUserData={setGoogleUserData}
              />
            )
        )
          : (
            <Home onSuccess={onSuccess} />
          )}
      </UserProvider> */}
    </>
  )
}

export default App
