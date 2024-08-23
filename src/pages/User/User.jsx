import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Tools } from '../../components/User/Tools';
import { googleLogout } from '@react-oauth/google';
import { useUserContext } from '../../lib/context/UserContext';
import './User.css';


const User = () => {
    const { setGoogleUserData, setIsLoggedIn, username } = useUserContext();

    useEffect(() => {
        console.log('User component mounted with username:', username);
    }, [username]);



    return (
        <Container className='userhome__body'>
            <Tools
                googleLogout={googleLogout}
                setGoogleUserData={setGoogleUserData}
                setIsLoggedIn={setIsLoggedIn}
            />
            <Outlet />
            <p>HAKOP</p>
        </Container>
    );
}

export default User; 