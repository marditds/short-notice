import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import HelpCenterHomePageContent from '../../../components/HelpCenter/HelpCenterHomePageContent';
import UserHelpCenterTitles from './UserHelpCenterTitles';
import UserHelpCenterData from './UserHelpCenterData';

const UserHelpCenter = () => {

    const location = useLocation();

    let { helpCenterTitlesPath, helpCenterDataPath } = useParams();

    return (
        <div style={{ marginTop: '42px', paddingTop: '22px' }}>
            {
                location.pathname === '/user/help-center' && <HelpCenterHomePageContent />
            }
            {
                location.pathname === `/user/help-center/${helpCenterTitlesPath}` && <UserHelpCenterTitles />
            }
            {
                location.pathname === `/user/help-center/${helpCenterTitlesPath}/${helpCenterDataPath}` && <UserHelpCenterData />
            }
        </div>
    )
}

export default UserHelpCenter;