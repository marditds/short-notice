import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [googleUserData, setGoogleUserData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [registeredUsername, setRegisteredUsername] = useState('');
    const [hasUsername, setHasUsername] = useState(false);
    const [hasAccountType, setHasAccountType] = useState(false);
    const [accountType, setAccountType] = useState('');
    const [website, setWebsite] = useState(null);



    return (
        <UserContext.Provider
            value={{
                googleUserData, setGoogleUserData,
                isLoggedIn, setIsLoggedIn,
                username, setUsername,
                registeredUsername, setRegisteredUsername,
                hasUsername, setHasUsername,
                accountType, setAccountType,
                hasAccountType, setHasAccountType
            }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
