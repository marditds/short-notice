import { Outlet } from 'react-router-dom';
import Home from './Home/Home';
import './PreLogin.css';

const PreLogin = () => {

    return (
        <>
            {
                location.pathname === '/' && <Home />
            }
            <Outlet />
        </>

    )
}

export default PreLogin
