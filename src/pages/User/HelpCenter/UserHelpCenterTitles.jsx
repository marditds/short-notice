import React from 'react';
import HelpCenterTitlesPageContent from '../../../components/HelpCenter/HelpCenterTitlesPageContent';
import { Outlet, useParams } from 'react-router-dom';
import { useUserContext } from '../../../lib/context/UserContext';

const UserHelpCenterTitles = () => {

    const { isLoggedIn } = useUserContext();

    let { helpCenterTitlesPath } = useParams();


    return (
        <>
            {location.pathname === `/user/help-center/${helpCenterTitlesPath}` && <HelpCenterTitlesPageContent isLoggedIn={isLoggedIn} />}
            <Outlet />
        </>
    )
}

export default UserHelpCenterTitles