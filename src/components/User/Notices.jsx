import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { formatDateToLocal, calculateCountdown } from '../../lib/utils/dateUtils';
import { Row, Col, Accordion, Image } from 'react-bootstrap';
import defaultAvatar from '../../assets/default.png';
import { Reactions } from './Reactions';
import { screenUtils } from '../../lib/utils/screenUtils';
import { ComposeReaction } from './ComposeReaction';
import { ReportModal } from './Modals';

export const Notices = ({
    notices,
    handleEditNotice,
    handleDeleteNotice,
    handleSave,
    setSavedNotices,
    handleReportNotice,
    handleLike,
    setLikedNotices,
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

    const { isSmallScreen, isExtraSmallScreen } = screenUtils();

    const [countdowns, setCountdowns] = useState([]);

    const [reactingNoticeId, setReactingNoticeId] = useState(null);
    const [reactionText, setReactionText] = useState('');
    const [reactionGif, setReactionGif] = useState(null);
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

    const [showReportModal, setShowReportModal] = useState(false);
    const [reportingNoticeId, setReprotingNoticeId] = useState(null);
    const [reportReason, setReportReason] = useState(null);
    const [showReportConfirmation, setShowReportConfirmation] = useState(false);
    const [isProcessingNoticeReport, setIsProcessingNoticeReport] = useState(false);

    const [showReportReactionModal, setShowReportReactionModal] = useState(false);
    const [reportingReactionId, setReportingReactionId] = useState(null);
    const [showReportReactionConfirmation, setShowReportReactionConfirmation] = useState(false);
    const [isProcessingReactionReport, setIsProcessingReactionReport] = useState(false);


    useEffect(() => {
        const intervalId = setInterval(() => {
            const newCountdowns = notices?.map(notice => calculateCountdown(notice.expiresAt));
            setCountdowns(newCountdowns);
        }, 60000);

        return () => clearInterval(intervalId);
    }, [notices]);

    const [reactionCharCount, setReactionCharCount] = useState(0);

    const onReactionTextChange = (e) => {
        setReactionText(e.target.value);
        setReactionCharCount(e.target.value.length);
    }

    const handleReactSubmission = async () => {
        setIsSendingReactionLoading(true);
        if (reactingNoticeId) {
            try {

                const notice = notices?.find(notice => notice.$id === reactingNoticeId);

                console.log('notice', notice);

                if (notice) {

                    const currentUser = await getUserAccountByUserId(user_id);

                    const tempId = `temp-${Date.now()}`;
                    const tempReaction = {
                        $id: tempId,
                        content: reactionText,
                        sender_id: notice.user_id,
                        $createdAt: new Date().toISOString(),
                        reactionGif: reactionGif
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

                    const res = await handleReact(notice.user_id, reactionText, notice.$id, notice.expiresAt, reactionGif);

                    setLoadedReactions(prev => ({
                        ...prev,
                        [reactingNoticeId]: prev[reactingNoticeId].map(reaction =>
                            reaction.$id === tempId ? {
                                ...res,
                                sender_id: user_id
                            } : reaction
                        )
                    }));

                    setReactionUsernameMap(prev => ({
                        ...prev,
                        [reactingNoticeId]: {
                            ...prev[reactingNoticeId],
                            [user_id]: currentUser.username,
                            [res.$id]: currentUser.username
                        }
                    }));

                    setReactionAvatarMap(prev => ({
                        ...prev,
                        [reactingNoticeId]: {
                            ...prev[reactingNoticeId],
                            [user_id]: currentUser.avatar,
                            [res.$id]: currentUser.avatar
                        }
                    }));

                    setReactionText('');
                    setReactionCharCount(0);
                    setReactionGif(null);
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

    // Repoting Notice
    const onReportNoticeClick = (noticeId) => {
        setReprotingNoticeId(noticeId);
        setShowReportModal(true);
        setShowReportConfirmation(false);
    }

    const handleReportSubmission = async () => {

        if (reportReason && reportingNoticeId) {
            setIsProcessingNoticeReport(true);
            try {

                const notice = notices?.find(notice => notice.$id === reportingNoticeId);

                if (notice) {
                    await handleReportNotice(notice.$id, notice.user_id, reportReason, notice.text);

                    setShowReportConfirmation(true);
                    setTimeout(() => {
                        setShowReportModal(false);
                    }, 2000);
                }
            } catch (error) {
                console.error("Error reporting notice:", error);
            } finally {
                setIsProcessingNoticeReport(false);
            }
        }
    };

    const handleCloseReportModal = () => {
        setShowReportModal(false);
        setReportReason(null);
    }

    // Setting user info for reactions
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
                    ...noticeReactions.documents.filter(newReaction =>
                        !prev[noticeId]?.some(existingReaction =>
                            existingReaction.$id === newReaction.$id
                        )
                    )
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

    // Reset reaction content and load more button
    useEffect(() => {

        setShowLoadMoreBtn(true);
        setReactionText('');
        setReactionGif(null);
        setReactionCharCount(0)

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
            setIsProcessingReactionReport(true);
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
            } finally {
                setIsProcessingReactionReport(false);
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
                {notices?.map((notice, idx) => (
                    <Accordion.Item eventKey={notice?.$id} key={notice?.$id}>
                        <Accordion.Header
                            className='notices__accordion-header'
                            onClick={() => handleAccordionToggle(notice.$id)}
                        >
                            <Row className='w-100 m-auto'>
                                {/* Text and Countdown Col */}
                                <Col xs={9} className='d-flex justify-content-between flex-column notice__text-countdown-col'
                                >
                                    <p className='text-break notice__text'>
                                        {notice?.noticeType === 'business' &&
                                            <strong>
                                                Ad:{' '}
                                            </strong>
                                        }
                                        {notice?.text}
                                    </p>

                                    {notice?.noticeUrl &&
                                        <p className='notice__link-in-notice-p'>

                                            <a href={notice?.noticeUrl} target='_blank' rel='noopener noreferrer'
                                                className='notice__link-in-notice'
                                            >
                                                {notice?.noticeUrl}
                                            </a>
                                        </p>
                                    }


                                    {notice?.noticeGif &&
                                        <Image src={notice?.noticeGif}
                                            className='mb-2 notice__gif'
                                            width={isExtraSmallScreen ? '90%' : (isSmallScreen ? '60%' : '60%')}
                                            fluid />
                                    }

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
                                                className='w-100 my-0 text-center notice__username'
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
                                                    <i className='bi bi-pencil'
                                                    // style={{ fontSize: isSmallScreen ? 12 : 18 }}
                                                    >
                                                    </i>
                                                    {/* <AiFillEdit size={isSmallScreen ? 16 : 20} /> */}
                                                </div>
                                                <div
                                                    className='ms-2 notice__delete-btn'
                                                    onClick={() => handleDeleteNotice(notice.$id)}
                                                >
                                                    <i className='bi bi-trash3'
                                                    // style={{ fontSize: isSmallScreen ? 12 : 18 }}
                                                    // 
                                                    ></i>
                                                    {/* <CgTrash size={isSmallScreen ? 16 : 20} /> */}

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
                                                                    isOtherUserBlocked ? console.log(`YOU are blocked`) : handleLike(notice.$id, notice.user_id, likedNotices, setLikedNotices);
                                                                }}
                                                            >
                                                                {likedNotices && likedNotices[notice.$id] ? (
                                                                    <>
                                                                        <i className='bi bi-hand-thumbs-up-fill notice__reaction-btn-fill'></i>
                                                                    </>
                                                                ) : (
                                                                    <i className='bi bi-hand-thumbs-up notice__reaction-btn'></i>
                                                                )}
                                                            </div>
                                                            <div
                                                                onClick={() => handleSave(notice.$id, notice.user_id, savedNotices, setSavedNotices)}
                                                                className={`notice__reaction-btn ${isOtherUserBlocked ? 'disabled' : ''} ms-2`}
                                                            >
                                                                {savedNotices && savedNotices[notice.$id] ? (
                                                                    <i className='bi bi-floppy-fill notice__reaction-btn-fill'></i>

                                                                ) : (
                                                                    <i className='bi bi-floppy notice__reaction-btn'></i>
                                                                )}
                                                            </div>
                                                            <div
                                                                className={`notice__reaction-btn ${isOtherUserBlocked ? 'disabled' : ''} ms-2`}
                                                            >
                                                                <i className='bi bi-reply'></i>
                                                            </div>
                                                            <div
                                                                onClick={() => onReportNoticeClick(notice.$id)}
                                                                className='notice__reaction-btn ms-2'
                                                            >
                                                                <i className='bi bi-exclamation-circle'></i>
                                                            </div>
                                                        </div>
                                                    }
                                                </>
                                            }
                                            <small className='text-end mt-auto notice__create-date text-nowrap'>
                                                {formatDateToLocal(notice.timestamp)}
                                            </small>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Accordion.Header>
                        <Accordion.Body className='notice__reaction'>
                            {isOtherUserBlocked || notice.user_id === user_id ? null :
                                <Row className='m-auto'>
                                    <Col className='px-2 px-sm-4 d-flex flex-column justify-content-end'>
                                        <ComposeReaction
                                            reactionText={reactionText}
                                            reactionGif={reactionGif}
                                            setReactionGif={setReactionGif}
                                            isSendingReactionLoading={isSendingReactionLoading}
                                            reactionCharCount={reactionCharCount}
                                            onReactionTextChange={onReactionTextChange}
                                            handleReactSubmission={handleReactSubmission}
                                        />
                                        <hr />
                                    </Col>
                                </Row>
                            }
                            <div className='d-flex justify-content-center'>
                                <Reactions
                                    notice={notice}
                                    defaultAvatar={defaultAvatar}
                                    loadedReactions={loadedReactions}
                                    isLoadingMoreReactions={isLoadingMoreReactions}
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
            <ReportModal
                handleCloseReportModalFunction={handleCloseReportModal}
                handleReportSubmissionFunction={handleReportSubmission}
                setReportReason={setReportReason}
                isProcessing={isProcessingNoticeReport}
                showReportConfirmationCheck={showReportConfirmation}
                showReportModalFunction={showReportModal}
            />

            {/* Reaction report modal */}
            <ReportModal
                handleCloseReportModalFunction={handleCloseReportReactionModal}
                handleReportSubmissionFunction={handleReportReactionSubmission}
                setReportReason={setReportReason}
                isProcessing={isProcessingReactionReport}
                showReportConfirmationCheck={showReportReactionConfirmation}
                showReportModalFunction={showReportReactionModal}
            />

        </>
    );
};
