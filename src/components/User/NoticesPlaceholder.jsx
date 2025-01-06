import React from 'react';
import { screenUtils } from '../../lib/utils/screenUtils';

export const NoticesPlaceholder = ({ location, otherUsername, section, icon, }) => {

    const { isSmallScreen } = screenUtils();

    return (
        <div className='d-flex flex-column justify-content-center pb-0 pb-sm-5'>
            <p className='text-center mt-5'>
                {location.pathname === '/user/profile' ? 'Your' : otherUsername + '\'s'} {section} <span style={{ fontSize: !isSmallScreen ? 40 : 20 }}>{icon}</span> notices will appear here.
            </p>
        </div>
    )
}
