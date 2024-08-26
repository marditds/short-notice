import React, { useState, useEffect } from 'react';
import { Loading } from '../../../components/Loading/Loading.jsx'
import { Avatar } from '../../../components/User/Settings/Avatar.jsx';
import { Info } from '../../../components/User/Settings/Info.jsx';
import { Visibility } from '../../../components/User/Settings/Visibility.jsx';

import { useUserContext } from '../../../lib/context/UserContext.jsx';
import useNotices from '../../../lib/hooks/useNotices.js';
import useUserAvatar from '../../../lib/hooks/useUserAvatar.js';

const UserSettings = () => {

    const { googleUserData } = useUserContext();
    const { user_id } = useNotices(googleUserData);
    const { avatarUrl, setAvatarUrl, isUploading, handleAvatarUpload, handleDeleteAvatarFromStrg, handleDeleteAvatarFromDoc } = useUserAvatar(user_id);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        console.log('THIS IS USER SETTINGS PAGE.');
        console.log('User ID:', user_id);


        setIsLoading(false);

    });

    if (isLoading) {
        return <div><Loading /></div>;
    }

    return (
        <>
            <Avatar
                avatarUrl={avatarUrl}
                setAvatarUrl={setAvatarUrl}
                handleAvatarUpload={handleAvatarUpload}
                handleDeleteAvatarFromStrg={handleDeleteAvatarFromStrg}
                handleDeleteAvatarFromDoc={handleDeleteAvatarFromDoc}
                isUploading={isUploading}
            />
            <Info />
            <Visibility />
        </>
    )
}

export default UserSettings