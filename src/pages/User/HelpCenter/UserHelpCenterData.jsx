import React from 'react';
import HelpCenterDataPageContent from '../../../components/HelpCenter/HelpCenterDataPageContent';
import { useUserContext } from '../../../lib/context/UserContext';

const UserHelpCenterData = () => {

    const { isLoggedIn } = useUserContext();
    return (
        <HelpCenterDataPageContent isLoggedIn={isLoggedIn} />
    )
}

export default UserHelpCenterData