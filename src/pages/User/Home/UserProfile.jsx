import React, { useState } from 'react';
import { Profile } from '../../../components/User/Profile';
import { Notices } from '../../../components/User/Notices';
import { Form, Modal, Button, Accordion } from 'react-bootstrap';
import { useUserContext } from '../../../lib/context/UserContext';
import useUserAvatar from '../../../lib/hooks/useUserAvatar.js';
import useNotices from '../../../lib/hooks/useNotices.js';
import { NoticeTags } from '../../../components/User/NoticeTags.jsx';
import { Loading } from '../../../components/Loading/Loading.jsx'
import './UserProfile.css'
import { ComposeNotice } from '../../../components/User/ComposeNotice';



const UserProfile = () => {

    const { googleUserData, username } = useUserContext();
    const [noticeText, setNoticeText] = useState('');
    const [duration, setDuration] = useState(24);
    const [editingNoticeId, setEditingNoticeId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { user_id, userNotices, isLoading, isAddingNotice, removingNoticeId, isRemovingNotice, addNotice, editNotice, removeNotice, setRemovingNoticeId } = useNotices(googleUserData);

    const { avatarUrl } = useUserAvatar(user_id);


    const handleEditNotice = (noticeId, currentText) => {
        setEditingNoticeId(noticeId);
        setNoticeText(currentText);
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        if (editingNoticeId && noticeText.trim()) {
            editNotice(editingNoticeId, noticeText);
            setEditingNoticeId(null);
            setNoticeText('');
            setShowEditModal(false);
        }
    };

    const handleDeleteNotice = (noticeId) => {
        setRemovingNoticeId(noticeId);
        setShowDeleteModal(true);
    }

    const handleDelete = async () => {
        if (removingNoticeId) {
            await removeNotice(removingNoticeId);
            setRemovingNoticeId(null);
            setShowDeleteModal(false);
        }
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingNoticeId(null);
        setNoticeText('');
    }

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setRemovingNoticeId(null);
    }

    const timerSpacing = 'mx-2';
    const timerDisplay = 'd-flex';
    const classname = `${timerDisplay} ${timerSpacing}`;

    if (isLoading) {
        return <div><Loading />Loading {username}'s profile</div>;
    }

    return (
        <>

            <Profile
                username={username}
                avatarUrl={avatarUrl}
            />

            <ComposeNotice
                duration={duration}
                isAddingNotice={isAddingNotice}
                noticeText={noticeText}
                setNoticeText={setNoticeText}
                setDuration={setDuration}
                addNotice={addNotice}
            />


            <Notices
                notices={userNotices}
                handleEditNotice={handleEditNotice}
                handleDeleteNotice={handleDeleteNotice}
            />

            {/* Edit Notice Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header>
                    <Modal.Title>Edit Notice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className='mb-3' controlId='editNotice'>
                            <Form.Label>Notice Text</Form.Label>
                            <Form.Control
                                as='textarea'
                                rows={3}
                                value={noticeText}
                                onChange={(e) => setNoticeText(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCloseEditModal}>
                        Cancel
                    </Button>
                    <Button onClick={handleSaveEdit}>Save</Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Notice Modal */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                <Modal.Header>
                    <Modal.Title>Delete Notice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Are you sure you want to delete this notice❓</h4>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCloseDeleteModal}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={isRemovingNotice}
                    >
                        {isRemovingNotice ? <Loading /> : 'Delete'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UserProfile;