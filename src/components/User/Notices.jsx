import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { formatDateToLocal, calculateCountdown } from '../../lib/utils/dateUtils';
import { Row, Col } from 'react-bootstrap';
import { CgTrash } from 'react-icons/cg';
import { AiFillEdit } from 'react-icons/ai';
import { RiMegaphoneLine } from 'react-icons/ri';
import { BsHandThumbsUp, BsExclamationTriangle } from 'react-icons/bs';
import { Button } from 'react-bootstrap';
import defaultAvatar from '../../assets/default.png';
import { FaRProject } from 'react-icons/fa6';



export const Notices = ({ notices, handleEditNotice, handleDeleteNotice, username }) => {

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
                    <Row>
                        <Col className='col-md-9 d-flex justify-content-between flex-column'
                        >
                            <p className='mb-0' style={{ marginLeft: '12px' }}>{notice.text}</p>

                            <small className='me-auto'>
                                <span
                                    style={{ color: 'gray' }}
                                >
                                    Expires In:
                                </span>  {countdowns[idx] || calculateCountdown(notice.expiresAt)}
                            </small>
                        </Col>
                        <Col>

                            {location.pathname === '/user/profile' ?
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
                                        {/* </span> */}
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
                                            style={{ borderRadius: '50%', width: 50, height: 50 }}
                                            className='d-flex ms-auto me-0'
                                        />
                                    </div>
                                    <div className='d-grid'>
                                        <div
                                            className='d-flex justify-content-end'>
                                            <Button
                                                className='notice__reaction-btn'
                                            >
                                                <BsHandThumbsUp
                                                    size={19}
                                                />
                                            </Button>
                                            <Button
                                                className='notice__reaction-btn'
                                            >
                                                <RiMegaphoneLine
                                                    size={19}
                                                />
                                            </Button>
                                            <Button
                                                className='notice__reaction-btn'
                                            >
                                                <BsExclamationTriangle
                                                    size={19}
                                                />
                                            </Button>
                                        </div>
                                        <small className='text-end mt-auto notice__create-date'>
                                            {formatDateToLocal(notice.timestamp)}
                                        </small>
                                    </div>
                                </div>
                            }
                        </Col>

                    </Row>
                    <hr />
                    {/* <div
                    key={idx}
                    className='d-grid mt-2 notice'
                >
                    <hr />

                    <div className='d-flex align-items-center w-100 mb-0'>

                        <p className='mb-0'>{notice.text}</p>

                        {location.pathname === '/user/profile' ?
                            <span className='d-flex ms-auto'>
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
                            :
                            <span className='ms-auto'>
                                <img
                                    src={notice.avatarUrl || defaultAvatar}
                                    alt="Profile"
                                    style={{ borderRadius: '50%', width: 50, height: 50 }}
                                    className='d-flex ms-auto me-auto'
                                />
                                <p className='my-0 text-center'>
                                    <strong>{notice.username}</strong>
                                </p> 
                            </span>
                        }

                    </div>

                    <div className='d-flex align-items-end'>

                        <small className='me-auto'>
                            <span
                                style={{ color: 'gray' }}
                            >
                                Expires In:
                            </span>  {countdowns[idx] || calculateCountdown(notice.expiresAt)}
                        </small>


                        <div
                            className='d-grid'
                        >
                            <div
                                className='d-flex justify-content-between'>
                                <Button
                                    className='notice__reaction-btn'
                                >
                                    <BsHandThumbsUp
                                        size={20}
                                    />
                                </Button>
                                <Button
                                    className='notice__reaction-btn'
                                >
                                    <RiMegaphoneLine
                                        size={20}
                                    />
                                </Button>
                                <Button
                                    className='notice__reaction-btn'
                                >
                                    <BsExclamationTriangle
                                        size={20}
                                    />
                                </Button>
                            </div>
                            <small>
                                <span style={{ color: 'gray' }}>
                                    Created on:
                                </span> {formatDateToLocal(notice.timestamp)}
                            </small>
                        </div>
                    </div>

                </div> */}

                </div>
            ))}
        </>
    );
};
