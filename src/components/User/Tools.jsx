import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useUserInfo from '../../lib/hooks/useUserInfo';
import useUserAvatar from '../../lib/hooks/useUserAvatar';
import { getAvatarUrl as avatartUrl } from '../../lib/utils/avatarUtils';
import defaultAvatar from '../../assets/default.png';
import { Button, Form, Dropdown, DropdownButton, Modal, Row, Col } from 'react-bootstrap';
import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import { CgSearch } from "react-icons/cg";
import { Loading } from '../Loading/Loading';

export const Tools = ({ googleLogout, removeSession, setIsLoggedIn, setGoogleUserData }) => {

    const { getUserByUsername } = useUserInfo();

    const { getUserAvatarById } = useUserAvatar();

    const [searchUsername, setSearchUsername] = useState('');
    const [userResult, setUserResult] = useState(null);
    const [userResultAvatar, setUserResultAvatar] = useState();
    const [show, setShow] = useState(false);

    const onUserSearchChange = (e) => {
        setSearchUsername(e.target.value);
    };

    const handleShowSearchUsersModal = async () => {
        try {
            const user = await getUserByUsername(searchUsername);
            setUserResult(user);

            const usrAvatar = await getUserAvatarById(user.$id);
            setUserResultAvatar(usrAvatar);

            setShow(true);
        } catch (error) {
            console.error('Error listing users:', error);
        }
    };

    useEffect(() => {
        console.log('userResultAvatar', userResultAvatar);

    }, [userResultAvatar])

    const handleCloseSeachUsersModal = () => setShow(false);


    return (
        <>
            <div className='userhome__body--profile--tools 
        w-100 
        d-flex 
        fixed-top
        '>
                <Button
                    onClick={handleShowSearchUsersModal}
                    className='ms-3'
                >
                    <CgSearch
                        size={24}
                    />
                </Button>
                <Form>
                    <Form.Group className="mb-3" controlId="userSearch">
                        <Form.Label className='visually-hidden'>Search Users</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={1}
                            placeholder='User Search'
                            onChange={onUserSearchChange}
                        />
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

            <Modal show={show} onHide={handleCloseSeachUsersModal} style={{ zIndex: '9999999' }}>
                <Modal.Header closeButton>
                    <Modal.Title>Showing results for {searchUsername}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {userResult ?
                        // `Username: ${userResult.username}` 
                        <Row>
                            <Col className='d-flex align-items-center'>
                                {userResult?.username}
                                < img src={userResultAvatar || defaultAvatar}
                                    alt="Profile"
                                    style={{ borderRadius: '50%', width: 50, height: 50, marginLeft: '0px' }}
                                    className='d-flex'
                                />
                            </Col>
                        </Row>
                        :
                        'No user found'}
                </Modal.Body>
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
