import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [googleUserData, setGoogleUserData] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [hasUsername, setHasUsername] = useState(false);



    return (
        <UserContext.Provider
            value={{
                googleUserData, setGoogleUserData,
                isLoggedIn, setIsLoggedIn,
                username, setUsername,
                hasUsername, setHasUsername
            }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
