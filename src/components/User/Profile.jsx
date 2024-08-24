import React from 'react';
import { Form } from 'react-bootstrap';
import defaultAvatar from '../../assets/default.png';
import { Loading } from '../Loading/Loading';

export const Profile = ({ username, avatarUrl, isUploading, handleAvatarUpload, handleDeleteAvatar }) => {

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (avatarUrl) {
            const fileId = extractFileIdFromUrl(avatarUrl);
            await handleDeleteAvatar(fileId);
            await handleAvatarUpload(e);
        } else {
            handleAvatarUpload(e);
        }
    };

    const extractFileIdFromUrl = (url) => {
        const parts = url.split('/');
        const fileId = parts[parts.length - 2];
        return fileId;
    };

    return (
        <>
            <div className='userhome__body--profile--info w-100 d-grid justify-content-center gap-2'>
                <img src={avatarUrl ? avatarUrl : defaultAvatar} alt="Profile" style={{ borderRadius: '50%', width: 100, height: 100 }} />
                <p className='my-0 text-center'>{username}</p>
                <Form>
                    <Form.Group className="mb-3" controlId="profilePictureUpload">
                        <Form.Label>Upload Profile Picture</Form.Label>
                        {isUploading ?
                            (
                                <Loading />

                            )
                            : (
                                <Form.Control
                                    type="file"
                                    onChange={handleFileChange}
                                />
                            )}
                    </Form.Group>
                </Form>
            </div>


        </>
    )
}
