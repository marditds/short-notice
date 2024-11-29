import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownButton, Form, Row, Col } from 'react-bootstrap';
import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import { UserSearch } from './UserSearch';

export const Tools = ({ googleLogout, removeSession, setIsLoggedIn, setGoogleUserData, userId }) => {


    return (
        <>
            <div className='userhome__body--profile--tools 
                w-100 
                d-flex 
                fixed-top
                '>


                <UserSearch userId={userId} />

                <DropdownButton
                    drop='down'
                    id="dropdown-basic-button"
                    className='ms-auto userhome__body--profile--tools--dropdown'
                    title={<PiDotsThreeOutlineVertical
                        size={30}
                    />}>
                    <Dropdown.Item
                        as={Link}
                        to='/user/feed'
                        className='userhome__body--btn w-100'
                    >
                        Feed
                    </Dropdown.Item>
                    <Dropdown.Item
                        as={Link}
                        to='/user/profile'
                        className='userhome__body--btn w-100'
                    >
                        Profile
                    </Dropdown.Item>
                    <Dropdown.Item
                        as={Link}
                        to='/user/settings'
                        className='userhome__body--btn w-100'
                    >
                        Settings
                    </Dropdown.Item>
                    <Dropdown.Item
                        as={Link}
                        to='/'
                        onClick={
                            async () => {
                                await removeSession();
                                googleLogout();
                                setIsLoggedIn(preVal => false);
                                setGoogleUserData(null);
                                localStorage.removeItem('accessToken');
                                console.log('Logged out successfully.');
                                window.location.href = '/';
                            }
                        }
                        className='userhome__body--btn w-100'
                    >
                        Log out
                    </Dropdown.Item>
                </DropdownButton>
            </div>
        </>
    )
}
