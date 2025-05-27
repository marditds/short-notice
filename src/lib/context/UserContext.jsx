import { createContext, useContext, useEffect, useState } from 'react';
import { getUserById } from './dbhandler';
import { useLocation, useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const navigate = useNavigate();
    const location = useLocation();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [username, setUsername] = useState('');
    const [userWebsite, setUserWebsite] = useState(null);
    const [userAvatarId, setUserAvatarId] = useState(null);
    const [givenName, setGivenName] = useState('');
    const [registeredUsername, setRegisteredUsername] = useState('');
    const [hasUsername, setHasUsername] = useState(false);
    const [hasAccountType, setHasAccountType] = useState(false);
    const [accountType, setAccountType] = useState('');
    const [isAppLoading, setIsAppLoading] = useState(false);
    const [isFetchingUserinContextLoading, setIsFetchingUserinContextLoading] = useState(false);
    const [isCheckEmailExistanceLoading, setIsCheckEmailExistanceLoading] = useState(false);
    const [isSessionInProgress, setIsSessionInProgress] = useState(false);
    const [isSignOutInProgress, setIsSignOutInProgress] = useState(false);
    const [isLogInBtnClicked, setIsLogInBtnClicked] = useState(false);

    // Checkig Session Status
    useEffect(() => {
        const checkingSessionStatus = async () => {

            if (isSignOutInProgress) {
                console.log('Sign out in progress. Not checking session status. Sowy 🤣.');
                return;
            }

            try {
                console.log('START - Checking session status...');

                setIsAppLoading(true);

                if (location.pathname === '/' && isSignOutInProgress) {
                    console.log('On root path during sign-out. Skipping session check.');
                    return;
                }

                const userIdInSession = localStorage.getItem('authUserId');

                if (!userIdInSession) {
                    console.log('No session found.');
                    setIsSessionInProgress(false);
                    setIsLoggedIn(false);
                    return;
                }

                // const usr = await getAccount();

                const userEmailInSession = localStorage.getItem('authUserEmail');

                console.log('Session in progress.', userIdInSession);
                console.log('userEmailInSession', userEmailInSession);

                setIsSessionInProgress(true);
                setUserEmail(userEmailInSession);
                setUserId(userIdInSession);
                setIsLoggedIn(true);

            } catch (error) {
                console.error('Error checking session status:', error);
            } finally {
                console.log('FINISH - Checking session status...');
                setIsAppLoading(false);
            }
        };
        checkingSessionStatus();
    }, [isSignOutInProgress])

    // Fetch username, account type, and website by user Id
    useEffect(() => {
        if (!isLoggedIn || !userId) return;

        const fetchUserByUserId = async () => {
            try {
                console.log('START - Fetching user in Context...');
                setIsFetchingUserinContextLoading(true);

                const usr = await getUserById(userId);
                console.log('usr in UserContext:', usr);

                if (usr === 404) {
                    if (location.pathname !== '/create-account') {
                        navigate('/create-account');
                    }
                }

                setAccountType(usr.accountType);
                setUserAvatarId(usr.avatar);
                setUserWebsite(usr.website);
                setUsername(usr.username);
                setHasUsername(true);

            } catch (error) {
                console.log('Error fetching user by id', error);
            }
            finally {
                console.log('FINISH - Fetching user in Context...');
                setIsFetchingUserinContextLoading(false);
            }
        }

        if (location.pathname !== '/create-account') {
            fetchUserByUserId();
        } else {
            console.log('Bari galust.');
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
                userAvatarId, setUserAvatarId,
                givenName, setGivenName,
                registeredUsername, setRegisteredUsername,
                hasUsername, setHasUsername,
                accountType, setAccountType,
                hasAccountType, setHasAccountType,
                isAppLoading, setIsAppLoading,
                isCheckEmailExistanceLoading, setIsCheckEmailExistanceLoading,
                isFetchingUserinContextLoading,
                user, setUser,
                isSessionInProgress, setIsSessionInProgress,
                isSignOutInProgress, setIsSignOutInProgress,
                isLogInBtnClicked, setIsLogInBtnClicked
            }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
