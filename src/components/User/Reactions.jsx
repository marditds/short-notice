import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Image } from 'react-bootstrap';
import { getAvatarUrl } from '../../lib/utils/avatarUtils';
import { screenUtils } from '../../lib/utils/screenUtils';
import { truncateUsername } from '../../lib/utils/usernameUtils';
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
    user_id,
    username
}) => {
    const { isExtraSmallScreen, isSmallScreen } = screenUtils();

    const renderedReactions = useMemo(() => {
        return loadedReactions[notice.$id]?.map((reaction) => {

            const reactionUser = reactionUsernameMap[notice.$id]?.[reaction.sender_id];

            const isOwnProfile = reactionUser === username;

            const avatarId = reactionAvatarMap[notice.$id]?.[reaction.sender_id];

            const avatarUrl = getAvatarUrl(avatarId);

            return (
                <Row key={reaction.$id} className='m-auto px-3 px-sm-3 px-md-4'>
                    <hr className='my-3' />

                    {/* Reaction Text Col */}
                    <Col xs={8} sm={9} className='notice__reaction-text-col px-0 text-break' role='article' aria-label='User reaction text'>
                        {reaction.content}
                        {reaction.reactionGif && (
                            <>
                                <br />
                                <Image
                                    src={reaction.reactionGif}
                                    className='notice__reaction-gif mt-2 mb-1 mb-sm-2'
                                    width={
                                        isExtraSmallScreen ? '100%' : isSmallScreen ? '60%' : '60%'
                                    }
                                    alt='Reaction GIF'
                                    fluid
                                />
                            </>
                        )}
                    </Col>

                    {/* Profile Picture, Username, and Report Icon Col */}
                    <Col
                        xs={4}
                        sm={3}
                        className='d-flex flex-column px-0 align-items-center justify-content-end notice__reaction-info-col'
                    >
                        <div className='d-flex flex-column justify-content-end align-items-end ms-auto'>
                            <Link
                                to={isOwnProfile ? `/user/profile` : `/user/${reactionUser}`}
                                aria-label={isOwnProfile ? 'Go to your profile' : `Go to ${reactionUser}'s profile`}
                            >
                                <img
                                    src={avatarUrl || defaultAvatar}
                                    alt={isOwnProfile ? 'Your avatar' : `${reactionUser}'s avatar`}
                                    className='notice__reaction-avatar'
                                />
                            </Link>

                            <Link
                                to={isOwnProfile ? '/user/profile' : `/user/${reactionUser}`}
                                className="text-decoration-none notice__reaction-username"
                                aria-label={isOwnProfile ? 'Go to your profile' : `Go to ${reactionUser}'s profile`}
                            >
                                <strong className='ms-auto me-0'>
                                    {truncateUsername(
                                        reactionUser
                                    )}
                                </strong>
                            </Link>
                        </div>
                        {reaction.sender_id !== user_id ? (
                            <Button
                                className='ms-auto mt-sm-1 d-flex d-flex align-items-center notice__reaction-interaction-div notice__reaction-btn p-0'
                                onClick={() => handleReportReaction(reaction.$id)}
                                aria-label='Report this reaction'
                            >
                                <i className='bi bi-exclamation-circle'></i>
                            </Button>
                        ) : (
                            <div className='notice__reaction-interaction-div-empty' />
                        )}
                        <div className='ms-auto' aria-label={`Reaction posted on ${formatDateToLocal(reaction.$createdAt)}`}>
                            {formatDateToLocal(reaction.$createdAt)}
                        </div>
                    </Col>
                </Row>
            );
        });
    }, [loadedReactions, reactionAvatarMap, notice.$id, user_id, username, isExtraSmallScreen, isSmallScreen]);

    return (
        <>
            {loadingStates[notice.$id] ? (
                <div className='text-center py-3' role='status' aria-live='polite'>
                    <LoadingSpinner size={!isSmallScreen ? 24 : 18} />
                    <LoadingSpinner size={!isSmallScreen ? 24 : 18} />
                    <LoadingSpinner size={!isSmallScreen ? 24 : 18} />
                    <span className='visually-hidden'>Loading the reactions for this notice</span>
                </div>
            ) : loadedReactions[notice.$id]?.length > 0 ? (
                <>
                    {renderedReactions}
                    <div className='px-3 px-md-4'>

                        <hr className='my-3' />

                        {showLoadMoreBtn ? (
                            <Button
                                onClick={() => handleLoadMoreReactions(notice.$id)}
                                className='notice__load-reactions-btn'
                                disabled={isLoadingMoreReactions}
                                aria-label={
                                    isLoadingMoreReactions
                                        ? 'Loading the next batch of reactions for this notice'
                                        : 'Load more reactions'
                                }
                                aria-busy={isLoadingMoreReactions}
                            >
                                {isLoadingMoreReactions ? (
                                    <>
                                        <LoadingSpinner size={24} /> Loading...
                                        <span className='visually-hidden'>Loading the next batch of reactions for this notice</span>
                                    </>
                                ) : (
                                    'Load More Reactions'
                                )}
                            </Button>
                        ) : (
                            <div className='text-center text-muted py-2 py-md-3' aria-live='polite'>
                                <i className='bi bi-asterisk' />
                                <i className='bi bi-asterisk' />
                                <i className='bi bi-asterisk' />
                                <span className='visually-hidden'>No more reactions for this notice.</span>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className='text-center text-muted py-3' aria-live='polite'>
                    No reactions for this notice
                </div>
            )}
        </>
    );
};
