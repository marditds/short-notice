{/* Notices in Accordion */ }
<Accordion
    className='notices__accordion'
    activeKey={activeNoticeId}
>
    {notices?.map((notice, idx) => (
        <Accordion.Item eventKey={notice?.$id} key={notice?.$id} className='notices__accordion-item'>
            <Accordion.Header
                id={`accordion-header-${notice.$id}`}
                className='notices__accordion-header mt-3 mb-0'
            >
                {/* Avatar, username, dates */}
                <Row className='w-100 mx-0 flex-nowrap'>

                    {/* Avatar */}
                    {shouldShowUserInfo() ?
                        <Col xs={1} className='notice__avatar-col d-flex flex-column'>

                            <div className='d-flex justify-content-center justify-content-sm-start align-items-center mt-auto'>
                                <Link to={notice.username !== username ? `../${notice.username}` : `../profile`}>
                                    <img
                                        src={notice.avatarUrl || defaultAvatar}
                                        alt="Profile"
                                        className='notice__avatar'
                                    />
                                </Link>
                            </div>

                        </Col>
                        : null
                    }

                    {/* Username and dates */}
                    <Col xs={11} className={`d-flex flex-column pe-0 justify-content-evenly ${((location.pathname === '/user/profile' && eventKey == 'my-notices') || (location.pathname !== '/user/profile' && eventKey == 'notices')) ? 'ps-0' : null}`}>
                        {shouldShowUserInfo() ?
                            <p className='w-100 mb-0 text-start notice__username'>
                                <Link to={notice.username !== username ? `../${notice.username}` : `../profile`} className='text-decoration-none'>
                                    <strong>
                                        {notice?.username ? truncteUsername(notice.username) : ''}
                                    </strong>
                                </Link>
                            </p>
                            : null}
                        <div>
                            {/* Creation date */}
                            <small className='text-end mt-auto notice__create-date text-nowrap me-4'>
                                <span style={{ color: 'gray' }} >
                                    Created:
                                </span> {formatDateToLocal(notice.timestamp)}
                            </small>

                            {/* Expiration countdown */}
                            <small className='me-auto'>
                                <span style={{ color: 'gray' }} >
                                    Expires In:
                                </span>  {countdowns[idx] || calculateCountdown(notice?.expiresAt)}
                            </small>
                        </div>
                    </Col>
                </Row>

                <hr className='my-3' />

                {/* Text */}
                <Row>
                    <Col>
                        <p className='text-break notice__text my-1 my-md-3'>
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
                    </Col>
                </Row>

                <hr className='my-3' />
                {/* Interaction / edit / delete */}
                <Row>
                    {/* Like, save, reply, and report */}
                    {(location.pathname === '/user/profile' && eventKey === 'my-notices') ?
                        null
                        :
                        <>
                            {
                                <div className='d-flex justify-content-start align-items-center notice__reaction-icon-div'
                                >
                                    {
                                        (notice.user_id === user_id) ?
                                            <>
                                                <span className='d-flex mt-auto my-auto'>
                                                    <i className='bi bi-hand-thumbs-up notice__reaction-btn-fill me-2' role='img' aria-label='thumbs up like icon' /> {notice.noticeLikesTotal}
                                                </span>
                                                <span className='ms-4 d-flex mt-auto my-auto'>
                                                    <i className='bi bi-floppy notice__reaction-btn-fill me-2' /> {notice.noticeSavesTotal}
                                                </span>
                                                <span className='ms-4 d-flex mt-auto my-auto'
                                                    onClick={() => {
                                                        handleAccordionToggle(notice.$id);
                                                        console.log('Leaving a reaction btn');
                                                    }}
                                                >
                                                    <i className={`bi bi-reply notice__reaction-btn-fill me-2  notice__reaction-users-own`} />
                                                </span>
                                            </>
                                            :
                                            <>
                                                {/* Like */}
                                                <div
                                                    className={`d-flex align-items-center notice__reaction-btn ${(isOtherUserBlocked || (btnPermission === false || notice.btnPermission === false)) ? 'disabled' : ''} ms-2`}
                                                    onClick={(e) => {

                                                        e.stopPropagation();

                                                        if (isOtherUserBlocked || btnPermission === false || notice.btnPermission === false) {
                                                            console.log("YOU are forbidden from completing this action.");
                                                            return;
                                                        }

                                                        const isLiked = likedNotices[notice.$id];

                                                        console.log('isLiked:', isLiked);

                                                        const currentCount = likeCounts[notice.$id] ?? notice.noticeLikesTotal ?? 0;

                                                        console.log('currentCount', currentCount);

                                                        setLikedNotices(prev => ({
                                                            ...prev,
                                                            [notice.$id]: !isLiked
                                                        }));

                                                        setLikeCounts(prev => ({
                                                            ...prev,
                                                            [notice.$id]: isLiked ? currentCount - 1 : currentCount + 1
                                                        }));

                                                        handleLike(notice.$id, notice.user_id, likedNotices, setLikedNotices);
                                                    }}
                                                >
                                                    {likedNotices && likedNotices[notice.$id] ? (
                                                        <i className='bi bi-hand-thumbs-up-fill notice__reaction-btn-fill me-2' role='img' aria-label='thumbs up like icon' />
                                                    ) : (
                                                        <i className='bi bi-hand-thumbs-up notice__reaction-btn me-2' />
                                                    )} <span>
                                                        {likeCounts[notice.$id] ?? notice.noticeLikesTotal}
                                                    </span>
                                                </div>

                                                {/* Save */}
                                                <div
                                                    className={`d-flex align-items-center notice__reaction-btn ${(isOtherUserBlocked || (btnPermission === false || notice.btnPermission === false)) ? 'disabled' : ''} ms-4`}
                                                    onClick={(e) => {

                                                        e.stopPropagation();

                                                        if (isOtherUserBlocked || btnPermission === false || notice.btnPermission === false) {
                                                            console.log("YOU are forbidden from completing this action.");
                                                            return;
                                                        }

                                                        const isSaved = savedNotices[notice.$id];

                                                        console.log('isSaved:', isSaved);

                                                        const currentCount = saveCounts[notice.$id] ?? notice.noticeSavesTotal ?? 0;

                                                        console.log('currentCount', currentCount);

                                                        setSavedNotices(prev => ({
                                                            ...prev,
                                                            [notice.$id]: !isSaved
                                                        }));

                                                        setSaveCounts(prev => ({
                                                            ...prev,
                                                            [notice.$id]: isSaved ? currentCount - 1 : currentCount + 1
                                                        }));

                                                        handleSave(notice.$id, notice.user_id, savedNotices, setSavedNotices);
                                                    }}
                                                >
                                                    {savedNotices && savedNotices[notice.$id] ? (
                                                        <i className='bi bi-floppy-fill notice__reaction-btn-fill me-2' />
                                                    ) : (
                                                        <i className='bi bi-floppy notice__reaction-btn me-2' />
                                                    )} <span>
                                                        <span className='ms-1'>
                                                            {saveCounts[notice.$id] ?? notice.noticeSavesTotal}
                                                        </span>
                                                    </span>
                                                </div>

                                                {/* React */}
                                                <div
                                                    className={`d-flex align-items-center notice__reaction-btn ${(isOtherUserBlocked || (txtPermission === false || notice.txtPermission === false)) ? 'disabled' : ''} ms-4`}
                                                    onClick={() => {

                                                        if (isOtherUserBlocked || txtPermission === false || notice.txtPermission === false) {
                                                            console.log("YOU are forbidden from completing this action.");
                                                            return;
                                                        }
                                                        handleAccordionToggle(notice.$id);
                                                        console.log('Leaving a reaction btn');
                                                    }}
                                                >
                                                    <i className='bi bi-reply notice__reaction-btn' />
                                                </div>

                                                {/* Report */}
                                                <div
                                                    onClick={() => onReportNoticeClick(notice.$id)}
                                                    className='notice__reaction-btn ms-auto'
                                                >
                                                    <i className='bi bi-exclamation-circle' role='img' aria-label='exlamation icon' />
                                                </div>
                                            </>
                                    }
                                </div>
                            }
                        </>
                    }

                    {/* FOR USER PROFILE ONLY */}
                    {/* Edit/Delete */}
                    {location.pathname === '/user/profile' && eventKey === 'my-notices' &&
                        <div
                            className='d-flex justify-content-start h-100'>
                            <>
                                <span className='d-flex mt-auto my-auto'>
                                    <i className='bi bi-hand-thumbs-up notice__reaction-btn-fill me-2' role='img' aria-label='thumbs up like icon' /> {notice?.noticeLikesTotal}
                                </span>
                                <span className='ms-4 d-flex mt-auto my-auto'>
                                    <i className='bi bi-floppy notice__reaction-btn-fill me-2' /> {notice?.noticeSavesTotal}
                                </span>
                                <span className='ms-4 d-flex mt-auto my-auto'
                                    onClick={() => {
                                        handleAccordionToggle(notice.$id);
                                        console.log('Leaving a reaction btn');
                                    }}
                                >
                                    <i className='bi bi-reply notice__reaction-btn-fill me-2 notice__reaction-users-own' />
                                </span>
                            </>

                            <span className='d-flex ms-auto mt-auto'>
                                <div
                                    className='ms-auto notice__edit-btn'
                                    onClick={() => handleEditNotice(notice.$id, notice.text)}
                                >
                                    <i className='bi bi-pencil' />
                                </div>
                                <div
                                    className='ms-2 notice__delete-btn'
                                    onClick={() => handleDeleteNotice(notice.$id)}
                                >
                                    <i className='bi bi-trash3' />
                                </div>
                            </span>
                        </div>
                    }
                </Row>

            </Accordion.Header>

            <Accordion.Body className='notice__reaction'>

                {isOtherUserBlocked || notice.user_id === user_id ? null :
                    <Row className='m-auto'>
                        <Col className='px-0 px-sm-3 px-md-4 d-flex flex-column justify-content-end'>
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
                    username={username}
                    handleLoadMoreReactions={handleLoadMoreReactions}
                    handleReportReaction={handleReportReaction}
                />
                {(txtPermission === false || notice.txtPermission === false) &&
                    <Row className='my-2 my-sm-3'>
                        <Col className='text-center'>
                            {
                                notice.user_id === user_id ? (
                                    <>
                                        To allow other users to post reactions to your notices, change your <Link to="../settings">settings</Link>.
                                    </>
                                ) : (
                                    <>
                                        This user does not allow reactions to their notices.
                                    </>
                                )
                            }
                        </Col>
                    </Row>
                }

            </Accordion.Body>

        </Accordion.Item>
    ))
    }
</Accordion>