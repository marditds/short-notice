import React from 'react';
import { reportCategories } from '../PreLogin/ComunityGuidelines/communityGuidelines';
import { Modal, Form, Button } from 'react-bootstrap';
import { Loading } from '../Loading/Loading';

export const ReportModal = ({
    showReportModalFunction,
    handleCloseReportModalFunction,
    showReportConfirmationCheck,
    handleReportSubmissionFunction,
    setReportReason }) => {
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
                            Report
                        </Button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    )
}

export const ModifyModal = ({ modifyModalTitle, showModifyModal, handleCloseModifyModal, handleSaveEdit, noticeText, setNoticeText, handleDelete, isRemovingNotice }) => {
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
                        <Form.Group className='mb-3' controlId='editNotice'>
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
                    {modifyModalTitle === 'Edit' && 'Save'}
                    {isRemovingNotice ? <Loading /> : (modifyModalTitle === 'Delete' && 'Delete')}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
