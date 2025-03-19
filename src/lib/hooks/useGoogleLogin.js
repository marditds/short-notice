import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useUserContext } from '../context/UserContext';
import useUserInfo from './useUserInfo';
import { useNavigate } from 'react-router-dom';
import { getUserByEmail } from '../context/dbhandler';

const useGoogleLogin = () => {

    const navigate = useNavigate();

    const {
        googleUserData, setGoogleUserData,
        isLoggedIn, setIsLoggedIn,
        username, setUsername,
        registeredUsername, setRegisteredUsername,
        accountType, setAccountType,
        hasAccountType, setHasAccountType,
        hasUsername, setHasUsername
    } = useUserContext();

    const {
        createSession,
        getSessionDetails
    } = useUserInfo(googleUserData);

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

    };

    return { onSuccess, checkUsernameInDatabase }
}

export default useGoogleLogin;