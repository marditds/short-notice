import React from 'react';
import { Link } from 'react-router-dom';
import { reportCategories } from '../Support/communityGuidelines';
import { Modal, Form, Button } from 'react-bootstrap';
import { Loading } from '../Loading/Loading';
import { SlClose } from "react-icons/sl";
import { EndAsterisks } from './EndAsterisks';


export const ReportModal = ({
    showReportModalFunction,
    handleCloseReportModalFunction,
    showReportConfirmationCheck,
    handleReportSubmissionFunction,
    setReportReason,
    isProcessing }) => {
    return (
        <Modal show={showReportModalFunction}
            onHide={handleCloseReportModalFunction}
            className='notice__report--modal p-0'
        >
            <Modal.Header className='border-bottom-0'>
                <Modal.Title>Report Notice</Modal.Title>
            </Modal.Header>
            <Modal.Body className='notice__report--modal-body py-0'>
                {showReportConfirmationCheck ? (
                    <p>Your report has been successfully submitted!</p>
                ) : (
                    <Form
                        className='notice__report--modal-form'
                    >
                        <Form.Group className='mb-3' controlId='reportNotice'>
                            <Form.Label>Please select a reason:</Form.Label>
                            {reportCategories.map((category) => (
                                <Form.Check
                                    key={category.key}
                                    type='radio'
                                    label={category.name}
                                    id={category.name}
                                    name='reportReason'
                                    onChange={() => setReportReason(category.key)}
                                    className='notice__report--radio'
                                />
                            ))}
                        </Form.Group>
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer className='border-top-0 notice__report--modal-footer'>
                {showReportConfirmationCheck ? null : (
                    <>
                        <Button onClick={handleCloseReportModalFunction}
                            className='notice__report--modal-btn'
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleReportSubmissionFunction}
                            className='notice__report--modal-btn'
                        // disabled={!reportReason}
                        >
                            {isProcessing ? <Loading /> : 'Report'}
                        </Button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    )
}

export const ModifyModal = ({ modifyModalTitle, showModifyModal, handleCloseModifyModal, handleSaveEdit, noticeText, setNoticeText, handleDelete, isRemovingNotice, isSavingEdit }) => {
    return (
        <Modal show={showModifyModal}
            onHide={handleCloseModifyModal}
            className='notice__edit--modal'
        >
            <Modal.Header
                className='notice__edit--modal-header'
            >
                <Modal.Title>{modifyModalTitle} Notice</Modal.Title>
            </Modal.Header>
            <Modal.Body
                className='notice__edit--modal-body'
            >
                {
                    modifyModalTitle === 'Edit' &&
                    <Form>
                        <Form.Group className='mb-0 mb-md-3' controlId='editNotice'>
                            <Form.Label>Your Notice Text</Form.Label>
                            <Form.Control
                                as='textarea'
                                rows={8}
                                value={noticeText}
                                onChange={(e) => setNoticeText(e.target.value)}
                                className='notice__edit--modal-form-control'
                            />
                        </Form.Group>
                    </Form>
                }
                {
                    modifyModalTitle === 'Delete' &&
                    <p className='mb-0'>
                        Are you sure you want to delete this notice?
                    </p>
                }
            </Modal.Body>
            <Modal.Footer
                className='notice__edit--modal-footer'
            >
                <Button

                    onClick={handleCloseModifyModal}
                    className='notice__edit--modal-btn'
                >
                    Cancel
                </Button>
                <Button
                    onClick={
                        () => {
                            if (modifyModalTitle === 'Edit') {
                                handleSaveEdit();
                            }
                            if (modifyModalTitle === 'Delete') {
                                handleDelete();
                            }
                        }
                    }
                    disabled={isRemovingNotice}
                    className='notice__edit--modal-btn'
                >
                    {isSavingEdit ? <Loading /> : (modifyModalTitle === 'Edit' && 'Save')}
                    {isRemovingNotice ? <Loading /> : (modifyModalTitle === 'Delete' && 'Delete')}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export const BlockModal = ({
    username,
    currUserId,
    showBlockModalFunction,
    handleCloseBlockModalFunction,
    handleBlock,
    isProcessing
}) => {
    return (
        <Modal
            show={showBlockModalFunction}
            onHide={handleCloseBlockModalFunction}
            className='user-profile__block--modal'
        >
            <Modal.Header
                className='justify-content-end border-bottom-0 user-profile__block--modal-header pb-0 w-100'
            >
                <Button
                    onClick={handleCloseBlockModalFunction}
                >
                    <i className='bi bi-x-square' />
                </Button>
            </Modal.Header>
            <Modal.Body
                className='user-profile__block--modal-body'
            >
                <p>Are you sure you want to block <strong>{username}</strong>?</p>
            </Modal.Body>
            <Modal.Footer className='user-profile__block--modal-footer border-top-0 pt-0'>
                <Button onClick={() => handleBlock(currUserId)}
                    className='me-2 user-profile__block--modal-body-btn'
                >
                    {isProcessing ? <Loading /> : 'Yes'}
                </Button>
                <Button onClick={handleCloseBlockModalFunction}
                    className='user-profile__block--modal-body-btn'
                >
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export const FollowModal = ({
    showFollowModal, handleCloseFollowModal, followModalTitle, getAvatarUrl, loadFollowers, loadFollowing, isLoadingMoreFollow, hasMoreFollow, defaultAvatar, followAccounts
}) => {
    return (
        <Modal
            show={showFollowModal}
            onHide={handleCloseFollowModal}
            className='user-profile__following--modal'
        >
            <Modal.Header
                className='user-profile__following--modal-header w-100 border-bottom-0'
            >
                <Modal.Title>{followModalTitle}</Modal.Title>
                <Button
                    onClick={handleCloseFollowModal}
                    className='ms-auto'
                >
                    <i className='bi bi-x-square' />
                </Button>
            </Modal.Header>
            <Modal.Body
                className='user-profile__following--modal-body py-0'
            >
                {followAccounts && followAccounts.map((followAccount) => {
                    return (
                        <div key={followAccount.$id}>
                            <Link
                                to={`/user/${followAccount.username}`}
                                className='w-100 d-flex justify-content-between align-items-center'
                                onClick={handleCloseFollowModal}
                            >
                                {followAccount.username}
                                <img src={getAvatarUrl(followAccount.avatar) || defaultAvatar}
                                    className='follower__avatar' />
                            </Link>
                        </div>
                    )
                })}
                {!hasMoreFollow &&
                    <div className='text-center mt-4'>
                        <EndAsterisks />
                    </div>
                }
            </Modal.Body>
            <Modal.Footer className='border-top-0'>
                {
                    hasMoreFollow &&
                    <Button onClick={
                        () => {
                            if (followModalTitle === 'Followers') {
                                loadFollowers();
                            }
                            if (followModalTitle === 'Following') {
                                console.log('orchid');

                                loadFollowing();
                            }
                        }
                    }
                        disabled={isLoadingMoreFollow ? true : false}
                        className="w-100 user-profile__following--modal-results-expand-btn">
                        {
                            isLoadingMoreFollow ? (
                                <div className='d-block mx-auto w-100'>
                                    <Loading size={22} color={'var(--main-accent-color-hover)'} />
                                </div>
                            ) : <i className='bi bi-chevron-down user-profile__following--modal-results-expand-btn-icon' />
                        }
                    </Button>
                }
            </Modal.Footer>
        </Modal>
    )
}

export const ComposeNoticeModal = ({
    showComposeNoticeModalFunction,
    handleCloseComposeNoticeModalFunction,
    children
}) => {
    return (
        <Modal show={showComposeNoticeModalFunction}
            onHide={handleCloseComposeNoticeModalFunction}
            className='notice__compose--modal p-0'
        >
            <Modal.Header className='border-bottom-0'>
                <Modal.Title className='w-100'>
                    Compose Notice
                </Modal.Title>
                <Button onClick={handleCloseComposeNoticeModalFunction} className='ms-auto me-0 p-0 notice__compose--close-btn'>
                    <i className='bi bi-x-square' />
                </Button>
            </Modal.Header>
            <Modal.Body className='notice__compose--modal-body py-0'>
                {children}
            </Modal.Body>
        </Modal>
    )
}

export const InterestsModal = ({ children, showTagsModalFunction, handleCloseTagsModalFunction }) => {
    return (
        <Modal show={showTagsModalFunction}
            onHide={handleCloseTagsModalFunction}
            className='interests--modal p-0'
        >
            <Modal.Header className='border-bottom-0'>
                <Modal.Title className='w-100'>
                    <h4>Update Interests:</h4>
                </Modal.Title>
                <Button onClick={handleCloseTagsModalFunction} className='ms-auto me-0 p-0 interests--close-btn'>
                    <i className='bi bi-x-square' />
                </Button>
            </Modal.Header>
            <Modal.Body className='interests--modal-body pt-0'>
                {children}
            </Modal.Body>
        </Modal>
    )
}

export const UserSearchModal = ({ children, show, handleCloseUserSearchModalFunction, modalHeaderContent }) => {
    return (
        <Modal show={show}
            onHide={handleCloseUserSearchModalFunction}
            style={{ zIndex: '9999999' }}
            className='tools__search--results-modal'
        >
            <Modal.Header className='w-100 pb-0'>
                {modalHeaderContent}
            </Modal.Header>
            <Modal.Body className='tools__search--results-modal-body'>
                {children}
            </Modal.Body>
        </Modal>
    )
}