import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { formatDateToLocal, calculateCountdown } from '../../lib/utils/dateUtils';
import { Row, Col, Modal, Form, Accordion, Button } from 'react-bootstrap';
import { CgTrash } from 'react-icons/cg';
import { AiFillEdit } from 'react-icons/ai';
import { BsReply } from "react-icons/bs";
import { RiMegaphoneLine, RiMegaphoneFill } from 'react-icons/ri';
import { BsHandThumbsUp, BsHandThumbsUpFill, BsExclamationTriangle } from 'react-icons/bs';
import defaultAvatar from '../../assets/default.png';
import { Loading } from '../Loading/Loading';


export const Notices = ({
    notices,
    handleEditNotice,
    handleDeleteNotice,
    handleSpread,
    handleReport,
    handleLike,
    handleReact,
    eventKey,
    username,
    user_id,
    likedNotices,
    spreadNotices,
    reactions
}) => {

    const location = useLocation();

    const [countdowns, setCountdowns] = useState([]);

    const [showReactModal, setShowReactModal] = useState(false);
    const [reactingNoticeId, setReactingNoticeId] = useState(null);
    const [noticeUsername, setNoticeUsername] = useState(null);
    const [noticeAvatarUrl, setNoticeAvatarUrl] = useState(null);
    const [noticeText, setNoticeText] = useState(null);
    const [reactionText, setReactionText] = useState('');
    const [isSendingReactionLoading, setIsSendingReactionLoading] = useState(false);
    const [displayCount, setDisplayCount] = useState(10);

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


    // Replying to a notice
    const handleReactNotice = (noticeId, noticeUsername, noticeAvatarUrl, noticeText) => {
        setReactingNoticeId(noticeId);
        setShowReactModal(true);
        setNoticeText(noticeText);
        setNoticeUsername(noticeUsername);
        setNoticeAvatarUrl(noticeAvatarUrl);
        console.log('handleReactNotice', noticeId);

    }

    const onReactionTextChange = (e) => {
        setReactionText(e.target.value);
    }

    const handleReactSubmission = async () => {
        setIsSendingReactionLoading(true);
        if (reactingNoticeId) {
            try {

                const notice = notices.find(notice => notice.$id === reactingNoticeId);

                if (notice) {
                    const res = await handleReact(notice.user_id, reactionText, notice.$id);
                    console.log('handleReactSubmission', res);
                    setShowReactModal(false);
                    setReactionText('');
                }
            } catch (error) {
                console.error("Error reporting notice:", error);
            } finally {
                setIsSendingReactionLoading(false);
            }
        }
    };

    const handleCloseReactModal = () => {
        setShowReactModal(false);
    }

    // Repoting Notice
    const handleReportNotice = (noticeId) => {
        setReprotingNoticeId(noticeId);
        setShowReportModal(true);
        setShowReportConfirmation(false);
    }

    const handleReportSubmission = async () => {

        if (reportReason && reportingNoticeId) {
            try {

                const notice = notices.find(notice => notice.$id === reportingNoticeId);

                if (notice) {
                    const res = await handleReport(notice.$id, notice.user_id, reportReason);

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

    // const loadMoreNotices = () => {
    //     setDisplayCount(prevCount => prevCount + 10);
    // };

    return (
        <>
            <Accordion defaultActiveKey={['0']} className='user-profile__notices-accordion'>
                {/* {notices.slice(0, displayCount).map((notice, idx) => ( */}
                {notices.map((notice, idx) => (
                    <Accordion.Item eventKey={idx} key={notice.$id}>
                        <Accordion.Header className='d-flex justify-content-center'>
                            {/* <FaAngleDown size={20} className='me-3' /> */}
                            <Row className='w-100 m-auto'>
                                <Col className='col-md-9 d-flex justify-content-between flex-column'
                                >
                                    <p className='mb-0'>{notice.text}</p>

                                    <small className='me-auto'>
                                        <span
                                            style={{ color: 'gray' }}
                                        >
                                            Expires In:
                                        </span>  {countdowns[idx] || calculateCountdown(notice.expiresAt)}
                                    </small>
                                </Col>
                                <Col className='col-md-3'>

                                    {location.pathname === '/user/profile' && eventKey === 'my-notices' ?

                                        <div
                                            className='d-flex flex-column justify-content-end h-100'>
                                            <span className='d-flex ms-auto mt-auto'>
                                                <div
                                                    className='ms-auto notice__edit-btn'
                                                    onClick={() => handleEditNotice(notice.$id, notice.text)}
                                                >
                                                    <AiFillEdit size={20} />
                                                </div>
                                                <div
                                                    className='ms-2 notice__delete-btn'
                                                    onClick={() => handleDeleteNotice(notice.$id)}
                                                >
                                                    <CgTrash size={20} />

                                                </div>
                                            </span>
                                            <small
                                                className='text-end notice__create-date'
                                            >
                                                {formatDateToLocal(notice.timestamp)}
                                            </small>
                                        </div>
                                        :
                                        <div className='d-flex flex-column justify-content-end h-100'>

                                            {
                                                location.pathname !== `/user/${notice.username}` && eventKey === 'notices'
                                                    ?
                                                    null
                                                    :
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
                                                                style={{ borderRadius: '50%', width: 50, height: 50 }}
                                                                className='d-flex ms-auto'
                                                            />
                                                        </Link>
                                                    </div>
                                            }
                                            {/* </Link> */}
                                            <div className='d-grid'>
                                                {user_id === notice.user_id ?
                                                    <div style={{ height: '23.5px' }}></div>
                                                    :
                                                    <div
                                                        className='d-flex justify-content-end align-items-center'
                                                        style={{ height: '35px' }}
                                                    >
                                                        <div
                                                            className='notice__reaction-bt ms-2'
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
                                                        </div>
                                                        <div
                                                            onClick={() => handleSpread(notice)}
                                                            className='notice__reaction-btn ms-2'
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
                                                        </div>
                                                        <div
                                                            onClick={() => handleReactNotice(notice.$id, notice.username, notice.avatarUrl, notice.text)}
                                                            // onClick={() => setShowReactModal(true)}
                                                            className='notice__reaction-btn ms-2'
                                                            disabled={user_id === notice.user_id}
                                                        >
                                                            <BsReply
                                                                size={23}
                                                            />
                                                        </div>
                                                        <div
                                                            onClick={() => handleReportNotice(notice.$id)}
                                                            className='notice__reaction-btn ms-2'
                                                            disabled={user_id === notice.user_id}
                                                        >
                                                            <BsExclamationTriangle
                                                                size={19}
                                                            />
                                                        </div>
                                                    </div>
                                                }
                                                <small className='text-end mt-auto notice__create-date'>
                                                    {formatDateToLocal(notice.timestamp)}
                                                </small>
                                            </div>
                                        </div>
                                    }
                                </Col>
                            </Row>
                        </Accordion.Header>
                        <Accordion.Body className='d-flex justify-content-around w-100'>
                            <Row className='d-grid gap-3'>
                                {
                                    reactions?.map((reaction) => {
                                        return (reaction.notice_id === notice.$id &&
                                            <Col key={reaction.$id}>
                                                {reaction.content}
                                            </Col>)
                                    }
                                    )
                                }
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                ))
                }
            </Accordion>

            {/* {displayCount < notices.length && (
                <div className="d-flex justify-content-center mt-4">
                    <Button onClick={loadMoreNotices}>
                        Load More
                    </Button>
                </div>
            )} */}


            {/* {notices.map((notice, idx) => (
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

                                    {
                                        location.pathname !== `/user/${notice.username}` && eventKey === 'notices'
                                            ?
                                            null
                                            :
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
                                    } */}
            {/* </Link> */}
            {/* <div className='d-grid'>
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
                                                onClick={() => handleReactNotice(notice.$id, notice.username, notice.avatarUrl, notice.text)}
                                                // onClick={() => setShowReactModal(true)}
                                                className='notice__reaction-btn'
                                                disabled={user_id === notice.user_id}
                                            >
                                                <BsReply
                                                    size={23}
                                                />
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
            ))} */}

            <Modal
                show={showReactModal}
                onHide={handleCloseReactModal}
                className='notice__react--modal'
            >
                <Modal.Header className='d-grid notice__react--modal-header pb-0 pt-4'>
                    <Row className='align-items-center px-2'>
                        <Col className='d-flex justify-content-between flex-column col-md-8'
                        >
                            <p className='mb-0'>{noticeText}</p>
                        </Col>
                        <Col>
                            <div className='d-flex flex-column justify-content-end h-100'>

                                <div className='d-flex justify-content-end align-items-center mt-auto'>

                                    <p
                                        className='w-100 my-0 me-2 text-end notice__username'
                                    >
                                        <strong>{noticeUsername}</strong>
                                    </p>
                                    <img
                                        src={noticeAvatarUrl || defaultAvatar}
                                        alt="Profile"
                                        style={{ borderRadius: '50%', width: 50, height: 50, marginLeft: '0px' }}
                                        className='d-flex ms-auto'
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Modal.Header>

                <Modal.Body
                    className='notice__react--modal-body'
                >
                    <Form>
                        <Form.Group className='mb-3' controlId='reportNotice'>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={reactionText}
                                onChange={onReactionTextChange}
                                className="user-profile__form-control"
                                placeholder=''
                            />
                        </Form.Group>
                    </Form>

                </Modal.Body>
                <Modal.Footer
                    className='notice__react--modal-footer pt-0'
                >
                    <Button
                        onClick={handleCloseReactModal}
                        className='notice__react--modal-btn'
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleReactSubmission}
                        className='notice__react--modal-btn'
                        disabled={reactionText === '' ? true : false}
                    >
                        {isSendingReactionLoading ? <Loading /> : 'Send'}
                    </Button>
                </Modal.Footer>
            </Modal>

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
