import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useEffect, useState } from 'react';
import { getUserByEmail } from './dbhandler';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [googleUserData, setGoogleUserData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [username, setUsername] = useState('');
    const [givenName, setGivenName] = useState('');
    const [registeredUsername, setRegisteredUsername] = useState('');
    const [hasUsername, setHasUsername] = useState(false);
    const [hasAccountType, setHasAccountType] = useState(false);
    const [accountType, setAccountType] = useState('');
    const [isAppLoading, setIsAppLoading] = useState(false);

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

    return (
        <UserContext.Provider
            value={{
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
            }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
