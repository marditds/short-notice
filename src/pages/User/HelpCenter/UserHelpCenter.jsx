import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import HelpCenterHomePageContent from '../../../components/HelpCenter/HelpCenterHomePageContent';

const UserHelpCenter = () => {

    const location = useLocation();

    return (
        <div style={{ marginTop: '42px', paddingTop: '22px' }}>
            {
                location.pathname === '/user/help-center' && <HelpCenterHomePageContent />
            }
            <Outlet />
        </div>
    )
}

export default UserHelpCenter;