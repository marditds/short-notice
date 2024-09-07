import React from 'react';
import defaultAvatar from '../../assets/default.png';

export const Profile = ({ username, avatarUrl }) => {

    return (
        <>
            <div className='user-profile w-100 d-grid justify-content-center gap-2'>
                <img src={avatarUrl ? avatarUrl : defaultAvatar} alt="Profile" style={{ borderRadius: '50%', width: 100, height: 100 }} />
                <p className='my-0 text-center'>{username}</p>
            </div>


        </>
    )
}
