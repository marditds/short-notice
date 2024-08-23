import React from 'react';
import { Form } from 'react-bootstrap';
import defaultAvatar from '../../assets/default.png'

export const Profile = ({ username, avatarUrl, handleAvatarUpload }) => {
    return (
        <>
            <div className='userhome__body--profile--info w-100 d-grid justify-content-center gap-2'>
                <img src={avatarUrl ? avatarUrl : defaultAvatar} alt="Profile" style={{ borderRadius: '50%', width: 100, height: 100 }} />
                <p className='my-0 text-center'>{username}</p>
                <Form>
                    <Form.Group className="mb-3" controlId="profilePictureUpload">
                        <Form.Label>Upload Profile Picture</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handleAvatarUpload}
                        />
                    </Form.Group>
                </Form>
            </div>


        </>
    )
}
