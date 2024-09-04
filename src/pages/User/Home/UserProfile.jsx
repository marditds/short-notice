import React, { useState, useEffect } from 'react';
import { Profile } from '../../../components/User/Profile';
import { Notices } from '../../../components/User/Notices';
import { Form, Modal, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { useUserContext } from '../../../lib/context/UserContext';
import useUserAvatar from '../../../lib/hooks/useUserAvatar.js';
import useNotices from '../../../lib/hooks/useNotices.js';
import { Loading } from '../../../components/Loading/Loading.jsx'

const UserProfile = () => {

    const { googleUserData, username } = useUserContext();
    const [noticeText, setNoticeText] = useState('');
    const [duration, setDuration] = useState(1);
    const [editingNoticeId, setEditingNoticeId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const { user_id, userNotices, isLoading, isAddingNotice, removingNoticeId, addNotice, editNotice, removeNotice } = useNotices(googleUserData);

    const { avatarUrl } = useUserAvatar(user_id);



    const onTextareaChange = (e) => {
        setNoticeText(() => e.target.value);
        console.log('Curr notation:', duration);

    }

    const handleNotify = async () => {
        if (noticeText.trim()) {
            await addNotice(noticeText, duration);
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

            <Form className='mb-3'>
                <Form.Group className="mb-3" controlId="user__post--textarea">
                    <Form.Label>Example textarea</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={noticeText}
                        onChange={onTextareaChange}
                    />
                </Form.Group>

                <div className='d-flex align-items-center'>
                    <h6 className='mb-0'>Set Notice Timer</h6>

                    <Form.Select
                        aria-label="notice-timer--hh"
                        className='w-25 mx-2'
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                    >
                        {[...Array(7).keys()].map(i => (
                            <option value={i + 1} key={i + 1}>
                                {i + 1} minute(s)
                            </option>
                        ))}

                    </Form.Select>
                    <span>hrs</span>

                    <Button
                        onClick={handleNotify}
                        disabled={noticeText === '' || isAddingNotice}
                        className='ms-auto'
                    >
                        {isAddingNotice ? <Loading /> : 'Notify'}
                    </Button>
                </div>



            </Form>

            <Notices
                notices={userNotices}
                handleEditNotice={handleEditNotice}
                handleDeleteNotice={removeNotice}
                removingNoticeId={removingNoticeId}
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