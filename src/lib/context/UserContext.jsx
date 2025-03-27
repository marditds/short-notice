import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useEffect, useState } from 'react';
import { getAccount, getUserByEmail, getUserById } from './dbhandler';
// import useUserInfo from '../hooks/useUserInfo';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [googleUserData, setGoogleUserData] = useState([]);
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
    const [isSessionInProgress, setIsSessionInProgress] = useState(false);

    // const { getUserAccountByUserId } = useUserInfo();


    // useEffect(() => {
    //     console.log('UserContext useEffect triggered');
    //     console.log('Current googleUserData:', googleUserData);
    //     console.log('Current userId:', userId);
    //     console.log('Current isLoggedIn:', isLoggedIn);

    //     const fetchUserInfo = async () => {
    //         console.log('Entering fetchUserInfo');

    //         if (!googleUserData && !isLoggedIn) {
    //             return;
    //         }

    //         try {
    //             setIsAppLoading(true);
    //             const user = await getUserByEmail(googleUserData.email);

    //             console.log('user in USERCONTEXT', user);

    //             if (user?.$id) {
    //                 console.log('Setting user info from account');
    //                 setUserId(user.$id);
    //                 setUserEmail(user.email);
    //                 setUsername(user.username);
    //                 setIsLoggedIn(true);
    //                 console.log('User ID fetched:', user.$id);
    //             } else {
    //                 // Reset states if no valid account found
    //                 console.log('No valid account found');
    //                 setUserId(null);
    //                 setUserEmail(null);
    //                 setIsLoggedIn(false);
    //             }

    //         } catch (error) {
    //             console.error('Error fetching user ID:', error);
    //             setUserId(null);
    //             setUserEmail(null);
    //             setIsLoggedIn(false);
    //         } finally {
    //             setIsAppLoading(false);
    //             console.log('fetchUserInfo completed');
    //         }
    //     };

    //     if (googleUserData && (!userId || !isLoggedIn)) {
    //         console.log('Calling fetchUserInfo');
    //         fetchUserInfo();
    //     } else {
    //         console.log('Skipping fetchUserInfo');
    //     }
    // }, [googleUserData]);

    // useEffect(() => {
    //     console.log('User state changed:');
    //     console.log('userId:', userId);
    //     console.log('isLoggedIn:', isLoggedIn);
    //     console.log('userEmail:', userEmail);
    // }, [userId, isLoggedIn, userEmail]);

    // Checkig Session Status

    useEffect(() => {
        const checkingSessionStatus = async () => {
            try {
                const usr = await getAccount();
                if (usr) {
                    console.log('Session in progress.');
                    setIsSessionInProgress(true);
                    setUserEmail(usr.email);
                    setUserId(usr.$id);
                    setGivenName(usr.name);
                    setUser(usr);
                    setIsLoggedIn(true);
                } else {
                    setIsSessionInProgress(false);
                }
            } catch (error) {
                console.error('Error checking session status:', error);
            }
        };
        checkingSessionStatus();
    }, [])

    // Fetch username, account type, and website by user Id
    useEffect(() => {
        const fetchUserByUserId = async () => {
            try {
                const usr = await getUserById(userId);
                console.log('usr in UserContext:', usr);

                setAccountType(usr.accountType);
                setUserWebsite(usr.website);
                setUsername(usr.username);

            } catch (error) {
                console.log('Error fetching user by id', error);
            }
        }
        console.log('website in UserProfile.jsx', userWebsite);

        fetchUserByUserId();
    }, [userId])

    return (
        <UserContext.Provider
            value={{
                googleUserData, setGoogleUserData,
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
                user, setUser,
                isSessionInProgress, setIsSessionInProgress
            }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
