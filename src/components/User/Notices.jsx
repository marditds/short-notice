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
                <p
                    key={idx}>
                    {notice.text}
                    <br />
                    <small>
                        {formatDateToLocal(notice.timestamp)}
                    </small>
                    <br />
                    <small>
                        {formatDateToLocal(notice.expiresAt)}
                    </small>
                    <br />
                    <Button onClick={() => handleEditNotice(notice.$id, notice.text)}>
                        <AiFillEdit size={20} />
                    </Button>
                    <Button onClick={() => handleDeleteNotice(notice.$id)} disabled={removingNoticeId === notice.$id}>
                        {removingNoticeId === notice.$id ?
                            <Loading /> :
                            <CgTrash size={20} />
                        }
                    </Button>

                </p>
            ))}
        </>
    );
};
