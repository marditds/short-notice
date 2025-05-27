import { Link } from 'react-router-dom';
import { reportCategories } from '../Support/communityGuidelines';
import { Modal, Form, Button } from 'react-bootstrap';
import { LoadingSpinner } from '../Loading/LoadingSpinner';
import { EndAsterisks } from './EndAsterisks';


export const ReportModal = ({
    showReportModalFunction,
    handleCloseReportModalFunction,
    showReportConfirmationCheck,
    handleReportSubmissionFunction,
    setReportReason,
    isProcessing }) => {
    return (
        <Modal
            show={showReportModalFunction}
            onHide={handleCloseReportModalFunction}
            className='notice__report--modal p-0'
            aria-labelledby='report-notice-modal-title'
        >
            <Modal.Header className='border-bottom-0'>
                <Modal.Title id='report-notice-modal-title'>Report Notice</Modal.Title>
            </Modal.Header>
            <Modal.Body className='notice__report--modal-body py-0'>
                {showReportConfirmationCheck ? (
                    <p role='status'>Your report has been successfully submitted!</p>
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
                                    id={`report-${category.key}`}
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
                        <Button
                            onClick={handleCloseReportModalFunction}
                            className='notice__report--modal-btn'
                            aria-label='Cancel report'
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReportSubmissionFunction}
                            className='notice__report--modal-btn'
                            aria-label='Submit report'
                            disabled={isProcessing}
                        >
                            {isProcessing ? <LoadingSpinner /> : 'Report'}
                        </Button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    )
}

export const ModifyModal = ({ modifyModalTitle, showModifyModal, handleCloseModifyModal, handleSaveEdit, noticeText, setNoticeText, handleDelete, isRemovingNotice, isSavingEdit }) => {

    const isEdit = modifyModalTitle === 'Edit';
    const isDelete = modifyModalTitle === 'Delete';

    return (
        <Modal show={showModifyModal}
            onHide={handleCloseModifyModal}
            className='notice__edit--modal'
            aria-labelledby='modify-modal-title'
            aria-describedby={isEdit ? 'edit-instructions' : isDelete ? 'delete-warning' : undefined}
        >
            <Modal.Header
                className='notice__edit--modal-header'
            >
                <Modal.Title id='modify-modal-title'>{modifyModalTitle} Notice</Modal.Title>
            </Modal.Header>
            <Modal.Body
                className='notice__edit--modal-body'
            >
                {
                    isEdit &&
                    <Form>
                        <Form.Group className='mb-0 mb-md-3' controlId='editNotice'>
                            <Form.Label>Your Notice Text</Form.Label>
                            <Form.Control
                                as='textarea'
                                rows={8}
                                value={noticeText}
                                onChange={(e) => setNoticeText(e.target.value)}
                                className='notice__edit--modal-form-control'
                                aria-required='true'
                                aria-describedby='edit-instructions'
                            />
                            <Form.Text className='visually-hidden' id='edit-instructions'>
                                You can edit your notice here.
                            </Form.Text>
                        </Form.Group>
                    </Form>
                }
                {
                    isDelete &&
                    <p className='mb-0' id='delete-warning'>
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
                    variant='secondary'
                >
                    Cancel
                </Button>
                <Button
                    onClick={
                        () => {
                            if (isEdit) {
                                handleSaveEdit()
                            };
                            if (isDelete) {
                                handleDelete()
                            };
                        }
                    }
                    disabled={isEdit ? isSavingEdit : isRemovingNotice}
                    className='notice__edit--modal-btn'
                    aria-label={isEdit ? 'Save edited notice' : 'Confirm delete notice'}
                >
                    {isSavingEdit ?
                        <>
                            <LoadingSpinner aria-hidden='true' />
                            <span className='visually-hidden'>Processing...</span>
                        </> :
                        (isEdit && 'Save')
                    }

                    {isRemovingNotice ?
                        <>
                            <LoadingSpinner aria-hidden='true' />
                            <span className='visually-hidden'>Processing...</span>
                        </> :
                        (isDelete && 'Delete')
                    }
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
            aria-labelledby='block-user-modal-title'
        >
            <Modal.Header
                className='justify-content-end border-bottom-0 user-profile__block--modal-header pb-0 w-100'
            >
                <Button
                    onClick={handleCloseBlockModalFunction}
                    aria-label='Close block modal'
                >
                    <i className='bi bi-x-square' aria-hidden='true' />
                </Button>
            </Modal.Header>
            <Modal.Body
                className='user-profile__block--modal-body'
            >
                <p id='block-user-modal-title'>Are you sure you want to block <strong>{username}</strong>?</p>
            </Modal.Body>
            <Modal.Footer className='user-profile__block--modal-footer border-top-0 pt-0'>
                <Button
                    onClick={() => handleBlock(currUserId)}
                    className='me-2 user-profile__block--modal-body-btn'
                    aria-label={`Confirm blocking ${username}`}
                >
                    {isProcessing ? <LoadingSpinner /> : 'Yes'}
                </Button>
                <Button
                    onClick={handleCloseBlockModalFunction}
                    className='user-profile__block--modal-body-btn'
                    aria-label='Cancel blocking user'
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
            aria-labelledby='follow-modal-title'
            role='dialog'
        >
            <Modal.Header
                className='user-profile__following--modal-header w-100 border-bottom-0'
            >
                <Modal.Title id='follow-modal-title'>{followModalTitle}</Modal.Title>
                <Button
                    onClick={handleCloseFollowModal}
                    className='ms-auto'
                    aria-label='Close follow modal'
                >
                    <i className='bi bi-x-square' aria-hidden='true' />
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
                                aria-label={`View profile of ${followAccount.username}`}
                            >
                                <span>{followAccount.username}</span>
                                <img
                                    src={getAvatarUrl(followAccount.avatar) || defaultAvatar}
                                    className='follower__avatar'
                                    alt={`${followAccount.username}'s avatar`}
                                />
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
                        className='w-100 user-profile__following--modal-results-expand-btn'
                        aria-label='Load more results'
                    >
                        {
                            isLoadingMoreFollow ? (
                                <div className='d-block mx-auto w-100'>
                                    <LoadingSpinner size={22} color={'var(--main-accent-color-hover)'} />
                                </div>
                            ) : <i
                                className='bi bi-chevron-down user-profile__following--modal-results-expand-btn-icon'
                                aria-hidden='true'
                            />
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

export const TermsModal = ({ showTermModal, handleCloseTermModal, children }) => {
    return (
        <Modal show={showTermModal} onHide={handleCloseTermModal} className='createAccount__agreement-modal'>
            <Modal.Body className='createAccount__agreement-modal-body px-2'>
                {children}
            </Modal.Body>
            <Modal.Footer className='border-top-0 pt-0'>
                <Button onClick={handleCloseTermModal} className='mx-0 createAccount__btn'>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export const AvatarCropModal = ({ showAvatarCropModal, handleCloseAvatarCropModal, handleSaveCroppedImage, isUploading, loadingSpinner, children }) => {
    return (
        <Modal show={showAvatarCropModal} onHide={handleCloseAvatarCropModal} className='setting__avatar-crop-modal createAccount__agreement-modal' style={{ zIndex: '9999999' }}>
            <Modal.Body className='setting__avatar-crop-modal-body createAccount__agreement-modal-body px-2'>
                {children}
            </Modal.Body>
            <Modal.Footer className='border-top-0 pt-0 user-profile__block--modal-footer'>

                <Button onClick={handleCloseAvatarCropModal} className='setting__avatar-crop-cancel-btn d-flex justify-content-center align-items-center ms-0 me-1' >
                    Cancel
                </Button>

                <Button onClick={handleSaveCroppedImage} className='setting__avatar-crop-save-btn d-flex justify-content-center align-items-center mx-0'>
                    {!isUploading ? 'Save' : loadingSpinner}
                </Button>

            </Modal.Footer>
        </Modal>
    )
}