import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useEffect, useState } from 'react';
import { getUserByEmail } from './dbhandler';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [googleUserData, setGoogleUserData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [registeredUsername, setRegisteredUsername] = useState('');
    const [hasUsername, setHasUsername] = useState(false);
    const [hasAccountType, setHasAccountType] = useState(false);
    const [accountType, setAccountType] = useState('');
    const [isAppLoading, setIsAppLoading] = useState(false);

    // useEffect(() => {
    //     const accessToken = localStorage.getItem('accessToken');
    //     if (!accessToken) {
    //         setIsAppLoading(false);
    //         return;
    //     }

    //     const decoded = jwtDecode(accessToken);
    //     getUserByEmail(decoded.email)
    //         .then((user) => {
    //             if (user) {
    //                 setUsername(user.username);
    //                 setAccountType(user.accountType);
    //                 setGoogleUserData(user);
    //                 setIsLoggedIn(true);
    //             }
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching user data:', error);
    //         })
    //         .finally(() => {
    //             setIsAppLoading(false);
    //         });
    // }, []);

    return (
        <UserContext.Provider
            value={{
                googleUserData, setGoogleUserData,
                isLoggedIn, setIsLoggedIn,
                username, setUsername,
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
