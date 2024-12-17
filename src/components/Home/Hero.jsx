import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { BsReply } from "react-icons/bs";
import { RiSave2Line } from "react-icons/ri";
import { BsHandThumbsUp } from 'react-icons/bs';
import { AiOutlineExclamationCircle } from "react-icons/ai";
import defaultAvatar from '../../assets/default.png';

export const Hero = () => {

    const [timeLeft, setTimeLeft] = useState(5);
    const [isWaiting, setIsWaiting] = useState(false);
    const [showNoticeSample, setShowNoticeSample] = useState(true);

    useEffect(() => {
        let timer;
        if (!isWaiting) {
            if (timeLeft > 0) {
                timer = setInterval(() => {
                    setTimeLeft((prevTime) => prevTime - 1);
                }, 1000);
            } else {
                setIsWaiting(true);
                setShowNoticeSample(false);
                setTimeout(() => {
                    setTimeLeft(5);
                    setIsWaiting(false);
                    setShowNoticeSample(true);
                }, 3000);
            }
        }
        return () => clearInterval(timer);
    }, [timeLeft, isWaiting]);

    const formatTime = (seconds) => {
        const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
        const secs = String(seconds % 60).padStart(2, "0");
        return ` ${minutes}:${minutes}։${secs}`;
    };

    // const createDate = new Date();
    const hideOnExpired = showNoticeSample ? '' : 'visually-hidden';

    return (
        <Row className='w-75 m-auto home__body-hero-sample-row py-3 px-2'>
            {/* Text and Countdown Col */}
            {/* {showNoticeSample ? */}
            <>
                <Col className='col-md-9 d-flex justify-content-between flex-column'
                >
                    <p className={`mb-0 text-break`}>
                        I've had a busy day 😪. Time to watch some tv 📺.
                    </p>

                    <small className={`me-auto`}>
                        <span
                            style={{ color: 'gray' }}
                        >
                            Expires In:
                        </span>
                        {/* {formatTime(timeLeft)} */}
                    </small>
                </Col>

                {/* Username, Profile Picture, Edit/Delete, Interaction Col */}
                <Col className='col-md-3 d-flex flex-column justify-content-end'>

                    {/* Username and Profile Picture */}
                    <div className={`d-flex justify-content-end align-items-center mt-auto`}>

                        <p
                            className='w-100 my-0 text-end notice__username'
                        >
                            <strong>Robert</strong>
                        </p>
                        <img
                            src={defaultAvatar}
                            alt="profilePicture"
                            className='d-flex ms-auto notice__avatar'
                        />
                    </div>

                    {/* Interaction w/ Notice */}
                    <div className={`d-flex flex-column justify-content-end `}>
                        <div className='d-grid'>
                            <div
                                className='d-flex justify-content-end align-items-center'
                                style={{ height: '35px' }}
                            >
                                <div
                                    className={`notice__reaction-btn ms-2`}
                                >
                                    <BsHandThumbsUp size={19} />

                                </div>
                                <div
                                    className={`notice__reaction-btn ms-2`}
                                >
                                    <RiSave2Line size={20} />
                                </div>
                                <div
                                    className={`notice__reaction-btn ms-2`}
                                >
                                    <BsReply size={23} />
                                </div>
                                <div
                                    className='notice__reaction-btn ms-2'
                                >
                                    <AiOutlineExclamationCircle
                                        size={22}
                                    />
                                </div>
                            </div>
                            <small className='text-end mt-auto notice__create-date'>
                                Dec 03, 14:05
                            </small>
                        </div>
                    </div>
                </Col>
            </>
            {/* : */}
            {/* <>
                    <h4 className='mb-0'> Once the timer ends, it's gone forever.</h4>
                </> */}
            {/* } */}
        </Row>
    )
}
