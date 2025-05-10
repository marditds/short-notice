import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import PreLogin from './pages/PreLogin/PreLogin.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import { useUserContext } from './lib/context/UserContext';
import { LoadingComponent } from './components/Loading/LoadingComponent.jsx';

function App() {

  const { isLoggedIn, hasUsername, isAppLoading, isSessionInProgress } = useUserContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (hasUsername) {
      console.log('HAS USERNAME IS TRUE!');

      const currentPath = window.location.pathname;

      if (currentPath === '/' && isSessionInProgress) {
        navigate('/user/feed');
      }
    }
  }, [hasUsername, isSessionInProgress]);

  // if (isServerDown === true) {
  //   return (
  //     <div className='d-flex justify-content-center' style={{ fontSize: '20px', marginTop: '200px', maxWidth: 'calc(100% - 20px)', marginLeft: 'auto', marginRight: 'auto' }}>
  //       <p className=' text-wrap text-center'>
  //         The server is under maintanence.
  //         <br />
  //         👷‍♂️🚧
  //         <br />
  //         We apologize for any inconvinience.
  //         <br />
  //         🙏
  //         <br />
  //         Please try again later.
  //         <br />
  //         <br />
  //         To stay updated on the server's availability, please visit
  //         <br />
  //         <a href='https://status.appwrite.online'>
  //           https://status.appwrite.online
  //         </a>.
  //         <br />
  //         <a href='https://status.appwrite.online'>
  //           <img src={appwrite_logo} alt='appwrite_logo' height={25} style={{ marginRight: '7px' }} />
  //         </a>
  //       </p>
  //     </div>
  //   )
  // }

  if (isAppLoading) {
    return <LoadingComponent />;
  }

  return (
    <>
      {!isLoggedIn ?
        <>
          <PreLogin />
        </>
        :
        <Outlet />
      }
    </>
  );

}

export default App;