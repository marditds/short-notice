import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { Loading } from '../Loading/Loading';
import defaultAvatar from '../../assets/default.png';


export const Settings = ({ avatarUrl, setAvatarUrl, isUploading, handleAvatarUpload, handleDeleteAvatarFromStrg, handleDeleteAvatarFromDoc }) => {

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (avatarUrl) {
            const fileId = extractFileIdFromUrl(avatarUrl);
            await handleDeleteAvatarFromStrg(fileId);
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

    const handleDeleteAvatar = async (user_id) => {
        if (avatarUrl) {
            const fileId = extractFileIdFromUrl(avatarUrl);
            await handleDeleteAvatarFromStrg(fileId);
            await handleDeleteAvatarFromDoc(user_id);
            setAvatarUrl('');
        }
    }

    return (
        <>
            <img src={avatarUrl ? avatarUrl : defaultAvatar} alt="Profile" style={{ borderRadius: '50%', width: 100, height: 100 }} />
            <Form>
                <Form.Group className="mb-3" controlId="profilePictureUpload">

                    {isUploading ?
                        (
                            <>
                                Updating avatar <Loading />
                            </>
                        )
                        : (
                            <>
                                <Form.Label>Upload Profile Picture</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleFileChange}
                                />
                            </>
                        )}
                </Form.Group>
                <Button onClick={handleDeleteAvatar}>Delete Avatar</Button>
            </Form>
        </>
    )
}
