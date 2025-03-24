import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useEffect, useState } from 'react';
// import { getUserByEmail } from './dbhandler';
import { getAccount } from './dbhandler';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [googleUserData, setGoogleUserData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [username, setUsername] = useState('');
    const [registeredUsername, setRegisteredUsername] = useState('');
    const [hasUsername, setHasUsername] = useState(false);
    const [hasAccountType, setHasAccountType] = useState(false);
    const [accountType, setAccountType] = useState('');
    const [isAppLoading, setIsAppLoading] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setIsAppLoading(true);
                const account = await getAccount();
                console.log('account in USERCONTEXT', account);

                if (account?.$id) {
                    setUserId(account.$id);
                    setUserEmail(account.email);
                    setUsername(account.name);
                    setIsLoggedIn(true);
                    console.log('User ID fetched:', account.$id);
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
            } finally {
                setIsAppLoading(false);
            }
        };

        // Only fetch if not already logged in
        if (!userId && !isLoggedIn) {
            fetchUserInfo();
        }
    }, [userId, isLoggedIn]);


    return (
        <UserContext.Provider
            value={{
                googleUserData, setGoogleUserData,
                isLoggedIn, setIsLoggedIn,
                userId, setUserId,
                userEmail, setUserEmail,
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
