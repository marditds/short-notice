import React from 'react';
import { formatDateToLocal } from '../../lib/utils/dateUtils';
import { CgTrash } from "react-icons/cg";
import { AiFillEdit } from "react-icons/ai";
import { Button } from 'react-bootstrap';
import { Loading } from '../Loading/Loading';

export const Notices = ({ notices, handleEditNotice, handleDeleteNotice, removingNoticeId }) => {


    return (
        <>
            {notices.map((notice, idx) => (
                <div
                    key={idx}
                    className='d-grid mt-2'
                >
                    <hr />

                    <p className='d-flex w-100 mb-2'>
                        {notice.text}


                        <Button
                            className='ms-auto'
                            onClick={() => handleEditNotice(notice.$id, notice.text)}
                        >
                            <AiFillEdit size={20} />
                        </Button>
                        <Button
                            className='ms-2'
                            onClick={() => handleDeleteNotice(notice.$id)} disabled={removingNoticeId === notice.$id}
                        >
                            {removingNoticeId === notice.$id ?
                                <Loading /> :
                                <CgTrash size={20} />
                            }
                        </Button>
                    </p>

                    <div className='d-flex'>

                        <small className='me-auto'>
                            <span style={{ color: 'gray' }}>
                                Expires At:
                            </span> {formatDateToLocal(notice.expiresAt)}
                        </small>

                        {/* <small>
                            <span style={{ color: 'gray' }}>
                                Created on:
                            </span> {formatDateToLocal(notice.timestamp)}
                        </small> */}

                    </div>
                </div>
            ))}
        </>
    );
};
