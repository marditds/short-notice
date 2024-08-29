import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { useUserContext } from '../../../lib/context/UserContext';
import useUserInfo from '../../../lib/hooks/useUserInfo';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import { Loading } from '../../Loading/Loading';


export const DeleteAccount = () => {

    const { googleUserData } = useUserContext();
    const { handleDeleteUser } = useUserInfo(googleUserData);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDeleteAccount = async () => {

        setLoading(true);

        try {
            await handleDeleteUser();

            googleLogout();

            localStorage.removeItem('accessToken');

            console.log('hajoh');

            setTimeout(() => {
                setLoading(false);
                navigate('/');
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
            <Row>
                <Col>
                    <h4>Delete Account:</h4>
                    <p>WARNING: Deleting your account will result in the loss of all data, which cannot be recovered. Please proceed with caution.</p>
                </Col>
                <Col>
                    <Button
                        onClick={handleShowModal}
                    >
                        Delete Account
                    </Button>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>ARE YOU SURE?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete your account? This action is irreversible and all your data will be lost. PERMANENTLY.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDeletion}>
                        {loading ? <Loading /> : 'Yes, Delete My Account'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
