import { useState } from 'react';
import { useNotices } from '../../../lib/hooks/useNotices';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import { LoadingSpinner } from '../../Loading/LoadingSpinner';

export const DeleteAllNotices = ({ userId }) => {

    const { removeAllNoticesByUser } = useNotices();

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleShowModal = () => setShowModal(true);

    const handleCloseModal = () => setShowModal(false);

    const confirmAllNoticesDeletion = async () => {

        setLoading(true);

        try {
            await removeAllNoticesByUser(userId);
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
                    <h4 id='delete-notices-heading'>Delete All Notices:</h4>
                    <p id='delete-notices-warning' className='mb-2 mb-sm-0' role='alert'>WARNING: Deleting your notices will result in the loss of all data, which cannot be recovered. Please proceed with caution.</p>
                </Col>
                <Col className='d-grid align-content-end'>
                    <Button
                        onClick={handleShowModal}
                        className='settings__delete-notices-btn'
                        aria-describedby='delete-notices-warning'
                        aria-labelledby='delete-notices-heading'
                    >
                        Delete All Notices
                    </Button>
                </Col>
            </Row>

            <Modal show={showModal}
                onHide={handleCloseModal}
                className='settings__delete-notices-modal'
                aria-modal='true'
                role='dialog'
                aria-labelledby='delete-notices-modal-title'
                aria-describedby='delete-notices-modal-description'
                autoFocus={true}
            >
                <Modal.Header
                    className='border-bottom-0 settings__delete-notices-modal-header'
                >
                    <Modal.Title id='delete-notices-modal-title'>
                        ARE YOU SURE?
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body
                    className='settings__delete-notices-modal-body py-1'
                    id='delete-notices-modal-description'
                >
                    Are you sure you want to delete your notices? This action is irreversible and all your data will be lost. PERMANENTLY.
                </Modal.Body>

                <Modal.Footer className='d-flex align-items-center border-top-0 settings__delete-notices-modal-footer'>
                    <Button
                        onClick={handleCloseModal}
                        disabled={loading}
                        className='settings__delete-notices-btn final cancel d-flex justify-content-center align-items-center'
                        aria-label='Cancel deletion'
                        autoFocus
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmAllNoticesDeletion}
                        className='settings__delete-notices-btn final d-flex justify-content-center align-items-center'
                        disabled={loading}
                        aria-live='polite'
                        aria-disabled={loading}
                    >
                        {loading ?
                            <>
                                <LoadingSpinner />
                                <span className='visually-hidden' role='status' aria-live='polite'>
                                    Deleting all notices...
                                </span>
                            </>
                            : 'Yes, Delete All Notices'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
