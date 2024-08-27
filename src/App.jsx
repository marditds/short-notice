import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Home from './pages/Home/Home';
import CreateUsername from './pages/CreateUsername/CreateUsername.jsx';
import { jwtDecode } from "jwt-decode";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { createUser, getUserByEmail } from './lib/context/dbhandler.js';
import { useUserContext } from './lib/context/UserContext';

function App() {

  const {
    googleUserData, setGoogleUserData,
    isLoggedIn, setIsLoggedIn,
    username, setUsername,
    hasUsername, setHasUsername
  } = useUserContext();

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');

    if (storedToken) {
      const decoded = jwtDecode(storedToken);
      setGoogleUserData(decoded);
      setIsLoggedIn(preVal => true);
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

  const setUser = async () => {

    console.log('setUser 1:', username);

    if (googleUserData?.email && googleUserData?.given_name && username) {
      try {

        await createUser({
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
              hasUsername, setHasUsername
            }}
          />
        )
          : (
            <CreateUsername
              username={username}
              setUsername={setUsername}
              setUser={setUser}
              setHasUsername={setHasUsername}
              setIsLoggedIn={setIsLoggedIn}
              setGoogleUserData={setGoogleUserData}
            />
          )
      )
        : (
          <Home onSuccess={onSuccess} />
        )}

    </>
  )
}

export default App
