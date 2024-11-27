import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import { getAvatarUrl as avatarUrl } from '../../lib/utils/avatarUtils';
import { Loading } from '../Loading/Loading';
// import { CgTrash } from 'react-icons/cg';
// import { BsExclamationTriangle } from 'react-icons/bs';
import { AiOutlineExclamationCircle } from "react-icons/ai";
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
    return (
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
                                <Col className='col-md-3 d-flex flex-column align-items-center justify-content-end'>
                                    <div className='d-flex align-items-center ms-auto'>
                                        <Link to={`/user/${reactionUsernameMap[notice.$id]?.[reaction.sender_id]}`}
                                            className='text-decoration-none notice__reaction-username'><strong className='ms-auto me-0'>
                                                {reactionUsernameMap[notice.$id]?.[reaction.sender_id] || 'Unknown user'}
                                            </strong>
                                        </Link>
                                        <Link to={`/user/${reactionUsernameMap[notice.$id]?.[reaction.sender_id]}`}
                                        >
                                            <img
                                                src={avatarUrl(reactionAvatarMap[notice.$id]?.[reaction.sender_id]) || defaultAvatar}
                                                alt="Profile"
                                                className='notice__reaction-avatar'
                                            />
                                        </Link>
                                    </div>
                                    {/* <div
                                            className='ms-1 mt-1 notice__delete-btn d-flex align-items-center'
                                            onClick={() => handleDeleteReaction(reaction.$id)}
                                        >
                                            <CgTrash size={22} />

                                        </div> */}
                                    {reaction.sender_id !== user_id ?
                                        <div
                                            className='ms-auto mt-1 d-flex notice__delete-btn d-flex align-items-center'
                                            onClick={() => handleReportReaction(reaction.$id)}
                                            style={{ height: '35px' }}
                                        >
                                            <AiOutlineExclamationCircle size={20} />
                                            {/* <BsExclamationTriangle size={20} /> */}
                                        </div>
                                        :
                                        <div style={{ height: '35px' }} />
                                    }
                                    <div className='ms-auto'>
                                        {formatDateToLocal(reaction.$createdAt)}
                                    </div>
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
    )
}
