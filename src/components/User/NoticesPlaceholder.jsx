import { screenUtils } from '../../lib/utils/screenUtils';

export const NoticesPlaceholder = ({ location, otherUsername, section, icon, }) => {

    const { isSmallScreen } = screenUtils();

    const isOwnProfile = location.pathname === '/user/profile';
    const labelText = isOwnProfile ? 'Your' : `${otherUsername}'s`;
    const iconSize = !isSmallScreen ? 40 : 20;

    return (
        <div className='d-flex flex-column justify-content-center pb-0 pb-sm-5'>
            <p className='text-center mt-5'>
                {labelText} {section} <span style={{ fontSize: iconSize }}>{icon}</span> notices will appear here.
            </p>
            <span className='visually-hidden'>
                {labelText} {section} notices will appear here when available.
            </span>
        </div>
    )
}
