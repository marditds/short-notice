import React from 'react';
import { CgTrash } from "react-icons/cg";
import { AiFillEdit } from "react-icons/ai";
import { Button } from 'react-bootstrap';

export const Notices = ({ notices, handleEditNotice, handleDeleteNotice }) => {
    return (
        <>
            {notices.map((notice, idx) => (
                <p
                    key={idx}>
                    {notice.text}
                    <Button onClick={() => handleEditNotice(notice.$id, notice.text)}>
                        <AiFillEdit size={20} />
                    </Button>
                    <Button onClick={() => handleDeleteNotice(notice.$id)}>
                        <CgTrash size={20} />
                    </Button>

                </p>
            ))}
        </>
    );
};
