import { createContext, useContext, useCallback, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [googleUserData, setGoogleUserData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [hasUsername, setHasUsername] = useState(false);


    const resetState = useCallback(() => {
        setGoogleUserData(null);
        setIsLoggedIn(false);
        setUsername('');
        setHasUsername(false);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
    }, []);

    return (
        <UserContext.Provider
            value={{
                googleUserData, setGoogleUserData,
                isLoggedIn, setIsLoggedIn,
                username, setUsername,
                hasUsername, setHasUsername,
                resetState
            }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
