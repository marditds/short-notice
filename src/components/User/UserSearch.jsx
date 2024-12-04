import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useUserInfo from '../../lib/hooks/useUserInfo';
import { getAvatarUrl as avatarUrl } from '../../lib/utils/avatarUtils';
import defaultAvatar from '../../assets/default.png';
import { Button, Form, Modal, Stack } from 'react-bootstrap';
import { CgSearch } from "react-icons/cg";
import { Loading } from '../Loading/Loading';

export const UserSearch = ({ userId }) => {


    const { getAllUsersByString, getBlockedUsersByUser } = useUserInfo();

    const [searchUsername, setSearchUsername] = useState('');
    const [usersResult, setUsersResult] = useState([]);
    const [show, setShow] = useState(false);
    const [isResultLoading, setIsResultLoading] = useState(false);

    const [limit] = useState(7);
    const [offset, setOffset] = useState(0);
    const [hasMoreProfiles, setHasMoreProfiles] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const onUserSearchChange = (e) => {
        setSearchUsername(e.target.value);
    };


    const fetchSearchResults = async () => {
        if (offset === 0) {
            setIsResultLoading(true);
        }
        setIsLoadingMore(true);
        try {

            console.log('userIdasasas:', userId);
            console.log('limit:', limit);
            console.log('offset:', offset);

            const users = await getAllUsersByString(searchUsername, limit, offset);

            const blockedUsers = await getBlockedUsersByUser(userId);

            const filteredUsers = users.filter((user) =>
                !blockedUsers.some((blocked) => user.$id === blocked.blocked_id)
            );

            console.log('filteredUsers,', filteredUsers);

            if (filteredUsers) {
                setUsersResult(prevUsers => {
                    const moreUsers = filteredUsers?.filter(user =>
                        !prevUsers.some(loadedUser => loadedUser.$id === user.$id)
                    );

                    return [...prevUsers, ...moreUsers];
                });
            } else {
                return 'No results';
            }

            if (users?.length < limit) {
                setHasMoreProfiles(false);
            } else {
                setHasMoreProfiles(true);
                setOffset(offset + limit);
            }

            console.log('users:', users);

        } catch (error) {
            console.error('Error listing users:', error);
        } finally {
            setIsResultLoading(false);
            setIsLoadingMore(false);
        }
    }

    const handleShowSearchUsersModal = async () => {
        setShow(true);
        fetchSearchResults();
    };

    const handleLoadMoreProfiles = () => {
        fetchSearchResults();
    }

    const handleCloseSeachUsersModal = () => {
        setShow(false)
        setOffset(preVal => preVal = 0);
        setUsersResult([]);
    };

    return (
        <>
            <Button
                onClick={handleShowSearchUsersModal}
                className='ms-3 p-0'
                disabled={searchUsername === '' ? true : false}
                style={{ maxHeight: '36px' }}
            >
                <CgSearch
                    size={24}
                />
            </Button>
            <Form>
                <Form.Group controlId="userSearch">
                    <Form.Label className='visually-hidden'>Search Users</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={1}
                        placeholder='User Search'
                        onChange={onUserSearchChange}
                    />
                </Form.Group>
            </Form>

            <Modal
                show={show}
                onHide={handleCloseSeachUsersModal}
                style={{ zIndex: '9999999' }}
                className='userhome__body--search-results-modal'
            >
                <Modal.Header>
                    <Modal.Title>Showing results for "{searchUsername}"</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Stack
                        gap={3}
                        direction='horizontal'
                        className='d-flex flex-wrap justify-content-start'>
                        {/* <Row className='gx-4'> */}
                        {isResultLoading ?
                            <div><Loading color={'white'} /></div>
                            :
                            (
                                usersResult ? usersResult?.map((user) =>
                                    <div
                                        key={user.$id}
                                        className='userhome__body--search-results-profiles'
                                    >
                                        {/* <Col
                                        key={user.$id}
                                        className='userhome__body--search-results 
'
                                    > */}
                                        <Link to={`../user/${user.username}`} className='w-100 d-flex align-items-center justify-content-end'>
                                            {user?.username}
                                            < img src={avatarUrl(user.avatar) || defaultAvatar}
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
                    {hasMoreProfiles ?
                        <Button
                            onClick={handleLoadMoreProfiles}
                            disabled={isLoadingMore || !hasMoreProfiles}
                        >
                            {isLoadingMore ?
                                <><Loading size={24} /> Loading...</>
                                : 'Load More Profiles'}
                        </Button>
                        :
                        'No more profiles'
                    }

                </Modal.Body>
                <Modal.Footer className='userhome__body--search-results-modal-footer'>
                    <Button variant="secondary" onClick={handleCloseSeachUsersModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
