import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { formatDateToLocal, calculateCountdown } from '../../lib/utils/dateUtils';
import { Row, Col, Modal, Form } from 'react-bootstrap';
import { CgTrash } from 'react-icons/cg';
import { AiFillEdit } from 'react-icons/ai';
import { RiMegaphoneLine, RiMegaphoneFill } from 'react-icons/ri';
import { BsHandThumbsUp, BsHandThumbsUpFill, BsExclamationTriangle } from 'react-icons/bs';
import { Button } from 'react-bootstrap';
import defaultAvatar from '../../assets/default.png';;



export const Notices = ({
    notices,
    handleEditNotice,
    handleDeleteNotice,
    handleSpread,
    handleReport,
    handleLike,
    eventKey,
    username,
    user_id,
    likedNotices,
    spreadNotices
}) => {

    const location = useLocation();

    const [countdowns, setCountdowns] = useState([]);

    const reportCategories = [
        { name: "Hate speech", key: "HATE" },
        { name: "Harassment or bullying", key: "BULLY" },
        { name: "Violence or harmful behavior", key: "VIOL" },
        { name: "Misinformation or false information", key: "MISINFO" },
        { name: "Nudity or sexual content", key: "SEX" },
        { name: "Spam or misleading content", key: "SPAM" },
        { name: "Intellectual property violations", key: "COPYRIGHT" },
        { name: "Self-harm or suicide", key: "SELF" },
        { name: "Terrorism or extremism", key: "TERROR" },
        { name: "Scams or fraud", key: "SCAM" },
        { name: "Impersonation or fake accounts", key: "FAKE" },
        { name: "Graphic or violent content", key: "GRPHIC" },
        { name: "Child exploitation", key: "CHILD" },
        { name: "Privacy violation", key: "PRIV" },
        { name: "Animal abuse", key: "ANIM" }
    ];
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportingNoticeId, setReprotingNoticeId] = useState(null);
    const [reportReason, setReportReason] = useState(null);
    const [showReportConfirmation, setShowReportConfirmation] = useState(false);


    useEffect(() => {

        const intervalId = setInterval(() => {
            const newCountdowns = notices.map(notice => calculateCountdown(notice.expiresAt));
            setCountdowns(newCountdowns);
        }, 60000);

        return () => clearInterval(intervalId);
    }, [notices]);

    const handleReportNotice = (noticeId) => {
        setReprotingNoticeId(noticeId);
        setShowReportModal(true);
        setShowReportConfirmation(false);
    }

    const handleReportSubmission = async () => {

        console.log('reportReason', reportReason);

        console.log('reportingNoticeId', reportingNoticeId);

        if (reportReason && reportingNoticeId) {
            try {
                // Find the author_id of the notice being reported
                const notice = notices.find(notice => notice.$id === reportingNoticeId);

                console.log('notice', notice);

                console.log('notice id', notice.$id);

                console.log('notice user id', notice.user_id);


                if (notice) {
                    await handleReport(notice.$id, notice.user_id, reportReason, user_id);  // Call the reportNotice function
                    setShowReportConfirmation(true);
                    setTimeout(() => {
                        setShowReportModal(false);
                    }, 2000);
                }
            } catch (error) {
                console.error("Error reporting notice:", error);
            }
        }
    };

    const handleCloseReportModal = () => {
        setShowReportModal(false);
        setReportReason(null);
    }


    return (
        <>
            {notices.map((notice, idx) => (
                <div key={idx}>
                    <Row className='mt-3'>
                        <Col className='col-md-9 d-flex justify-content-between flex-column'
                        >
                            <p className='mb-0' style={{ marginLeft: '12px' }}>{notice.text}</p>

                            <small className='me-auto'>
                                <span
                                    style={{ color: 'gray', marginLeft: '12px' }}
                                >
                                    Expires In:
                                </span>  {countdowns[idx] || calculateCountdown(notice.expiresAt)}
                            </small>
                        </Col>
                        <Col>

                            {location.pathname === '/user/profile' && eventKey === 'my-notices' ?

                                <div
                                    className='d-flex flex-column justify-content-end h-100'>
                                    <span className='d-flex ms-auto mt-auto'>
                                        <Button
                                            className='ms-auto notice__edit-btn'
                                            onClick={() => handleEditNotice(notice.$id, notice.text)}
                                        >
                                            <AiFillEdit size={20} />
                                        </Button>
                                        <Button
                                            className='ms-2 notice__delete-btn'
                                            onClick={() => handleDeleteNotice(notice.$id)}
                                        >
                                            <CgTrash size={20} />

                                        </Button>
                                    </span>
                                    <small className='text-end  notice__create-date'
                                        style={{ marginRight: '12px' }}>
                                        {formatDateToLocal(notice.timestamp)}
                                    </small>
                                </div>
                                :
                                <div className='d-flex flex-column justify-content-end h-100'>
                                    {/* <Link to={`../${notice.username}`}> */}
                                    <div className='d-flex justify-content-end align-items-center mt-auto'>

                                        <p
                                            className='w-100 my-0 text-end notice__username'
                                        >
                                            <Link to={`../${notice.username}`}
                                                className=' text-decoration-none'>
                                                <strong>{notice.username}</strong>
                                            </Link>
                                        </p>

                                        <Link to={`../${notice.username}`}>
                                            <img
                                                src={notice.avatarUrl || defaultAvatar}
                                                alt="Profile"
                                                style={{ borderRadius: '50%', width: 50, height: 50, marginRight: '12px' }}
                                                className='d-flex ms-auto'
                                            />
                                        </Link>
                                    </div>
                                    {/* </Link> */}
                                    <div className='d-grid'>


                                        <div
                                            className='d-flex justify-content-end'
                                        >
                                            <Button
                                                className='notice__reaction-btn'
                                                disabled={user_id === notice.user_id}
                                                onClick={() => handleLike(notice)}
                                            >
                                                {likedNotices && likedNotices[notice.$id] ? (
                                                    <BsHandThumbsUpFill
                                                        className='notice__reaction-btn-fill'
                                                        size={19}
                                                    />
                                                ) : (
                                                    <BsHandThumbsUp size={19} />
                                                )}
                                            </Button>
                                            <Button
                                                onClick={() => handleSpread(notice)}
                                                className='notice__reaction-btn'
                                                disabled={user_id === notice.user_id}
                                            >
                                                {spreadNotices && spreadNotices[notice.$id] ? (
                                                    <RiMegaphoneFill
                                                        className='notice__reaction-btn-fill'
                                                        size={19}
                                                    />
                                                ) : (
                                                    <RiMegaphoneLine size={19} />
                                                )}
                                            </Button>
                                            <Button
                                                onClick={() => handleReportNotice(notice.$id)}
                                                className='notice__reaction-btn'
                                                disabled={user_id === notice.user_id}
                                            >
                                                <BsExclamationTriangle
                                                    size={19}
                                                />
                                            </Button>
                                        </div>

                                        <small style={{ marginRight: '12px' }} className='text-end mt-auto notice__create-date'>
                                            {formatDateToLocal(notice.timestamp)}
                                        </small>
                                    </div>
                                </div>
                            }
                        </Col>

                    </Row>
                    <hr />

                </div>
            ))}

            <Modal show={showReportModal} onHide={handleCloseReportModal}>
                <Modal.Header>
                    <Modal.Title>Report Notice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showReportConfirmation ? (
                        <p>Your report has been successfully submitted!</p>
                    ) : (
                        <Form>
                            <Form.Group className='mb-3' controlId='reportNotice'>
                                <Form.Label>Reason:</Form.Label>
                                {reportCategories.map((category) => (
                                    <Form.Check
                                        key={category.key}
                                        type='radio'
                                        label={category.name}
                                        id={category.name}
                                        name='reportReason'
                                        onChange={() => setReportReason(category.key)}
                                    />
                                ))}
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {showReportConfirmation ? null : (
                        <>
                            <Button onClick={handleCloseReportModal}>
                                Cancel
                            </Button>
                            <Button onClick={handleReportSubmission}
                            // disabled={!reportReason}
                            >
                                Report
                            </Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>


        </>
    );
};
