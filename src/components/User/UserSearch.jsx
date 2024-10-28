import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useUserInfo from '../../lib/hooks/useUserInfo';
import { getAvatarUrl as avatartUrl } from '../../lib/utils/avatarUtils';
import defaultAvatar from '../../assets/default.png';
import { Button, Form, Modal, Stack, Row, Col } from 'react-bootstrap';
import { CgSearch } from "react-icons/cg";
import { Loading } from '../Loading/Loading';

export const UserSearch = () => {

    const { getAllUsersByString } = useUserInfo();

    const [searchUsername, setSearchUsername] = useState('');
    const [usersResult, setUsersResult] = useState(null);
    const [show, setShow] = useState(false);
    const [isResultLoading, setIsResultLoading] = useState(false);

    const onUserSearchChange = (e) => {
        setSearchUsername(e.target.value);
    };

    const handleShowSearchUsersModal = async () => {
        try {
            setIsResultLoading(true);
            setShow(true);

            const users = await getAllUsersByString(searchUsername);
            setUsersResult(users);

            console.log('users:', users);

        } catch (error) {
            console.error('Error listing users:', error);
        } finally {
            setIsResultLoading(false);
        }
    };

    const handleCloseSeachUsersModal = () => setShow(false);

    return (
        <>
            <Button
                onClick={handleShowSearchUsersModal}
                className='ms-3'
                disabled={searchUsername === '' ? true : false}
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

            <Modal show={show} onHide={handleCloseSeachUsersModal} style={{ zIndex: '9999999' }}>
                <Modal.Header closeButton>
                    <Modal.Title>Showing results for {searchUsername}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Stack
                        gap={3}
                        direction='horizontal'
                        className=' flex-wrap'>
                        {/* <Row className='gx-4'> */}
                        {isResultLoading ?
                            <div><Loading color={'black'} /></div>
                            :
                            (
                                usersResult ? usersResult.map((user) =>
                                    <div
                                        key={user.$id}
                                        className='userhome__body--search-results'
                                    >
                                        {/* <Col
                                        key={user.$id}
                                        className='userhome__body--search-results 
'
                                    > */}
                                        <Link to={`../user/${user.username}`} className='w-100 d-flex align-items-center justify-content-end'>
                                            {user?.username}
                                            < img src={avatartUrl(user.avatar) || defaultAvatar}
                                                alt="Profile"
                                                style={{ borderRadius: '50%', width: 50, height: 50, marginLeft: '12px' }}
                                                className='d-flex'
                                            />
                                        </Link>
                                        {/* </Col> */}
                                    </div>
                                )
                                    :
                                    'No user found')
                        }
                        {/* </Row> */}
                    </Stack>
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
