import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { formatDateToLocal, calculateCountdown } from '../../lib/utils/dateUtils';
import { CgTrash } from "react-icons/cg";
import { AiFillEdit } from "react-icons/ai";
import { Button } from 'react-bootstrap';
import defaultAvatar from '../../assets/default.png';
import { Loading } from '../Loading/Loading';



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
                <div
                    key={idx}
                    className='d-grid mt-2 notice'
                >
                    <hr />

                    <div className='d-flex align-items-center w-100 mb-0'>

                        <p>{notice.text}</p>

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
                            <span className='d-grid ms-auto'>
                                <img
                                    src={notice.avatarUrl || defaultAvatar}
                                    alt="Profile"
                                    style={{ borderRadius: '50%', width: 50, height: 50 }}
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

                        <small>
                            <span style={{ color: 'gray' }}>
                                Created on:
                            </span> {formatDateToLocal(notice.timestamp)}
                        </small>

                    </div>

                </div>
            ))}
        </>
    );
};
