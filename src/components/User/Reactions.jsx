import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Image } from 'react-bootstrap';
import { getAvatarUrl as avatarUrl } from '../../lib/utils/avatarUtils';
import { screenUtils } from '../../lib/utils/screenUtils';
import { truncteUsername } from '../../lib/utils/usernameUtils';
import { LoadingSpinner } from '../Loading/LoadingSpinner';
import { formatDateToLocal } from '../../lib/utils/dateUtils';




export const Reactions = ({
    loadingStates,
    notice,
    loadedReactions,
    reactionUsernameMap,
    reactionAvatarMap,
    defaultAvatar,
    showLoadMoreBtn,
    isLoadingMoreReactions,
    handleLoadMoreReactions,
    handleReportReaction,
    user_id }) => {

    const { isExtraSmallScreen, isSmallScreen } = screenUtils();

    return (
        <>
            {loadingStates[notice.$id] ? (
                <div className="text-center py-3">
                    <LoadingSpinner size={!isSmallScreen ? 24 : 18} />
                    <LoadingSpinner size={!isSmallScreen ? 24 : 18} />
                    <LoadingSpinner size={!isSmallScreen ? 24 : 18} />
                </div>
            ) : loadedReactions[notice.$id]?.length > 0 ? (
                <>
                    {loadedReactions[notice.$id].map((reaction) => (
                        <Row key={reaction.$id} className='m-auto'>

                            {/* Reaction Text Col */}
                            <Col xs={8} sm={9}
                                className='notice__reaction-text-col px-0 ps-sm-3 ps-md-4 text-break'>
                                {reaction.content}
                                {reaction.reactionGif &&
                                    <>
                                        <br />
                                        <Image src={reaction.reactionGif}
                                            className='notice__reaction-gif mt-2 mb-1 mb-sm-2'
                                            width={isExtraSmallScreen ? '100%' : (isSmallScreen ? '60%' : '60%')}
                                            fluid />
                                    </>
                                }
                            </Col>

                            {/* Profile Picture, Username, and Report Icon Col*/}
                            <Col xs={4} sm={3} className='d-flex flex-column pe-sm-3 pe-md-4 align-items-center justify-content-end notice__reaction-info-col'>
                                <div className='d-flex flex-column justify-content-end align-items-end ms-auto'>
                                    <Link to={`/user/${reactionUsernameMap[notice.$id]?.[reaction.sender_id]}`}
                                    >
                                        <img
                                            src={avatarUrl(reactionAvatarMap[notice.$id]?.[reaction.sender_id]) || defaultAvatar}
                                            alt="Profile"
                                            className='notice__reaction-avatar'
                                        />
                                    </Link>
                                    <Link to={`/user/${reactionUsernameMap[notice.$id]?.[reaction.sender_id]}`}
                                        className='text-decoration-none notice__reaction-username'>
                                        <strong className='ms-auto me-0'>
                                            {
                                                truncteUsername(reactionUsernameMap[notice.$id]?.[reaction.sender_id])
                                            }
                                            {/* {reactionUsernameMap[notice.$id]?.[reaction.sender_id] || 'Unknown user'} */}
                                        </strong>
                                    </Link>
                                </div>
                                {reaction.sender_id !== user_id ?
                                    <div
                                        className='ms-auto mt-sm-1 d-flex d-flex align-items-center notice__reaction-interaction-div notice__reaction-btn'
                                        onClick={() => handleReportReaction(reaction.$id)}
                                    >
                                        <i className="bi bi-exclamation-circle"></i>
                                        {/* <AiOutlineExclamationCircle /> */}
                                    </div>
                                    :
                                    <div className=' notice__reaction-interaction-div-empty' />
                                }
                                <div className='ms-auto'>
                                    {formatDateToLocal(reaction.$createdAt)}
                                </div>
                            </Col>
                            <hr className='my-2 my-md-3' />
                        </Row>
                    ))}
                    <div>
                        {showLoadMoreBtn ?
                            <Button
                                onClick={() => handleLoadMoreReactions(notice.$id)}
                                className='notice__load-reactions-btn'
                                disabled={isLoadingMoreReactions}
                            >
                                {isLoadingMoreReactions ?
                                    <><LoadingSpinner size={24} /> Loading...</>
                                    : 'Load More Reactions'}
                            </Button>
                            :
                            <div className='text-center text-muted py-2 py-md-3'>
                                <i className="bi bi-asterisk"></i>
                                <i className="bi bi-asterisk"></i>
                                <i className="bi bi-asterisk"></i>
                            </div>
                        }
                    </div>
                </>
            ) : (
                <div className="text-center text-muted py-3">
                    No reactions for this notice
                </div>
            )}

        </>
    )
}
