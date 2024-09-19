import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { formatDateToLocal, calculateCountdown } from '../../lib/utils/dateUtils';
import { Row, Col } from 'react-bootstrap';
import { CgTrash } from 'react-icons/cg';
import { AiFillEdit } from 'react-icons/ai';
import { RiMegaphoneLine } from 'react-icons/ri';
import { BsHandThumbsUp, BsHandThumbsUpFill, BsExclamationTriangle } from 'react-icons/bs';
import { Button } from 'react-bootstrap';
import defaultAvatar from '../../assets/default.png';;



export const Notices = ({ notices,
    handleEditNotice,
    handleDeleteNotice,
    handleCreateSpread, handleReport,
    handleLike,
    eventKey,
    username
}) => {

    const location = useLocation();

    const [countdowns, setCountdowns] = useState([]);


    useEffect(() => {

        const intervalId = setInterval(() => {
            const newCountdowns = notices.map(notice => calculateCountdown(notice.expiresAt));
            setCountdowns(newCountdowns);
        }, 60000);

        return () => clearInterval(intervalId);
    }, [notices]);



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
                                    <div className='d-flex align-items-center mt-auto'>
                                        <p className='w-100 my-0 text-end'
                                            style={{ marginRight: '12px' }}>
                                            <strong>{notice.username}</strong>
                                        </p>
                                        <img
                                            src={notice.avatarUrl || defaultAvatar}
                                            alt="Profile"
                                            style={{ borderRadius: '50%', width: 50, height: 50, marginRight: '12px' }}
                                            className='d-flex ms-auto'
                                        />
                                    </div>
                                    <div className='d-grid'>


                                        <div
                                            className='d-flex justify-content-end'
                                        >
                                            <Button
                                                className='notice__reaction-btn'
                                                disabled={username === notice.username}
                                                onClick={() => handleLike(notice)}
                                            >
                                                <BsHandThumbsUp
                                                    size={19}
                                                />
                                            </Button>
                                            <Button
                                                onClick={() => handleCreateSpread(notice)}
                                                className='notice__reaction-btn'
                                                disabled={username === notice.username}
                                            >
                                                <RiMegaphoneLine
                                                    size={19}
                                                />
                                            </Button>
                                            <Button
                                                className='notice__reaction-btn'
                                                disabled={username === notice.username}
                                            >
                                                <BsExclamationTriangle
                                                    onClick={() => handleReport(notice)}
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

        </>
    );
};
