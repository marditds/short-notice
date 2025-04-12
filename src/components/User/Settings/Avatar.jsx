import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { LoadingSpinner } from '../../Loading/LoadingSpinner';
import defaultAvatar from '../../../assets/default.png';
import { useUserContext } from '../../../lib/context/UserContext';
import { useUserAvatar } from '../../../lib/hooks/useUserAvatar';

export const Avatar = () => {

    const { userId } = useUserContext();

    const [isDeleting, setIsDeleting] = useState(false);

    const {
        avatarUrl, isUploading, isAvatarLoading,
        setAvatarUrl,
        handleAvatarUpload, handleDeleteAvatarFromStrg, handleDeleteAvatarFromDoc,
        extractFileIdFromUrl
    } = useUserAvatar(userId);

    const handleFileChange = async (e) => {

        console.log('Changing avatar...');

        const file = e.target.files[0];

        if (!file) return;

        if (avatarUrl) {
            const fileId = extractFileIdFromUrl(avatarUrl);
            await Promise.allSettled([
                handleDeleteAvatarFromStrg(fileId),
                handleAvatarUpload(e)
            ]);
        } else {
            await handleAvatarUpload(e);
        }
    };

    const handleDeleteAvatar = async (user_id) => {

        setIsDeleting(true);

        try {
            if (avatarUrl) {
                const fileId = extractFileIdFromUrl(avatarUrl);
                await Promise.allSettled([
                    handleDeleteAvatarFromStrg(fileId),
                    handleDeleteAvatarFromDoc(user_id)
                ]);
                setAvatarUrl('');
            }
        } catch (error) {
            console.error("Error deleting avatar:", error);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Row xs={1} sm={2} >
            <Col className='d-block align-items-baseline'>
                <h4>Update Avatar:</h4>
                <p className=''>Add, update, or delete your avatar.</p>
            </Col>
            <Col className='d-flex justify-content-start align-items-center mt-2 mt-sm-0'>
                {!isAvatarLoading ?
                    <img
                        src={avatarUrl ? avatarUrl : defaultAvatar}
                        alt='user_avatar'
                        className='setting__avatar-display me-3'
                    />
                    :
                    <LoadingSpinner classAnun={'me-3'} />
                }

                <Form as={Row} className='flex-column settings__upload-avatar-form'>
                    <Form.Group as={Col} className="mb-2 mb-md-3" controlId="profilePictureUpload">

                        {isUploading ?
                            (
                                <>
                                    Updating avatar <LoadingSpinner />
                                </>
                            )
                            : (
                                <>
                                    <Form.Label className='settings__upload-avatar-label mb-1 mb-md-2'>Upload Avatar</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={handleFileChange}
                                        className='settings__upload-avatar-field'

                                    />
                                </>
                            )}
                    </Form.Group>
                    <Col className="">
                        <Button
                            onClick={handleDeleteAvatar}
                            disabled={isDeleting ? true : false}
                            className='float-start settings__delete-avatar-btn'
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Avatar'}
                            {isDeleting && <LoadingSpinner />}
                        </Button>
                    </Col>
                </Form>

            </Col>

        </Row>
    )
}
