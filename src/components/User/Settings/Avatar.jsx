import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Loading } from '../../Loading/Loading';
import defaultAvatar from '../../../assets/default.png';
import { useUserContext } from '../../../lib/context/UserContext';
import useUserAvatar from '../../../lib/hooks/useUserAvatar';
import { UserId } from '../UserId';


export const Avatar = () => {

    const { googleUserData } = useUserContext();

    const [user_id, setUserId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { avatarUrl, setAvatarUrl, isUploading, handleAvatarUpload, handleDeleteAvatarFromStrg, handleDeleteAvatarFromDoc, extractFileIdFromUrl } = useUserAvatar(user_id);


    useEffect(() => {

        const fetchUserId = async () => {
            try {
                const id = await UserId(googleUserData);
                setUserId(id);
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        fetchUserId();

    }, [googleUserData]);


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


    const handleDeleteAvatar = async (user_id) => {

        setIsDeleting(true);

        try {
            if (avatarUrl) {
                const fileId = extractFileIdFromUrl(avatarUrl);
                await handleDeleteAvatarFromStrg(fileId);
                await handleDeleteAvatarFromDoc(user_id);
                setAvatarUrl('');
            }
        } catch (error) {
            console.error("Error deleting avatar:", error);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Row>
            <Col>
                <h4>Update Avatar:</h4>
                <p>Add, update, or delete your avatar.</p>
            </Col>
            <Col className='d-flex justify-content-start align-items-center'>
                <img
                    src={avatarUrl ? avatarUrl : defaultAvatar}
                    alt="Profile"
                    style={{ borderRadius: '50%', width: 100, height: 100 }}
                    className='me-5'
                />
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
                    <Button
                        onClick={handleDeleteAvatar}
                        disabled={isDeleting ? true : false}
                        className='float-start settings__delete-avatar-btn'
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Avatar'}
                        {isDeleting && <Loading />}
                    </Button>
                </Form>

            </Col>

        </Row>
    )
}
