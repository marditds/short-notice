import React, { useState, useEffect } from 'react';
import { Profile } from '../../../components/User/Profile';
import { Notices } from '../../../components/User/Notices';
import { Form, Modal, Button } from 'react-bootstrap';
import { useUserContext } from '../../../lib/context/UserContext';
import { useUserAvatar } from '../../../lib/hooks/useUserAvatar.js';
import useNotices from '../../../lib/hooks/useNotices.js';
import { Loading } from '../../../components/Loading/Loading.jsx'

const UserProfile = () => {

    const { googleUserData, username } = useUserContext();
    const [noticeText, setNoticeText] = useState('');
    const [editingNoticeId, setEditingNoticeId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const { user_id, userNotices, isLoading, addNotice, editNotice, removeNotice } = useNotices(googleUserData);

    const { avatarUrl, handleAvatarUpload, handleAvatarUpdate, handleDeleteAvatar } = useUserAvatar(user_id);


    const onTextareaChange = (e) => {
        setNoticeText(() => e.target.value);
    }

    const handleNotify = async () => {
        if (noticeText.trim()) {
            await addNotice(noticeText);
            setNoticeText('');
        }
    };


    const handleEditNotice = (noticeId, currentText) => {
        setEditingNoticeId(noticeId);
        setNoticeText(currentText);
        setShowModal(true);
    };


    const handleSaveEdit = () => {
        if (editingNoticeId && noticeText.trim()) {
            editNotice(editingNoticeId, noticeText);
            setEditingNoticeId(null);
            setNoticeText('');
            setShowModal(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingNoticeId(null);
        setNoticeText('');
    }

    if (isLoading) {
        return <div><Loading />Loading {username}'s profile</div>;
    }

    return (
        <>

            <Profile
                username={username}
                avatarUrl={avatarUrl}
                handleAvatarUpload={handleAvatarUpload}
                handleAvatarUpdate={handleAvatarUpdate}
                handleDeleteAvatar={handleDeleteAvatar}
            />

            <Form>
                <Form.Group className="mb-3" controlId="user__post--textarea">
                    <Form.Label>Example textarea</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={noticeText}
                        onChange={onTextareaChange}
                    />
                </Form.Group>
                <Button
                    onClick={handleNotify}
                    disabled={noticeText === ''}
                >
                    Notify
                </Button>
            </Form>

            <Notices
                notices={userNotices}
                handleEditNotice={handleEditNotice}
                handleDeleteNotice={removeNotice}
            />

            <Modal show={showModal} onHide={handleCloseModal}>
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
                    <Button onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button onClick={handleSaveEdit}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default UserProfile;