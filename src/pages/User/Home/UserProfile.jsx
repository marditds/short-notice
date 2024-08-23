import React, { useState, useEffect } from 'react';
import { Profile } from '../../../components/User/Profile';
import { Notices } from '../../../components/User/Notices';
import { UserId } from '../../../components/User/UserId';
import { Form, Modal, Button } from 'react-bootstrap';
import { useUserContext } from '../../../lib/context/UserContext';
import { createNotice, getUserNotices, updateNotice, deleteNotice } from '../../../lib/context/dbhandler';
import { useUserAvatar } from '../../../lib/hooks/useUserAvatar.js';

const UserProfile = () => {

    const [isLoading, setIsLoading] = useState(true);
    const { googleUserData, username } = useUserContext();
    const [user_id, setUserId] = useState(null);
    const [noticeText, setNoticeText] = useState('');
    const [editingNoticeId, setEditingNoticeId] = useState(null);
    const [userNotices, setUserNotices] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const { avatarUrl, handleAvatarUpload } = useUserAvatar(user_id);


    useEffect(() => {
        const fetchUserNotices = async () => {
            if (googleUserData) {
                const id = UserId(googleUserData);

                setUserId(id);

                try {
                    const notices = await getUserNotices(id);
                    setUserNotices(notices);
                } catch (error) {
                    console.error('Error fetching user notices:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchUserNotices();
    }, [googleUserData]);


    const onTextareaChange = (e) => {
        setNoticeText(() => e.target.value);
    }

    const handleNotify = async () => {
        if (user_id) {
            const newNotice = {
                user_id: user_id,
                text: noticeText,
                timestamp: new Date()
            };

            await createNotice(newNotice);

            setUserNotices(prevNotices => [newNotice, ...prevNotices,]);

            setNoticeText('');
        }
    };

    const handleDeleteNotice = async (noticeId) => {
        await deleteNotice(noticeId);
        setUserNotices(prevNotices => prevNotices.filter(notice => notice.$id !== noticeId));
    };

    const handleEditNotice = (noticeId, currentText) => {
        setEditingNoticeId(noticeId);
        setNoticeText(currentText);
        setShowModal(true);
    };

    const handleSaveEdit = async () => {
        if (editingNoticeId && noticeText.trim()) {
            await updateNotice(editingNoticeId, noticeText);
            setUserNotices(prevNotices =>
                prevNotices.map(notice =>
                    notice.$id === editingNoticeId
                        ? { ...notice, text: noticeText }
                        : notice
                )
            );
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
        return <div>Loading user profile...</div>;
    }

    return (
        <>
            <Profile
                username={username}
                avatarUrl={avatarUrl}
                handleAvatarUpload={handleAvatarUpload}
            />

            Hello {username}

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
                handleDeleteNotice={handleDeleteNotice}
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