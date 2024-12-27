import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { formatDateToLocal, calculateCountdown } from '../../lib/utils/dateUtils';
import { Row, Col, Modal, Form, Accordion, Button } from 'react-bootstrap';
import { CgTrash } from 'react-icons/cg';
import { AiFillEdit } from 'react-icons/ai';
import { BsReply } from "react-icons/bs";
import { RiSave2Line, RiSave2Fill } from "react-icons/ri";
import { BsHandThumbsUp, BsHandThumbsUpFill } from 'react-icons/bs';
import { AiOutlineExclamationCircle } from "react-icons/ai";
import defaultAvatar from '../../assets/default.png';
import { Loading } from '../Loading/Loading';
import { Reactions } from './Reactions';


export const Notices = ({
    notices,
    handleEditNotice,
    handleDeleteNotice,
    handleSave,
    handleReport,
    handleLike,
    handleReact,
    eventKey,
    isOtherUserBlocked,
    user_id,
    likedNotices,
    savedNotices,
    getReactionsForNotice,
    getReactionByReactionId,
    getUserAccountByUserId,
    reportReaction
    // handleDeleteReaction
}) => {
    const location = useLocation();

    const [countdowns, setCountdowns] = useState([]);

    // const [showReactModal, setShowReactModal] = useState(false);
    // const [noticeUsername, setNoticeUsername] = useState(null);
    // const [noticeAvatarUrl, setNoticeAvatarUrl] = useState(null);
    // const [noticeText, setNoticeText] = useState(null);

    const [reactingNoticeId, setReactingNoticeId] = useState(null);
    const [reactionText, setReactionText] = useState('');
    const [isSendingReactionLoading, setIsSendingReactionLoading] = useState(false);

    const [limit] = useState(5);
    const [cursors, setCursors] = useState({});
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

    const [showReportReactionModal, setShowReportReactionModal] = useState(false);
    const [reportingReactionId, setReportingReactionId] = useState(null);
    const [showReportReactionConfirmation, setShowReportReactionConfirmation] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const newCountdowns = notices.map(notice => calculateCountdown(notice.expiresAt));
            setCountdowns(newCountdowns);
        }, 60000);

        return () => clearInterval(intervalId);
    }, [notices]);

    // Reacting to a notice
    // const handleReactNotice = (noticeId, noticeUsername, noticeAvatarUrl, noticeText) => {
    //     if (reactingNoticeId === noticeId) {
    //         setReactingNoticeId(null);
    //     } else {
    //         setReactingNoticeId(noticeId);
    //         setShowReactionTextField(true);
    //         setNoticeText(noticeText);
    //         setNoticeUsername(noticeUsername);
    //         setNoticeAvatarUrl(noticeAvatarUrl);
    //     }
    // }

    const onReactionTextChange = (e) => {
        setReactionText(e.target.value);
    }

    const handleReactSubmission = async () => {
        setIsSendingReactionLoading(true);
        if (reactingNoticeId) {
            try {

                const notice = notices.find(notice => notice.$id === reactingNoticeId);

                if (notice) {

                    const currentUser = await getUserAccountByUserId(user_id);

                    const tempReaction = {
                        $id: `temp-${Date.now()}`,
                        content: reactionText,
                        sender_id: notice.user_id,
                        $createdAt: new Date().toISOString()
                    };

                    setLoadedReactions(prev => ({
                        ...prev,
                        [reactingNoticeId]: [tempReaction, ...(prev[reactingNoticeId] || [])]
                    }));

                    setReactionUsernameMap(prev => ({
                        ...prev,
                        [reactingNoticeId]: {
                            ...prev[reactingNoticeId],
                            [notice.user_id]: currentUser.username
                        }
                    }));

                    setReactionAvatarMap(prev => ({
                        ...prev,
                        [reactingNoticeId]: {
                            ...prev[reactingNoticeId],
                            [notice.user_id]: currentUser.avatar
                        }
                    }));

                    const res = await handleReact(notice.user_id, reactionText, notice.$id, notice.expiresAt);
                    console.log('handleReactSubmission', res);

                    // setLoadedReactions(prev => ({
                    //     ...prev,
                    //     [reactingNoticeId]: prev[reactingNoticeId].map(reaction =>
                    //         reaction.$id === tempReaction.$id ? res : reaction
                    //     )
                    // }));

                    setReactionText('');
                }
            } catch (error) {
                setLoadedReactions(prev => ({
                    ...prev,
                    [reactingNoticeId]: prev[reactingNoticeId].filter(
                        reaction => reaction.$id !== `temp-${Date.now()}`
                    )
                }));
                console.error("Error reacting to notice:", error);
            } finally {
                setIsSendingReactionLoading(false);
            }
        }
    };

    // const handleCloseReactModal = () => {
    //     setShowReactModal(false);
    // }

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
                    await handleReport(notice.$id, notice.user_id, reportReason, notice.text);

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

    // Fetching and listing reactions and related user info 
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

            const currentCursor = cursors[noticeId] || null;

            const noticeReactions = await getReactionsForNotice(noticeId, limit, currentCursor);

            console.log('noticeReactions', noticeReactions);

            if (!noticeReactions || !noticeReactions.documents.length) {
                // No more reactions to load
                setShowLoadMoreBtn(false);
                return;
            }


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

            const newCursor = noticeReactions.documents.length > 0
                ? noticeReactions.documents[noticeReactions.documents.length - 1].$id
                : null;

            setCursors(prev => ({
                ...prev,
                [noticeId]: newCursor
            }));

            if (noticeReactions.documents.length < limit) {
                setShowLoadMoreBtn(false);
            }

        } catch (error) {
            console.error('Error loading reactions:', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, [noticeId]: false }));
            setIsLoadingMoreReactions(false);
        }
    };

    useEffect(() => {

        setShowLoadMoreBtn(true);
        setReactionText('');

        console.log('activeNoticeId', activeNoticeId);
        console.log('reactingNoticeId', reactingNoticeId);

    }, [activeNoticeId, reactingNoticeId])

    const handleAccordionToggle = async (noticeId) => {
        if (activeNoticeId === noticeId) {
            setActiveNoticeId(null);
            setReactingNoticeId(null);
            setShowLoadMoreBtn(false);

            setLoadedReactions(prev => {
                const newState = { ...prev };
                delete newState[noticeId];
                return newState;
            });

            setCursors(prev => {
                const newState = { ...prev };
                delete newState[noticeId];
                return newState;
            });
            return;
        }

        setActiveNoticeId(noticeId);
        setReactingNoticeId(noticeId);

        // If reactions aren't loaded and not currently loading 
        if (!loadedReactions[noticeId] && !loadingStates[noticeId]) {
            setLoadingStates(prev => ({ ...prev, [noticeId]: true }));
            try {
                const initialReactions = await getReactionsForNotice(noticeId, limit);

                console.log('initialReactions', initialReactions);

                const usersIds = initialReactions?.documents.map((reaction) => reaction.sender_id);

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

                const newCursor = initialReactions.documents.length > 0
                    ? initialReactions.documents[initialReactions.documents.length - 1].$id
                    : null;

                setCursors(prev => ({
                    ...prev,
                    [noticeId]: newCursor
                }));

            } catch (error) {
                console.error('Error loading initial reactions:', error);
            } finally {
                setLoadingStates(prev => ({ ...prev, [noticeId]: false }));
            }
        }
    };

    //Reporting Reaction 
    const handleReportReaction = (reactionId) => {
        setReportingReactionId(reactionId);
        setShowReportReactionModal(true);
        setShowReportReactionConfirmation(false);
    }

    useEffect(() => {
        console.log('ReprotingReactionId', reportingReactionId);
    }, [reportingReactionId])

    const handleReportReactionSubmission = async () => {

        if (reportReason && reportingReactionId) {
            try {

                const reaction = await getReactionByReactionId(reportingReactionId);

                console.log('Reported!', reaction);


                if (reaction) {
                    await reportReaction(reaction.$id, reaction.sender_id, reportReason, reaction.content);

                    setShowReportReactionConfirmation(true);
                    setTimeout(() => {
                        setShowReportReactionModal(false);
                    }, 2000);
                }
            } catch (error) {
                console.error("Error reporting notice:", error);
            }
        }
    };

    const handleCloseReportReactionModal = () => {
        setShowReportReactionModal(false);
        setReportReason(null);
    }

    const shouldShowUserInfo = () => {
        return (
            location.pathname === '/user/feed' ||
            (location.pathname === '/user/profile' && eventKey !== 'my-notices') ||
            (location.pathname.startsWith('/user/') &&
                location.pathname !== '/user/profile' &&
                location.pathname !== '/user/feed' &&
                eventKey !== 'notices')
        );
    };

    return (
        <>
            {/* {!isLoadingNotices ? */}
            <Accordion
                className='notices__accordion'
                activeKey={activeNoticeId}
                onSelect={handleAccordionToggle}
            >
                {notices.map((notice, idx) => (
                    <Accordion.Item eventKey={notice?.$id} key={notice?.$id}>
                        <Accordion.Header
                            // className='d-flex justify-content-center' 
                            onClick={() => handleAccordionToggle(notice.$id)}
                        >
                            <Row className='w-100 m-auto'>
                                {/* Text and Countdown Col */}
                                <Col xs={9} className='d-flex justify-content-between flex-column notice__text-countdown-col'
                                >
                                    <p className='mb-0 text-break'>{notice?.text}</p>

                                    <small className='me-auto'>
                                        <span
                                            style={{ color: 'gray' }}
                                        >
                                            Expires In:
                                        </span>  {countdowns[idx] || calculateCountdown(notice?.expiresAt)}
                                    </small>
                                </Col>

                                {/* Username, Profile Picture, Edit/Delete, Interaction Col */}
                                <Col xs={3} className='d-flex flex-column justify-content-end align-items-end notice__interaction-col'>

                                    {/* Username and Profile Picture */}
                                    {shouldShowUserInfo() ?
                                        (<div className='d-flex flex-column justify-content-end align-items-end mt-auto'>

                                            <Link to={`../${notice.username}`}>
                                                <img
                                                    src={notice.avatarUrl || defaultAvatar}
                                                    alt="Profile"
                                                    className='notice__avatar'
                                                />
                                            </Link>

                                            <p
                                                className='w-100 my-0 text-end notice__username'
                                            >
                                                <Link to={`../${notice.username}`}
                                                    className='text-decoration-none'>
                                                    <strong>{notice?.username}</strong>
                                                </Link>
                                            </p>

                                        </div>)
                                        :
                                        null
                                    }

                                    {/* Edit and Delete Notice */}
                                    {location.pathname === '/user/profile' && eventKey === 'my-notices' &&
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
                                        </div>
                                    }

                                    {/* Interaction w/ Notice */}
                                    <div className='d-flex flex-column justify-content-end'>
                                        <div className='d-grid'>
                                            {(location.pathname === '/user/profile' && eventKey === 'my-notices') ?
                                                null
                                                :
                                                <>
                                                    {(location.pathname === '/user/feed' && user_id === notice.user_id) || ((location.pathname !== `/user/profile` || location.pathname !== `/user/feed`) && user_id === notice.user_id) ?
                                                        <div className='notice__reaction-icon-div-empty'
                                                        // style={{ height: '25px' }}
                                                        /> :
                                                        <div
                                                            className='d-flex justify-content-end align-items-center notice__reaction-icon-div'
                                                        // style={{ height: '35px' }}
                                                        >
                                                            <div
                                                                className={`notice__reaction-btn ${isOtherUserBlocked ? 'disabled' : ''} ms-2`}
                                                                onClick={() => {
                                                                    isOtherUserBlocked ? console.log(`YOU are blocked`) : handleLike(notice);
                                                                }}
                                                            >
                                                                {likedNotices && likedNotices[notice.$id] ? (
                                                                    <>
                                                                        <BsHandThumbsUpFill
                                                                            className='notice__reaction-btn-fill'
                                                                        // style={{ fontSize: '50px' }}

                                                                        // size={19}
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    <BsHandThumbsUp
                                                                    // size={19}
                                                                    />
                                                                )}
                                                            </div>
                                                            <div
                                                                onClick={() => handleSave(notice)}
                                                                className={`notice__reaction-btn ${isOtherUserBlocked ? 'disabled' : ''} ms-2`}
                                                            >
                                                                {savedNotices && savedNotices[notice.$id] ? (
                                                                    <RiSave2Fill
                                                                        className='notice__reaction-btn-fill'
                                                                    // size={20}
                                                                    />

                                                                ) : (
                                                                    <RiSave2Line
                                                                    // size={20} 
                                                                    />
                                                                )}
                                                            </div>
                                                            <div
                                                                // onClick={() => handleReactNotice(notice.$id, notice.username, notice.avatarUrl, notice.text)}
                                                                className={`notice__reaction-btn ${isOtherUserBlocked ? 'disabled' : ''} ms-2`}
                                                            >
                                                                <BsReply
                                                                // size={23}
                                                                />
                                                            </div>
                                                            <div
                                                                onClick={() => handleReportNotice(notice.$id)}
                                                                className='notice__reaction-btn ms-2'
                                                            >
                                                                <AiOutlineExclamationCircle
                                                                // size={22}
                                                                />
                                                            </div>
                                                        </div>
                                                    }
                                                </>
                                            }
                                            <small className='text-end mt-auto notice__create-date'>
                                                {formatDateToLocal(notice.timestamp)}
                                            </small>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Accordion.Header>
                        <Accordion.Body className='notice__reaction'>
                            {isOtherUserBlocked ? null :
                                <Row className='m-auto'>
                                    <Col className='px-4'>
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
                                        <Button
                                            onClick={handleReactSubmission}
                                            className='notice__react-btn'
                                            disabled={reactionText === '' ? true : false}
                                        >
                                            {isSendingReactionLoading ? <Loading /> : 'Send'}
                                        </Button>
                                        <hr />
                                    </Col>
                                </Row>
                            }
                            <div className='d-flex justify-content-center'>
                                <Reactions
                                    notice={notice}
                                    defaultAvatar={defaultAvatar}
                                    isLoadingMoreReactions={isLoadingMoreReactions}
                                    loadedReactions={loadedReactions}
                                    loadingStates={loadingStates}
                                    reactionAvatarMap={reactionAvatarMap}
                                    reactionUsernameMap={reactionUsernameMap}
                                    showLoadMoreBtn={showLoadMoreBtn}
                                    user_id={user_id}
                                    handleLoadMoreReactions={handleLoadMoreReactions}
                                    handleReportReaction={handleReportReaction}
                                />
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                ))
                }
            </Accordion>

            {/* Notice report modal */}
            <Modal show={showReportModal}
                onHide={handleCloseReportModal}
                className='notice__report--modal p-0'
            >
                <Modal.Header>
                    <Modal.Title>Report Notice</Modal.Title>
                </Modal.Header>
                <Modal.Body className='notice__report--modal-body'>
                    {showReportConfirmation ? (
                        <p>Your report has been successfully submitted!</p>
                    ) : (
                        <Form
                            className='notice__report--modal-form'
                        >
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
                                        className='notice__report--radio'
                                    />
                                ))}
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {showReportConfirmation ? null : (
                        <>
                            <Button onClick={handleCloseReportModal}
                                className='notice__report--modal-btn'
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleReportSubmission}
                                className='notice__report--modal-btn'
                            // disabled={!reportReason}
                            >
                                Report
                            </Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>

            {/* Reaction report modal */}
            <Modal show={showReportReactionModal} onHide={handleCloseReportReactionModal}>
                <Modal.Header>
                    <Modal.Title>Report Reaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showReportReactionConfirmation ? (
                        <p>Your report has been successfully submitted!</p>
                    ) : (
                        <Form>
                            <Form.Group className='mb-3' controlId='reportReaction'>
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
                    {showReportReactionConfirmation ? null : (
                        <>
                            <Button onClick={handleCloseReportReactionModal}>
                                Cancel
                            </Button>
                            <Button onClick={handleReportReactionSubmission}
                            // disabled={!reportReason}
                            >
                                Report
                            </Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>

            {/* Reaction modal */}
            {/* <Modal show={showReactModal}
                onHide={handleCloseReactModal}
                className='notice__react--modal'
            >
                <Modal.Header className='d-grid notice__react--modal-header pb-0 pt-4'>
                    <Row className='align-items-center'>
                        <Col xs={9} sm={10} className='d-flex mt-auto mb-auto align-items-center h-100'>
                            <p className='mb-0 text-start notice__username text-break'>
                                {noticeText}
                            </p>
                        </Col>
                        <Col xs={3} sm={2}>
                            <img
                                src={noticeAvatarUrl || defaultAvatar}
                                alt="Profile"
                                className='d-flex ms-auto notice__react-modal-avatar'
                            />
                            <p className='mb-0 text-end'><strong>{noticeUsername}</strong></p>
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
                    ❗ For the time being, you do not have the option of deleting your reactions to notices. Please use this feature wisely.

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
            </Modal> */}

        </>
    );
};
