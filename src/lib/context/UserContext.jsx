import { createContext, useContext, useEffect, useState } from 'react';
import { getAccount, getUserById } from './dbhandler';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [username, setUsername] = useState('');
    const [userWebsite, setUserWebsite] = useState(null);
    const [givenName, setGivenName] = useState('');
    const [registeredUsername, setRegisteredUsername] = useState('');
    const [hasUsername, setHasUsername] = useState(false);
    const [hasAccountType, setHasAccountType] = useState(false);
    const [accountType, setAccountType] = useState('');
    const [isAppLoading, setIsAppLoading] = useState(false);
    const [isCheckEmailExistanceLoading, setIsCheckEmailExistanceLoading] = useState(false);
    const [isSessionInProgress, setIsSessionInProgress] = useState(false);
    const [isLogInBtnClicked, setIsLogInBtnClicked] = useState(false);

    // Checkig Session Status
    useEffect(() => {
        const checkingSessionStatus = async () => {
            try {
                console.log('START - Checking session status...');
                setIsAppLoading(true);

                const usr = await getAccount();
                if (usr) {
                    console.log('Session in progress.', usr);
                    setIsSessionInProgress(true);
                    setUserEmail(usr.email);
                    setUserId(usr.$id);
                    setUsername(usr.name)
                    setIsLoggedIn(true);
                } else {
                    console.log('No session found.');
                    setIsSessionInProgress(false);
                }
            } catch (error) {
                console.error('Error checking session status:', error);
            } finally {
                console.log('FINISH - Checking session status...');
                setIsAppLoading(false);
            }
        };
        // if (isLogInBtnClicked) {
        checkingSessionStatus();
        // }
    }, [])

    // Fetch username, account type, and website by user Id
    useEffect(() => {
        if (!isLoggedIn || !userId) return;

        const fetchUserByUserId = async () => {
            try {
                const usr = await getUserById(userId);
                console.log('usr in UserContext:', usr);

                setAccountType(usr.accountType);
                setUserWebsite(usr.website);
                setUsername(usr.username);
                setHasUsername(true);

            } catch (error) {
                console.log('Error fetching user by id', error);
            }
        }

        if (isLoggedIn && userId) {
            fetchUserByUserId();
        }
    }, [userId, isLoggedIn])

    return (
        <UserContext.Provider
            value={{
                isLoggedIn, setIsLoggedIn,
                userId, setUserId,
                userEmail, setUserEmail,
                username, setUsername,
                userWebsite, setUserWebsite,
                givenName, setGivenName,
                registeredUsername, setRegisteredUsername,
                hasUsername, setHasUsername,
                accountType, setAccountType,
                hasAccountType, setHasAccountType,
                isAppLoading, setIsAppLoading,
                isCheckEmailExistanceLoading, setIsCheckEmailExistanceLoading,
                user, setUser,
                isSessionInProgress, setIsSessionInProgress,
                isLogInBtnClicked, setIsLogInBtnClicked
            }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
