import React from 'react';
import { formatDateToLocal, calculateCountdown } from '../../lib/utils/dateUtils';

export const Spreads = ({ notices, username }) => {
    return (
        <>
            {notices.map((notice, idx) => (
                <div
                    key={idx}
                    className='d-grid mt-2 notice'
                >
                    <hr />

                    <div className='d-flex align-items-center w-100 mb-0'>

                        <p className='mb-0'>{notice.text}</p>

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
    )
}
