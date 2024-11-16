import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { formatDateToLocal, calculateCountdown } from '../../lib/utils/dateUtils';
import { getAvatarUrl as avatarUrl } from '../../lib/utils/avatarUtils';
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
    reactions,
    getReactionsForNotice,
    getUserAccountByUserId
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

    const [limit] = useState(5);
    const [offsets, setOffsets] = useState({});
    const [hasMoreReactions, setHasMoreReactions] = useState({});
    const [showLoadMoreBtn, setShowLoadMoreBtn] = useState(false);
    const [isLoadingMoreReactions, setIsLoadingMoreReactions] = useState(false);

    const [reactionUsernameMap, setReactionUsernameMap] = useState({});
    const [reactionAvatarMap, setReactionAvatarMap] = useState({});

    const [loadingStates, setLoadingStates] = useState({});
    const [loadedReactions, setLoadedReactions] = useState({});
    const [activeNoticeId, setActiveNoticeId] = useState(null);

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


    // Reacting to a notice
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

    const updateReactionMaps = (users, noticeId, usernameMap, avatarMap) => {
        const updatedUsernameMap = { ...usernameMap[noticeId] };
        const updatedAvatarMap = { ...avatarMap[noticeId] };

        users.forEach(user => {
            if (user) {
                updatedUsernameMap[user.$id] = user.username;
                updatedAvatarMap[user.$id] = user.avatar;
            }
        });

        return { updatedUsernameMap, updatedAvatarMap };
    };

    const handleLoadMoreReactions = async (noticeId) => {
        try {
            setIsLoadingMoreReactions(true);

            const currentOffset = offsets[noticeId] || 0;

            // Get reactions from DB only for one specific notice
            const noticeReactions = await getReactionsForNotice(noticeId, limit, currentOffset);

            console.log('noticeReactions', noticeReactions);

            const usersIds = noticeReactions.documents.map((reaction) => reaction.sender_id);

            console.log('usersIds', usersIds);

            const users = await Promise.all(usersIds.map(async (userId) => await getUserAccountByUserId(userId)));

            console.log('users', users);

            const { updatedUsernameMap, updatedAvatarMap } = updateReactionMaps(
                users,
                noticeId,
                reactionUsernameMap,
                reactionAvatarMap
            );

            setReactionUsernameMap(prev => ({
                ...prev,
                [noticeId]: updatedUsernameMap
            }));

            setReactionAvatarMap(prev => ({
                ...prev,
                [noticeId]: updatedAvatarMap
            }));

            console.log('ReactionUsernameMap', reactionUsernameMap);

            console.log('ReactionAvatarMap', reactionAvatarMap);

            setLoadedReactions(prev => ({
                ...prev,
                [noticeId]: [
                    ...(prev[noticeId] || []),
                    ...(noticeReactions?.documents || [])
                ]
            }));

            const hasMore = noticeReactions?.documents?.length === limit;
            setHasMoreReactions(prev => ({
                ...prev,
                [noticeId]: hasMore
            }));

            if (noticeReactions?.documents?.length < limit) {
                setHasMoreReactions(false);
            }

            setOffsets(prev => ({
                ...prev,
                [noticeId]: currentOffset + limit
            }));


        } catch (error) {
            console.error('Error loading reactions:', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, [noticeId]: false }));
            setIsLoadingMoreReactions(false);
        }
    }

    useEffect(() => {
        console.log('activeNoticeId', activeNoticeId);
        setShowLoadMoreBtn(true);
    }, [activeNoticeId])

    const handleAccordionToggle = async (noticeId) => {

        if (activeNoticeId === noticeId) {
            setActiveNoticeId(null);
            setShowLoadMoreBtn(false);

            setLoadedReactions(prev => {
                const newState = { ...prev };
                delete newState[noticeId];
                return newState;
            });
            setOffsets(prev => {
                const newState = { ...prev };
                delete newState[noticeId];
                return newState;
            });
            setHasMoreReactions(prev => {
                const newState = { ...prev };
                delete newState[noticeId];
                return newState;
            });
            return;
        }

        setActiveNoticeId(noticeId);

        // If reactions aren't loaded and not currently loading
        if (!loadedReactions[noticeId] && !loadingStates[noticeId]) {
            setLoadingStates(prev => ({ ...prev, [noticeId]: true }));
            try {
                const initialReactions = await getReactionsForNotice(noticeId, limit, 0);

                console.log('initialReactions', initialReactions);

                const usersIds = initialReactions.documents.map((reaction) => reaction.sender_id);

                console.log('usersIds', usersIds);

                const users = await Promise.all(usersIds.map(async (userId) => await getUserAccountByUserId(userId)));

                console.log('users', users);

                const { updatedUsernameMap, updatedAvatarMap } = updateReactionMaps(
                    users,
                    noticeId,
                    reactionUsernameMap,
                    reactionAvatarMap
                );

                setReactionUsernameMap(prev => ({
                    ...prev,
                    [noticeId]: updatedUsernameMap
                }));

                setReactionAvatarMap(prev => ({
                    ...prev,
                    [noticeId]: updatedAvatarMap
                }));


                console.log('ReactionUsernameMap', reactionUsernameMap);

                console.log('ReactionAvatarMap', reactionAvatarMap);


                setLoadedReactions(prev => ({
                    ...prev,
                    [noticeId]: initialReactions?.documents || []
                }));

                const hasMore = initialReactions?.documents?.length === limit;
                setHasMoreReactions(prev => ({
                    ...prev,
                    [noticeId]: hasMore
                }));

                setOffsets(prev => ({
                    ...prev,
                    [noticeId]: limit
                }));
            } catch (error) {
                console.error('Error loading initial reactions:', error);
            } finally {
                setLoadingStates(prev => ({ ...prev, [noticeId]: false }));
            }

        }
    };

    return (
        <>
            <Accordion
                // defaultActiveKey={['0']}
                className='user-profile__notices-accordion'
                activeKey={activeNoticeId}
                onSelect={handleAccordionToggle}
            >
                {/* {notices.slice(0, displayCount).map((notice, idx) => ( */}
                {notices.map((notice, idx) => (
                    <Accordion.Item eventKey={notice?.$id} key={notice?.$id}>
                        <Accordion.Header
                            className='d-flex justify-content-center'
                            onClick={() => handleAccordionToggle(notice.$id)}
                        >
                            {/* <FaAngleDown size={20} className='me-3' /> */}
                            <Row className='w-100 m-auto'>
                                <Col className='col-md-9 d-flex justify-content-between flex-column'
                                >
                                    <p className='mb-0'>{notice?.text}</p>

                                    <small className='me-auto'>
                                        <span
                                            style={{ color: 'gray' }}
                                        >
                                            Expires In:
                                        </span>  {countdowns[idx] || calculateCountdown(notice?.expiresAt)}
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
                                                {formatDateToLocal(notice?.timestamp)}
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
                                                                className='text-decoration-none'>
                                                                <strong>{notice?.username}</strong>
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
                                                            className='notice__reaction-btn ms-2'
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
                        <Accordion.Body className='d-flex justify-content-center notice__reaction'>
                            <Row className='d-grid w-100'>

                                {loadingStates[notice.$id] ? (
                                    <Col className="text-center py-3">
                                        <Loading size={24} />
                                        <Loading size={24} />
                                        <Loading size={24} />
                                    </Col>
                                ) : loadedReactions[notice.$id]?.length > 0 ? (
                                    <>
                                        {loadedReactions[notice.$id].map((reaction) => (
                                            <Col key={reaction.$id} >
                                                <Row>
                                                    <Col className='col-md-9'>
                                                        {reaction.content}
                                                    </Col>
                                                    <Col className='col-md-3 d-flex align-items-center justify-content-end'>
                                                        <Link to={`/user/${reactionUsernameMap[notice.$id]?.[reaction.sender_id]}`}
                                                            className='text-decoration-none notice__reaction-username'><strong className='ms-auto me-0'>
                                                                {reactionUsernameMap[notice.$id]?.[reaction.sender_id] || 'Unknown user'}
                                                            </strong>
                                                        </Link>
                                                        <Link to={`/user/${reactionUsernameMap[notice.$id]?.[reaction.sender_id]}`}
                                                            className='notice__reaction-avatar'
                                                        >
                                                            <img
                                                                src={avatarUrl(reactionAvatarMap[notice.$id]?.[reaction.sender_id]) || defaultAvatar}
                                                                alt="Profile"
                                                                style={{ borderRadius: '50%', width: '35px', height: '35px' }}
                                                                className='d-flex'
                                                            />
                                                        </Link>
                                                    </Col>
                                                </Row>
                                                <hr />
                                            </Col>
                                        ))}
                                        <div>
                                            {showLoadMoreBtn ?
                                                <Button
                                                    onClick={() => handleLoadMoreReactions(notice.$id)}
                                                    className='settings__load-blocked-btn'
                                                    disabled={isLoadingMoreReactions}
                                                >
                                                    {isLoadingMoreReactions ?
                                                        <><Loading size={24} /> Loading...</>
                                                        : 'Load More Reactions'}
                                                </Button>
                                                :
                                                <Col className="text-center text-muted py-3">
                                                    No more reactions
                                                </Col>
                                            }
                                        </div>
                                    </>
                                ) : (
                                    <Col className="text-center text-muted py-3">
                                        No reactions for this notice
                                    </Col>
                                )}

                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                ))
                }
            </Accordion>

            <Modal show={showReactModal}
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
