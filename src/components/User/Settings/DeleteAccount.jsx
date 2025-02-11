import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { useUserContext } from '../../../lib/context/UserContext';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import useUserAvatar from '../../../lib/hooks/useUserAvatar';
import { UserId } from '../UserId';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import { Loading } from '../../Loading/Loading';


export const DeleteAccount = () => {

    const { googleUserData } = useUserContext();
    const { handleDeleteUser } = useUserInfo(googleUserData);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user_id, setUserId] = useState(null);

    const { avatarUrl, setAvatarUrl, handleDeleteAvatarFromStrg, extractFileIdFromUrl } = useUserAvatar(user_id);

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


    const handleDeleteAccount = async () => {

        setLoading(true);

        try {

            let handleDeleteAvatarPromise = Promise.resolve();

            if (avatarUrl) {
                const fileId = extractFileIdFromUrl(avatarUrl);
                handleDeleteAvatarPromise = handleDeleteAvatarFromStrg(fileId)
                    .then(() => setAvatarUrl(''))
                    .catch((err) => console.error("Error deleting avatar:", err));
            }

            const handleDeleteUserPromise = handleDeleteUser();

            await Promise.allSettled([handleDeleteAvatarPromise, handleDeleteUserPromise]);

            googleLogout();

            localStorage.removeItem('accessToken');

            console.log('hajoh');

            setTimeout(() => {
                setLoading(false);
                navigate('/');
                window.location.reload();
            }, 3000);
        } catch (error) {
            console.error('User not deleted:', error);
        }
    }

    const handleShowModal = () => setShowModal(true);

    const handleCloseModal = () => setShowModal(false);

    const confirmDeletion = async () => {
        await handleDeleteAccount();
    };

    return (
        <>
            <Row xs={1} sm={2}>
                <Col>
                    <h4>Delete Account:</h4>
                    <p className='mb-2 mb-sm-0'>WARNING: Deleting your account will result in the loss of all data, which cannot be recovered. Please proceed with caution.</p>
                </Col>
                <Col className='d-grid align-content-end'>
                    <Button
                        onClick={handleShowModal}
                        className='settings__delete-account-btn'
                    >
                        Delete Account
                    </Button>
                </Col>
            </Row>

            <Modal show={showModal}
                onHide={handleCloseModal}
                className='settings__delete-account-modal'
            >
                <Modal.Header
                    className='settings__delete-account-modal-header border-bottom-0'
                >
                    <Modal.Title>ARE YOU SURE?</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    className='settings__delete-account-modal-body py-1'
                >
                    Are you sure you want to delete your account? This action is irreversible and all your data will be lost. PERMANENTLY.
                </Modal.Body>
                <Modal.Footer
                    className='settings__delete-account-modal-footer border-top-0'
                >
                    <Button onClick={handleCloseModal}
                        disabled={loading}
                        className='settings__delete-account-btn final cancel d-flex justify-content-center align-items-center'
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmDeletion}
                        className='settings__delete-account-btn final d-flex justify-content-center align-items-center'
                    >
                        {loading ? <Loading /> : 'Yes, Delete My Account'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
