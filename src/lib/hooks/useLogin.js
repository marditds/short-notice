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
        userId, setUserId,
        userEmail, setUserEmail,
        username, setUsername,
        givenName, setGivenName,
        registeredUsername, setRegisteredUsername,
        hasUsername, setHasUsername,
        accountType, setAccountType,
        hasAccountType, setHasAccountType,
        isAppLoading, setIsAppLoading
    } = useUserContext();

    const {
        createSession,
        getSessionDetails,
        checkingEmailInAuth,
        registerUser,
    } = useUserInfo(googleUserData.email);

    const [isServerDown, setIsServerDown] = useState(false);

    const [isSetUserLoading, setIsSetUserLoading] = useState(false);


    const setUser = async () => {

        console.log('setUser 1:', username, userId, givenName, accountType);

        try {
            setIsSetUserLoading(true);

            if (username && userEmail) {

                console.log('this email will be sent - App.jsx:', userEmail);

                const usrData = await checkingEmailInAuth(userEmail);

                console.log('usrData.email', usrData.email);

                await createUser({
                    id: userId,
                    email: userEmail,
                    given_name: givenName,
                    username: username.toLowerCase(),
                    accountType: accountType
                });

                localStorage.setItem('username', username.toLowerCase());

                setHasAccountType(true);
                setHasUsername(true);


                // if (usrData.email !== userEmail) {
                // console.log('running if');

                // const usrID = ID.unique();
                // console.log('usrID', usrID);

                // try {
                // Add user to Auth
                // let newUsr = await registerUser(
                //     usrID,
                //     googleUserData.email,
                //     username.toLowerCase()
                // );
                // console.log('newUsr - App.jsx:', newUsr);

                // Check for session
                // const sessionStatus = await getSessionDetails();
                // console.log('sessionStatus', sessionStatus);

                // Create session for the newly registered user
                // if (!sessionStatus || sessionStatus === undefined) {
                //     console.log('Creating a session.');
                //     await createSession(googleUserData.email);
                // } else {
                //     console.log('Session already in progress.');
                // }

                // Add user to collection
                // await createUser({
                //     id: userId,
                //     email: userEmail,
                //     given_name: givenName,
                //     username: username.toLowerCase(),
                //     accountType: accountType
                // });

                // localStorage.setItem('username', username.toLowerCase());

                // setHasAccountType(true);
                // setHasUsername(true);

                // setTimeout(() => {
                //     navigate('/user/profile');
                // }, 1000);

                // } catch (error) {
                //     console.error('Error creating user:', error);
                // }
                // } else {
                //     console.log('running else');

                // const authId = await checkingIdInAuth();
                // console.log('usrData.$id', usrData.$id);

                // Add user to collection
                //         await createUser({
                //             id: userId,
                //             email: userEmail,
                //             given_name: givenName,
                //             username: username.toLowerCase(),
                //             accountType: accountType
                //         });

                //         localStorage.setItem('username', username.toLowerCase());

                //         setHasAccountType(true);
                //         setHasUsername(true);
                //     }
            }
        } catch (error) {
            console.error('Error running setUser:', error);
        } finally {
            setIsSetUserLoading(false);
        }
        console.log('setUser 2:', username, userId, givenName, accountType);

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
        try {
            setIsAppLoading(true);

            const decoded = jwtDecode(credentialResponse?.credential);
            console.log('Logged in successfully. - onSuccess');
            setGoogleUserData(preData => decoded);

            console.log('TYPE OF DECODED:', typeof decoded);

            // localStorage.setItem('googleUserData', JSON.stringify(decoded));
            // localStorage.setItem('googleUserData', decoded);
            // localStorage.setItem('email', decoded.email);

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

        } catch (error) {
            console.error('Error logging in:', error);
        } finally {
            setIsAppLoading(false);
        }
    };

    return { isSetUserLoading, setUser, onSuccess, checkUsernameInDatabase }
}

export default useLogin;