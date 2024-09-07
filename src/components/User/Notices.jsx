import React, { useState, useEffect } from 'react';
import { formatDateToLocal, calculateCountdown } from '../../lib/utils/dateUtils';
import { CgTrash } from "react-icons/cg";
import { AiFillEdit } from "react-icons/ai";
import { Button } from 'react-bootstrap';
import { Loading } from '../Loading/Loading';



export const Notices = ({ notices, handleEditNotice, handleDeleteNotice }) => {

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

                    <p className='d-flex w-100 mb-0'>
                        {notice.text}


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
                    </p>

                    <div className='d-flex'>

                        <small className='me-auto'>
                            <span style={{ color: 'gray' }}>
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
