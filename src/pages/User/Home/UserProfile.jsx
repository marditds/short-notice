import React, { useState } from 'react';
import { Profile } from '../../../components/User/Profile';
import { Notices } from '../../../components/User/Notices';
import { Form, Modal, Button } from 'react-bootstrap';
import { useUserContext } from '../../../lib/context/UserContext';
import useUserAvatar from '../../../lib/hooks/useUserAvatar.js';
import useNotices from '../../../lib/hooks/useNotices.js';
import { Loading } from '../../../components/Loading/Loading.jsx'
import './UserProfile.css'


const CustomCheckbox = ({ label, name }) => {

    const handleCheckChange = () => {
        console.log(`${label} clicled.`);
    }

    return (
        <div>
            <Form.Check
                type='radio'
                // checked={checked}
                onChange={handleCheckChange}
                id={`custom-radio-${label}`}
                label={label}
                name={name}
            // style={{ display: 'none' }}
            />
            <label
                htmlFor={`custom-radio-${label}`}
                style={{ cursor: 'pointer' }}
                className='user-select-none'
            >
                {label}
            </label>
        </div>
    );
}

const UserProfile = () => {

    const { googleUserData, username } = useUserContext();
    const [noticeText, setNoticeText] = useState('');
    const [duration, setDuration] = useState(24);
    const [editingNoticeId, setEditingNoticeId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { user_id, userNotices, isLoading, isAddingNotice, removingNoticeId, isRemovingNotice, addNotice, editNotice, removeNotice, setRemovingNoticeId } = useNotices(googleUserData);

    const { avatarUrl } = useUserAvatar(user_id);

    const hours = Array.from({ length: 7 }, (_, i) => (i + 1) * 24);

    const tagsOne = ['Science', 'Technology', 'Engineering', 'Math', 'Other'];

    const tagsTwo = ['Literature', 'History', 'Philosophy', 'Music', 'Other'];

    const tagsThree = ['Medicine', 'Economics', 'Law', 'Political ', 'Other'];

    const onTextareaChange = (e) => {
        setNoticeText(() => e.target.value);
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

            <Form className='mb-3 user-profile__form'>
                <Form.Group
                    className="mb-3 user-profile__form-group"
                    controlId="noticeTextarea">
                    <Form.Label
                        className="user-profile__form-label">
                        Example textarea
                    </Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={noticeText}
                        onChange={onTextareaChange}
                        className="user-profile__form-control"
                    />
                </Form.Group>

                <div
                    className='user-profile__timer-settings'>
                    <h6
                        className='mb-0 user-profile__timer-label'>
                        Add tags:
                    </h6>

                    <div className='d-flex justify-content-between w-100'>
                        {tagsOne.map((tag) => {
                            return (
                                <CustomCheckbox
                                    key={tag}
                                    label={tag}
                                    name='tagsOne'
                                />
                            )
                        })}
                    </div>

                    <div className='d-flex justify-content-between w-100'>
                        {tagsTwo.map((tag, index) =>
                            <Form.Check
                                key={tag}
                                type='checkbox'
                                id={`tagsTwo-checkbox-${index}`}
                                label={tag}
                            />
                        )}
                    </div>

                    <div className='d-flex justify-content-between w-100'>
                        {tagsThree.map((tag, index) =>
                            <Form.Check
                                key={tag}
                                type='checkbox'
                                id={`tagsThree-checkbox-${index}`}
                                label={tag}
                            />
                        )}
                    </div>

                </div>



                <div
                    className='d-flex align-items-center user-profile__timer-settings'>
                    <h6
                        className='mb-0 user-profile__timer-label'>
                        Set Notice Timer
                    </h6>

                    <Form.Select
                        aria-label="notice-timer-hh"
                        className='w-25 mx-2 user-profile__timer-select'
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                    >
                        {hours.map(hour => (
                            <option value={hour} key={hour}>
                                {hour}
                            </option>
                        ))}

                    </Form.Select>
                    <span>hrs</span>

                    <Button
                        onClick={handleNotify}
                        disabled={noticeText === '' || isAddingNotice}
                        className='ms-auto user-profile__notify-btn'
                    >
                        {isAddingNotice ? <Loading /> : 'Notify'}
                    </Button>
                </div>



            </Form>

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