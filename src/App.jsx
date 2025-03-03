import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import PreLogin from './pages/PreLogin/PreLogin.jsx';
import CreateAccount from './pages/CreateAccount/CreateAccount.jsx';
import { jwtDecode } from "jwt-decode";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import { createUser, getUserByEmail } from './lib/context/dbhandler.js';
import { useUserContext } from './lib/context/UserContext';
import { ID } from 'appwrite';
import useUserInfo from './lib/hooks/useUserInfo.js';
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
    registerUser,
    createSession,
    getSessionDetails,
    checkingIdInAuth,
    checkingEmailInAuth,
  } = useUserInfo(googleUserData);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const mainSetUp = async () => {
      if (storedToken) {
        const decoded = jwtDecode(storedToken);
        setGoogleUserData(decoded);
        setIsLoggedIn(preVal => true);
        // setHasAccountType(preVal => true);
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

  const [isServerDown, setIsServerDown] = useState(false);


  const checkUsernameInDatabase = async (email) => {
    try {
      const user = await getUserByEmail(email);

      if (user && user.username) {
        setUsername(user.username);
        setAccountType(user.accountType);
        setRegisteredUsername(user.username);
        localStorage.setItem('username', user.username);
        setHasUsername(true);

      } else {
        setHasUsername(false);
        navigate('/set-username');
      }
    } catch (error) {
      console.error('Error checking username:', error);
      if (error.code === 500) {
        setIsServerDown(true);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn && hasUsername) {
      const currentPath = window.location.pathname;

      const pathsToRedirect = ['/', '/sn-plus', '/contact', '/about', '/tos', '/help-center', '/user'];

      if (pathsToRedirect.includes(currentPath)) {
        navigate('/user/feed');
      } else if (currentPath.startsWith('/user/') && currentPath.split('/').length >= 3) {
        navigate(currentPath);
      } else {
        navigate(currentPath);
      }

      // if (currentPath === '/' || currentPath === '/user') {
      // if (currentPath === '/' || currentPath === '/sn-plus' || currentPath === '/contact' || currentPath === '/about' || currentPath === '/tos' || currentPath === '/help-center' || currentPath === '/user') {
      //   navigate('/user/feed');
      // } else {
      //   navigate(currentPath);
      // }
    }
  }, [isLoggedIn, hasUsername, navigate]);


  // const startSession = async () => {
  //   if (googleUserData.email !== undefined) {
  //     try {
  //       let newLoginSession = await createSession(googleUserData?.email)
  //       console.log('newLoginSession - startSession:', newLoginSession);
  //     } catch (error) {
  //       console.error('Error starting session:', error);
  //     }
  //   }
  // }

  // Triggered for returning users 

  const onSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse?.credential);
    console.log('Logged in successfully. - onSuccess');
    setGoogleUserData(preData => decoded);

    setIsLoggedIn(preVal => true);

    const accessToken = credentialResponse?.credential;
    console.log('Access Token:', accessToken);

    console.log('decoded.email', decoded.email);

    const sessionStatus = await getSessionDetails();
    console.log(sessionStatus);

    if (!sessionStatus || sessionStatus === undefined) {
      console.log('Creating a session.');
      await createSession(decoded.email);
    } else {
      console.log('Session already in progress. LOL');
    }

    localStorage.setItem('accessToken', accessToken);

    checkUsernameInDatabase(decoded.email);

    // if (decoded) {
    //   console.log('deciding on session');
    //   const sessionDetails = await getSessionDetails();
    //   console.log('stiil deciding on session');
    //   if (!sessionDetails) {
    //     console.log('session not found so starting a new session');
    //     await startSession();
    //   } else {
    //     console.log('Session already in progress for ', googleUserData.email);
    //   }
    // }

  };


  const setUser = async () => {

    console.log('setUser 1:', username);

    if (googleUserData?.email && googleUserData?.given_name && username) {

      console.log('this email will be sent - App.jsx:', googleUserData.email);

      const usrData = await checkingEmailInAuth(googleUserData.email);

      console.log('usrData.email', usrData.email);

      if (usrData.email !== googleUserData.email) {
        console.log('running if');

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

          // Check for session
          const sessionStatus = await getSessionDetails();
          console.log('sessionStatus', sessionStatus);

          // Create session for the newly registered user
          if (!sessionStatus || sessionStatus === undefined) {
            console.log('Creating a session.');
            await createSession(googleUserData.email);
          } else {
            console.log('Session already in progress.');
          }

          // Add user to collection
          await createUser({
            id: usrID,
            email: googleUserData.email,
            given_name: googleUserData.given_name,
            username: username.toLowerCase(),
            accountType: accountType
          });

          localStorage.setItem('username', username.toLowerCase());

          setHasAccountType(true);
          setHasUsername(true);

          setTimeout(() => {
            navigate('/user/profile');
          }, 1000);

        } catch (error) {
          console.error('Error creating user:', error);
        }
      } else {
        console.log('running else');

        // const authId = await checkingIdInAuth();
        console.log('usrData.$id', usrData.$id);

        // Add user to collection
        await createUser({
          id: usrData.$id,
          email: googleUserData.email,
          given_name: googleUserData.given_name,
          username: username.toLowerCase(),
          accountType: accountType

        });

        localStorage.setItem('username', username.toLowerCase());

        setHasAccountType(true);
        setHasUsername(true);

      }

    }
    console.log('setUser 2:', username);

  };



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
      {isLoggedIn ? (
        hasUsername ? (
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
        ) : (
          <CreateAccount
            username={username}
            setUsername={setUsername}
            setUser={setUser}
            setHasUsername={setHasUsername}
            setIsLoggedIn={setIsLoggedIn}
            setGoogleUserData={setGoogleUserData}
          />
        )
      ) : (
        <PreLogin onSuccess={onSuccess} />
      )}
    </>
  )
}

export default App
