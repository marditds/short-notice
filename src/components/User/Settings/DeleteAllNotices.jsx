import React, { useState } from 'react';
import { useUserContext } from '../../../lib/context/UserContext';
import useNotices from '../../../lib/hooks/useNotices';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import { Loading } from '../../Loading/Loading';

export const DeleteAllNotices = () => {

    const { googleUserData } = useUserContext();
    const { user_id, removeAllNoticesByUser } = useNotices(googleUserData);

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleShowModal = () => setShowModal(true);

    const handleCloseModal = () => setShowModal(false);

    const confirmAllNoticesDeletion = async () => {

        setLoading(true);

        try {
            await removeAllNoticesByUser(user_id);
        } catch (error) {
            console.error('Error all notice deletion:', error);
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    };

    return (
        <>
            <Row xs={1} sm={2}>
                <Col>
                    <h4>Delete All Notices:</h4>
                    <p>WARNING: Deleting your notices will result in the loss of all data, which cannot be recovered. Please proceed with caution.</p>
                </Col>
                <Col className='d-grid align-content-end'>
                    <Button
                        onClick={handleShowModal}
                        className='settings__delete-notices-btn'
                    >
                        Delete All Notices
                    </Button>
                </Col>
            </Row>

            <Modal show={showModal}
                onHide={handleCloseModal}
                className='settings__delete-notices-modal'
            >
                <Modal.Header
                    className='border-bottom-0 settings__delete-notices-modal-header'
                >
                    <Modal.Title>ARE YOU SURE?</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    className='settings__delete-notices-modal-body py-1'
                >
                    Are you sure you want to delete your notices? This action is irreversible and all your data will be lost. PERMANENTLY.
                </Modal.Body>
                <Modal.Footer className='d-flex align-items-center border-top-0 settings__delete-notices-modal-footer'>
                    <Button
                        onClick={handleCloseModal}
                        disabled={loading}
                        className='settings__delete-notices-btn final cancel d-flex justify-content-center align-items-center'
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmAllNoticesDeletion}
                        className='settings__delete-notices-btn final d-flex justify-content-center align-items-center'
                    >
                        {loading ? <Loading /> : 'Yes, Delete All Notices'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
