import React from 'react';

export const NoticesPlaceholder = ({ location, otherUsername, section, icon, }) => {
    return (
        <p className='text-center mt-5'>
            {location.pathname === '/user/profile' ? 'Your' : otherUsername + '\'s'} {section} {icon} notices will appear here.
        </p>
    )
}
