import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Dropdown, DropdownButton, Modal } from 'react-bootstrap';
import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import { CgSearch } from "react-icons/cg";
import { Loading } from '../Loading/Loading';

export const Tools = ({ googleLogout, removeSession, setIsLoggedIn, setGoogleUserData }) => {

    const [username, setUsername] = useState('Username')
    const [show, setShow] = useState(false);

    const handleCloseSeachUsersModal = () => setShow(false);
    const handleShowSeachUsersModal = () => setShow(true);

    return (
        <>
            <div className='userhome__body--profile--tools 
        w-100 
        d-flex 
        fixed-top
        '>
                <Button
                    onClick={handleShowSeachUsersModal}
                    className='ms-3'
                >
                    <CgSearch
                        size={24}
                    />
                </Button>
                <Form>
                    <Form.Group className="mb-3" controlId="userSearch">
                        <Form.Label className='visually-hidden'>Search Users</Form.Label>
                        <Form.Control as="textarea" rows={1} placeholder='User Search' />
                    </Form.Group>
                </Form>


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

            <Modal show={show} onHide={handleCloseSeachUsersModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Showing results for {username}</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSeachUsersModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCloseSeachUsersModal}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
