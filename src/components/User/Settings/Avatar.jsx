import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Loading } from '../../Loading/Loading';
import defaultAvatar from '../../../assets/default.png';
import { useUserContext } from '../../../lib/context/UserContext';
import { useUserAvatar } from '../../../lib/hooks/useUserAvatar';
import { UserId } from '../UserId';
import { getAvatarUrl } from '../../../lib/utils/avatarUtils';


export const Avatar = () => {

    const { googleUserData, userId } = useUserContext();

    const [user_id, setUserId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { avatarUrl, setAvatarUrl, isUploading, handleAvatarUpload, handleDeleteAvatarFromStrg, handleDeleteAvatarFromDoc, extractFileIdFromUrl } = useUserAvatar(userId);


    // useEffect(() => {

    //     const fetchUserId = async () => {
    //         try {
    //             const id = await UserId(googleUserData);
    //             setUserId(id);
    //         } catch (error) {
    //             console.error('Error fetching user ID:', error);
    //         }
    //     };

    //     fetchUserId();

    // }, [googleUserData]);


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
                <img
                    src={avatarUrl ? avatarUrl : defaultAvatar}
                    alt='user_avatar'
                    className='setting__avatar-display me-3'
                />
                <Form as={Row} className='flex-column settings__upload-avatar-form'>
                    <Form.Group as={Col} className="mb-2 mb-md-3" controlId="profilePictureUpload">

                        {isUploading ?
                            (
                                <>
                                    Updating avatar <Loading />
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
                            {isDeleting && <Loading />}
                        </Button>
                    </Col>
                </Form>

            </Col>

        </Row>
    )
}
