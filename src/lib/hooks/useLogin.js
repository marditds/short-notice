import { ID } from 'appwrite';
import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useUserContext } from '../context/UserContext';
import useUserInfo from './useUserInfo';
import { useNavigate } from 'react-router-dom';
import { createUser, getUserByEmail } from '../context/dbhandler';

const useLogin = () => {

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
        getSessionDetails,
        checkingEmailInAuth,
        registerUser,
    } = useUserInfo(googleUserData);

    const [isServerDown, setIsServerDown] = useState(false);

    const [isSetUserLoading, setIsSetUserLoading] = useState(false);


    const setUser = async () => {

        console.log('setUser 1:', username);
        try {
            setIsSetUserLoading(true);

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

        } catch (error) {
            console.error('Error running setUser:', error);
        } finally {
            setIsSetUserLoading(false);
        }
        console.log('setUser 2:', username);
    };

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

    return { isSetUserLoading, setUser, onSuccess, checkUsernameInDatabase }
}

export default useLogin;